using Server.BL;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesPackage
    {
        //----------------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //----------------------------------------------------------------------------------------------------------
        public static SqlConnection Connect()
        {
            // read the connection string fromm the web.config file
            IConfigurationRoot configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            // create the connection to the db
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        //---------------------------------------------------------------------------------------------------------|
        //---------------------------------------------------------------------------------------------------------|
        //---------------------------------------------------------------------------------------------------------|


        //--------------------------------------------------------------------------------------------------------------------
        // This method manages the updating and inserting of the package, type replacements count and the couple's type weight
        //--------------------------------------------------------------------------------------------------------------------
        public int InsertPackageToDB(PackageApprovalData packageApprovalData, string actionString)
        {
            int successIndicator = 0;
            try
            {

                string spName1;
                string spName2;

                if (actionString == "Insert")
                {
                    spName1 = "SPInsertPackageDetails";
                    spName2 = "SPInsertCoupleTypeWeights";
                }

                else // If actionString is "Update"
                {
                    spName1 = "SPUpdatePackageDetails";
                    spName2 = "SPUpdateCoupleTypeWeights";
                }


                // Extract the package from the data
                Package package = packageApprovalData.Package;

                using (SqlConnection con = Connect())
                {
                    //* Step one: Inserting or updating the package details 

                    using (SqlCommand cmd = CreateInsertOrUpdatePackageDetailsSP(spName1, con, package))
                    {
                        successIndicator = cmd.ExecuteNonQuery(); // Returns the number of rows affected by the command
                    }
                }

                // If step one was successful, proceed to step two
                if (successIndicator == 1)
                {
                    //* Step two: Inserting the relevant suppliers into the database
                    successIndicator += InsertPackageSuppliersSP(package.SelectedSuppliers, package.AlternativeSuppliers, package.CoupleEmail, actionString);

                    // If step two was successful, proceed to step three
                    if (successIndicator == 2)
                    {
                        //* Step three: Inserting or Updating the couple's type weights in the database
                        successIndicator += InsertOrUpdateCoupleTypeWeights(packageApprovalData.TypeWeights, packageApprovalData.Package.CoupleEmail, spName2);

                        // If step three was successful, proceed to step four
                        if (successIndicator == 3)
                        {
                            //* Step four: Updating the type replacements counts in the database
                            successIndicator += UpdateTypeReplacementsCounts(packageApprovalData.TypeReplacements);
                        }
                    }
                }

                return successIndicator; // Return the final success indicator
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while inserting package details in the InsertPackageToDB method in step  " + successIndicator + " " + ex.Message);
            }
        }


        private SqlCommand CreateInsertOrUpdatePackageDetailsSP(string spName, SqlConnection con, Package package)

        {

            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = spName;
            cmd.CommandTimeout = 10;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@couple_email", package.CoupleEmail);
            cmd.Parameters.AddWithValue("@total_cost", package.TotalCost);
            cmd.Parameters.AddWithValue("@total_score", package.TotalScore);

            return cmd;
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
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure to retrieve package details.
                    using (SqlCommand cmd = CreateReadPackageDetailsWithSP(con, "SPGetPackageDetails", email))
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
                        using (SqlCommand selectedCmd = CreateReadPackageSuppliersEmailsWithSP(con, "SPGetSelectedPackageSuppliers", package.PackageId))
                        {
                            // Execute the SqlCommand and obtain a SqlDataReader.
                            using (SqlDataReader selectedReader = selectedCmd.ExecuteReader())
                            {
                                //* Step 2: Retrieve the selected suppliers from the datebase using the BuildSuppliers method from the DBservicesSupplier

                                // Construct selected suppliers using dataReader.
                                DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
                                selectedSuppliers = dBServicesSupplier.BuildSuppliers(selectedReader);
                            }
                        }

                        // Create a SqlCommand to execute the stored procedure to retrieve alternative suppliers.
                        using (SqlCommand alternativeCmd = CreateReadPackageSuppliersEmailsWithSP(con, "SPGetAlternativePackageSuppliers", package.PackageId))
                        {
                            // Execute the SqlCommand and obtain a SqlDataReader.
                            using (SqlDataReader alternativeReader = alternativeCmd.ExecuteReader(CommandBehavior.CloseConnection))
                            {
                                //* Step 3: Retrieve the alternative suppliers from the datebase using the BuildSuppliers method from the DBservicesSupplier

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

                        //* Step 5: Assign those beautiful supplier into the relevant properties. 

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

            //* Step 6:  Return the retrieved package object (whether its empty or not).
            return package;
        }



        private SqlCommand CreateReadPackageDetailsWithSP(SqlConnection con, String spName, string email)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@CoupleEmail", email);

            return cmd;
        }



        private SqlCommand CreateReadPackageSuppliersEmailsWithSP(SqlConnection con, String spName, int PackageId)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@package_id", PackageId);

            return cmd;
        }







        //------------------------------------------------------------------------------
        // This method manages the updating and inserting of the suppliers of a package
        //------------------------------------------------------------------------------
        private int InsertPackageSuppliersSP(List<Supplier> selectedSuppliers, Dictionary<string, List<Supplier>> alternativeSuppliers, string coupleEmail, string actionString)
        {
            try
            {

                int suppliersInsertResult = 0;  // Used to monitor that all the suppliers of the package were inserted.

                using (SqlConnection con2 = Connect())
                {
                    // If the actionString is "Update", delete existing suppliers from the package. Annihilate them!
                    if (actionString == "Update")
                    {
                        using (SqlCommand cmd2 = CreateDeletePackageSuppliersSP("SPDeletePackageSuppliers", con2, coupleEmail))
                        {
                            int numEffected = cmd2.ExecuteNonQuery();
                        }
                    }

                    // Insert selected suppliers
                    foreach (var supplier in selectedSuppliers)
                    {
                        using (SqlCommand cmd2 = CreateInsertPackageSuppliersSP("SPInsertPackageSupplier", con2, supplier.SupplierEmail, coupleEmail, true))
                        {
                            suppliersInsertResult += cmd2.ExecuteNonQuery();
                        }
                    }

                    // Insert alternative suppliers for each type
                    foreach (KeyValuePair<string, List<Supplier>> typeList in alternativeSuppliers)
                    {
                        foreach (var supplier in typeList.Value)
                        {
                            using (SqlCommand cmd2 = CreateInsertPackageSuppliersSP("SPInsertPackageSupplier", con2, supplier.SupplierEmail, coupleEmail, false))
                            {
                                suppliersInsertResult += cmd2.ExecuteNonQuery();
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
                throw new Exception("An error occurred while updating type counts: " + ex.Message);
            }
        }


        private SqlCommand CreateDeletePackageSuppliersSP(string spName, SqlConnection con, string coupleEmail)
        {
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = spName;
            cmd.CommandTimeout = 10;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@couple_email", coupleEmail);

            return cmd;
        }

        private SqlCommand CreateInsertPackageSuppliersSP(string spName, SqlConnection con, string supplierEmail, string coupleEmail, bool isSelected)
        {
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = spName;
            cmd.CommandTimeout = 10;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@supplier_email", supplierEmail);
            cmd.Parameters.AddWithValue("@couple_email", coupleEmail);
            cmd.Parameters.AddWithValue("@is_selected", isSelected); // Assuming is_selected is a boolean value

            return cmd;
        }





        //--------------------------------------------------------------------------------------------------------------------
        // This method inserts or updates couple's type weights
        //--------------------------------------------------------------------------------------------------------------------
        public int InsertOrUpdateCoupleTypeWeights(Dictionary<string, double> typeWeights, string coupleEmail, string spName)
        {
            int successIndicator = 0;
            try
            {
                using (SqlConnection con3 = Connect())
                {
                    // Iterate through each key-value pair in the typeWeights dictionary
                    foreach (var kvp in typeWeights)
                    {
                        // Create a SqlCommand object for executing the stored procedure
                        using (SqlCommand cmd3 = CreateInsertOrUpdateCoupleTypeWeightsSP(spName, con3, coupleEmail, kvp.Key, kvp.Value))
                        {
                            // Execute the stored procedure and increment successIndicator
                            successIndicator += cmd3.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle the exception appropriately
                throw new Exception("An error occurred while inserting or updating type weights: " + ex.Message);
            }

            // Return 1 if all type weights were successfully inserted or updated; otherwise, return 0
            return successIndicator == typeWeights.Count ? 1 : 0;
        }


        private SqlCommand CreateInsertOrUpdateCoupleTypeWeightsSP(string spName, SqlConnection con, string coupleEmail, string supplierType, double typeWeight)

        {

            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = spName;
            cmd.CommandTimeout = 10;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@couple_email", coupleEmail);
            cmd.Parameters.AddWithValue("@supplier_type_name", supplierType);
            cmd.Parameters.AddWithValue("@type_weight", typeWeight);

            return cmd;
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

                //// Create a dictionary to store the vendor names and their counts
                //Dictionary<string, int> vendorCounts = new Dictionary<string, int>();

                //// Iterate over the vendors array and typesReplacements array simultaneously
                //for (int i = 0; i < vendors.Length; i++)
                //{
                //    if (typesReplacements[i] == 1)
                //    {
                //        vendorCounts[vendors[i]] = typesReplacements[i];
                //    }
                //}

                using (SqlConnection con3 = Connect())
                {
                    // Update counts in the database
                    foreach (string vendor in typesReplacements)
                    {
                        using (SqlCommand cmd3 = CreateUpdateTypeCountsSP("SPUpdateTypeCount", con3, vendor))
                        {
                            successIndicator += cmd3.ExecuteNonQuery();
                        }
                    }
                }

                // Return 1 if all type replacement counts were successfully updated; otherwise, return 0
                return successIndicator == typesReplacements.Length ? 1 : 0;
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while updating replacement counts: " + ex.Message);
            }
        }


        private SqlCommand CreateUpdateTypeCountsSP(string spName, SqlConnection con, string supplierType)
        {
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = spName;
            cmd.CommandTimeout = 10;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@supplier_type_name", supplierType);

            return cmd;
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
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateReadTypeCountsWithSP(con, "SPGetTypeCounts"))
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

        private SqlCommand CreateReadTypeCountsWithSP(SqlConnection con, string spName)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            return cmd;

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
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateReadTopSuppliersWithSP(con, "SPGetSuppliersForPackage", couple))
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

        private SqlCommand CreateReadTopSuppliersWithSP(SqlConnection con, String spName, Couple couple)
        {
            SqlCommand cmd = new SqlCommand(); // Create the command object

            cmd.Connection = con;              // Assign the connection to the command object

            cmd.CommandText = spName;      // Can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution. The default is 30 seconds

            cmd.CommandType = CommandType.StoredProcedure; // The type of the command, can also be text

            // Add parameters
            cmd.Parameters.AddWithValue("@desiredDate", couple.DesiredDate);
            cmd.Parameters.AddWithValue("@desiredRegion", couple.DesiredRegion);
            cmd.Parameters.AddWithValue("@maxPrice", couple.Budget);
            cmd.Parameters.AddWithValue("@minCapacity", couple.NumberOfInvitees);

            return cmd;
        }
    }
}