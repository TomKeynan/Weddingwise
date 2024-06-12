using Server.BL;
using Server.Services;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesPackage
    {



        //--------------------------------------------------------------------------------------------------------------------
        // This method manages the updating and inserting of the package, type replacements count and the couple's type weight
        //--------------------------------------------------------------------------------------------------------------------
        public int InsertPackageToDB(PackageApprovalData packageApprovalData)
        {
            // Initialize success indicator
            int successIndicator = 0;

            try
            {
                // Extract action string from packageApprovalData
                string actionString = packageApprovalData.ActionString;

                // Determine stored procedure names based on action string
                string spName1 = actionString == "Insert" ? "SPInsertPackageDetails" : "SPUpdatePackageDetails";
                string spName2 = actionString == "Insert" ? "SPInsertCoupleTypeWeights" : "SPUpdateCoupleTypeWeights";

                // Extract the couple and package from the data
                Couple couple = packageApprovalData.Couple;
                Package package = couple.Package;

                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Step one: Insert or update the package details
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, spName1, new Dictionary<string, object>
                    {
                        { "@couple_email", package.CoupleEmail },
                        { "@total_cost", package.TotalCost },
                        { "@total_score", package.TotalScore }
                    }))
                    {
                        successIndicator = cmd.ExecuteNonQuery(); // Returns the number of rows affected by the command
                    }
                }

                // If step one was successful, proceed to step two
                if (successIndicator == 1)
                {
                    // Step two: Insert the relevant suppliers into the database
                    successIndicator += InsertPackageSuppliers(package.SelectedSuppliers, package.AlternativeSuppliers, package.CoupleEmail, actionString);

                    // If step two was successful, proceed to step three
                    if (successIndicator == 2)
                    {
                        // Step three: Insert or update the couple's type weights in the database
                        successIndicator += InsertOrUpdateCoupleTypeWeights(couple.TypeWeights, couple.Email, spName2);

                        // If step three was successful, proceed to step four
                        if (successIndicator == 3)
                        {
                            // Step four: Update the type replacements counts in the database
                            successIndicator += UpdateTypeReplacementsCounts(packageApprovalData.TypeReplacements);
                        }
                    }
                }

                // Return the final success indicator
                return successIndicator;
            }
            catch (Exception ex)
            {
                // Throw an exception with a detailed error message
                throw new Exception("An error occurred while inserting package details in the InsertPackageToDB method at step " + successIndicator + ": " + ex.Message);
            }
        }





        //------------------------------------------------------------------------------
        // This method manages the updating and inserting of the suppliers of a package
        //------------------------------------------------------------------------------
        private int InsertPackageSuppliers(List<Supplier> selectedSuppliers, Dictionary<string, List<Supplier>> alternativeSuppliers, string coupleEmail, string actionString)
        {
            try
            {
                int suppliersInsertResult = 0;  // Used to monitor that all the suppliers of the package were inserted.

                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // If the actionString is "Update", delete existing suppliers from the package. Annihilate them!
                    if (actionString == "Update")
                    {
                        using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPDeletePackageSuppliers", new Dictionary<string, object>
                        {
                            { "@couple_email", coupleEmail }
                        }))
                        {
                            int numEffected = cmd.ExecuteNonQuery();
                        }
                    }

                    // Insert selected suppliers
                    foreach (var supplier in selectedSuppliers)
                    {
                        using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertPackageSupplier", new Dictionary<string, object>
                        {
                            { "@supplier_email", supplier.SupplierEmail },
                            { "@couple_email", coupleEmail },
                            { "@is_selected", true } // Assuming is_selected is a boolean value
                        }))
                        {
                            suppliersInsertResult += cmd.ExecuteNonQuery();
                        }
                    }

                    // Insert alternative suppliers for each type
                    foreach (KeyValuePair<string, List<Supplier>> typeList in alternativeSuppliers)
                    {
                        foreach (var supplier in typeList.Value)
                        {
                            using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertPackageSupplier", new Dictionary<string, object>
                            {
                                { "@supplier_email", supplier.SupplierEmail },
                                { "@couple_email", coupleEmail },
                                { "@is_selected", false } // Assuming is_selected is a boolean value
                            }))
                            {
                                suppliersInsertResult += cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // Check if all insertions were successful
                if (suppliersInsertResult == (selectedSuppliers.Count + alternativeSuppliers.Sum(typeList => typeList.Value.Count)))
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred: " + ex.Message);
            }
        }






        //--------------------------------------------------------------------------------------------------------------------
        // This method inserts or updates couple's type weights
        //--------------------------------------------------------------------------------------------------------------------
        private int InsertOrUpdateCoupleTypeWeights(Dictionary<string, double> typeWeights, string coupleEmail, string spName)
        {
            int successIndicator = 0;
            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Iterate through each key-value pair in the typeWeights dictionary
                    foreach (var kvp in typeWeights)
                    {
                        // Create a SqlCommand object for executing the stored procedure
                        using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, spName, new Dictionary<string, object>
                        {
                            { "@couple_email", coupleEmail },
                            { "@supplier_type_name", kvp.Key },
                            { "@type_weight", kvp.Value }
                        }))
                        {
                            // Execute the stored procedure and increment successIndicator
                            successIndicator += cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle the exception appropriately
                throw new Exception("An error occurred: " + ex.Message);
            }

            // Return 1 if all type weights were successfully inserted or updated; otherwise, return 0
            return successIndicator == typeWeights.Count ? 1 : 0;
        }




        //--------------------------------------------------------------------------------------------
        // This method retrieves package details from the database. Used when the user couple logs in.
        //--------------------------------------------------------------------------------------------
        public Package GetCouplePackageFromDB(string email)
        {
            // Initialize variables.
            Package package = null;

            try
            {
                // Open a database connection.
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure to retrieve package details.
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetPackageDetails", new Dictionary<string, object>
            {
                { "@CoupleEmail", email }
            }))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader())
                        {
                            //* Step 1: Get details of the package

                            // Check if dataReader has any rows.
                            if (dataReader.Read())
                            {
                                // Construct the package object using data from the dataReader.
                                package = new Package
                                {
                                    PackageId = Convert.ToInt32(dataReader["package_id"]),
                                    TotalCost = Convert.ToInt32(dataReader["total_cost"]),
                                    TotalScore = Convert.ToDouble(dataReader["total_score"]),
                                    CoupleEmail = email,
                                };
                            }
                        }
                    }

                    // If package is found, proceed to retrieve selected suppliers.
                    if (package != null)
                    {
                        List<Supplier> selectedSuppliers = new List<Supplier>();
                        Dictionary<string, List<Supplier>> alternativeSuppliers = new Dictionary<string, List<Supplier>>();

                        // Create a SqlCommand to execute the stored procedure to retrieve selected suppliers.
                        using (SqlCommand selectedCmd = DBServiceHelper.CreateSqlCommand(con, "SPGetSelectedPackageSuppliers", new Dictionary<string, object>
                {
                    { "@package_id", package.PackageId }
                }))
                        {
                            // Execute the SqlCommand and obtain a SqlDataReader.
                            using (SqlDataReader selectedReader = selectedCmd.ExecuteReader())
                            {
                                //* Step 2: Retrieve the selected suppliers from the database using the BuildSuppliers method from the DBservicesSupplier

                                // Construct selected suppliers using dataReader.
                                DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
                                selectedSuppliers = dBServicesSupplier.BuildSuppliers(selectedReader);
                            }
                        }

                        // Create a SqlCommand to execute the stored procedure to retrieve alternative suppliers.
                        using (SqlCommand alternativeCmd = DBServiceHelper.CreateSqlCommand(con, "SPGetAlternativePackageSuppliers", new Dictionary<string, object>
                {
                    { "@package_id", package.PackageId }
                }))
                        {
                            // Execute the SqlCommand and obtain a SqlDataReader.
                            using (SqlDataReader alternativeReader = alternativeCmd.ExecuteReader(CommandBehavior.CloseConnection))
                            {
                                //* Step 3: Retrieve the alternative suppliers from the database using the BuildSuppliers method from the DBservicesSupplier

                                // Construct alternative suppliers using dataReader.
                                DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
                                List<Supplier> alternativeSuppliersList = dBServicesSupplier.BuildSuppliers(alternativeReader);

                                //* Step 4: Organize those suppliers by the type of supplier using a dictionary

                                // Initialize alternativeSuppliers dictionary.
                                string[] vendors = { "venue", "dj", "photographer", "dress", "rabbi", "hair and makeup" };
                                foreach (var supplierType in vendors)
                                {
                                    alternativeSuppliers[supplierType] = new List<Supplier>();
                                }

                                // Populate alternativeSuppliers dictionary.
                                foreach (var supplier in alternativeSuppliersList)
                                {
                                    alternativeSuppliers[supplier.SupplierType].Add(supplier);
                                }
                            }
                        }

                        //* Step 5: Assign those beautiful suppliers into the relevant properties. 

                        package.SelectedSuppliers = selectedSuppliers;
                        package.AlternativeSuppliers = alternativeSuppliers;
                    }
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while retrieving package details in the GetPackageFromDB method: " + ex.Message);
            }

            //* Step 6: Return the retrieved package object (whether it's empty or not).
            return package;
        }







        //--------------------------------------------------------------------------------------------------------------------
        // This method updates the counts of type replacements for various vendors in the database
        //--------------------------------------------------------------------------------------------------------------------
        private int UpdateTypeReplacementsCounts(string[] typesReplacements)
        {
            try
            {
                int successIndicator = 0;
                string[] vendors = { "venue", "dj", "photographer", "dress", "rabbi", "hair and makeup" };

                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Update counts in the database
                    foreach (string vendor in typesReplacements)
                    {
                        using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPUpdateTypeCount", new Dictionary<string, object>
                        {
                            { "@supplier_type_name", vendor }
                        }))
                        {
                            successIndicator += cmd.ExecuteNonQuery();
                        }
                    }
                }

                // Return 1 if all type replacement counts were successfully updated; otherwise, return 0
                return successIndicator == typesReplacements.Length ? 1 : 0;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred: " + ex.Message);
            }
        }



        //--------------------------------------------------------------------------------------------------
        // This method retrieves the suppliers based on the couple's budget and preferences 
        //--------------------------------------------------------------------------------------------------
        public List<Supplier> GetSuppliersForPackage(Couple couple)
        {
            // List to store the retrieved suppliers.
            List<Supplier> suppliers = new List<Supplier>();

            try
            {
                // Open a database connection.
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetSuppliersForPackage", new Dictionary<string, object>
                    {
                        { "@desiredDate", couple.DesiredDate },
                        { "@desiredRegion", couple.DesiredRegion },
                        { "@maxPrice", couple.Budget },
                        { "@minCapacity", couple.NumberOfInvitees }
                    }))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            // Construct suppliers using dataReader.
                            DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
                            suppliers = dBServicesSupplier.BuildSuppliers(dataReader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while retrieving suppliers for the package in method GetSuppliersForPackage: " + ex.Message);
            }

            // Return the retrieved suppliers.
            return suppliers;
        }


        //--------------------------------------------------------------------------------------------------
        // This method retrieves the count of how many times a supplier from the package has been replaced
        //--------------------------------------------------------------------------------------------------
        public Dictionary<string, int> GetReplacementCounts()
        {
            // Dictionary to store the replacement counts.
            Dictionary<string, int> replacementCounts = new Dictionary<string, int>();

            try
            {
                // Open a database connection.
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetTypeCounts", null))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            // Loop through the SqlDataReader to read replacement counts.
                            while (dataReader.Read())
                            {
                                string supplierType = dataReader["supplier_type_name"].ToString();
                                int count = Convert.ToInt32(dataReader["type_count"]);
                                replacementCounts[supplierType] = count;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while retrieving replacement counts in method GetReplacementCounts:" + ex.Message);
            }

            // Return the retrieved replacement counts.
            return replacementCounts;
        }



    }
}