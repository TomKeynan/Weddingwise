using Server.BL;
using Server.Services;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesSupplier
    {


        //-------------------------------------------------------
        // This method inserts a new supplier into the database.
        //-------------------------------------------------------
        public int InsertSupplier(Supplier supplier)
        {
            int successIndicator = 0;

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>
                    {
                        { "@supplier_email", supplier.SupplierEmail },
                        { "@business_name", supplier.BusinessName },
                        { "@password_hash", BCrypt.Net.BCrypt.EnhancedHashPassword(supplier.Password, 10) },
                        { "@phone_number", supplier.PhoneNumber },
                        { "@price", supplier.Price },
                        { "@capacity", supplier.Capacity },
                        { "@region_name", supplier.AvailableRegion },
                        { "@latitude", supplier.Latitude },
                        { "@longitude", supplier.Longitude },
                        { "@supplier_type_name", supplier.SupplierType }
                    };

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertSupplierDetails", parameters))
                    {
                        successIndicator = cmd.ExecuteNonQuery();
                    }

                    // Currently not in use, we are not recieving the available dates of the supplier.
                    if (supplier.AvailableDates != null && successIndicator == 1)
                    {
                        foreach (var date in supplier.AvailableDates)
                        {
                            Dictionary<string, object> dateParameters = new Dictionary<string, object>
                            {
                                { "@supplier_email", supplier.SupplierEmail },
                                { "@available_date", date }
                            };

                            using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertSupplierDates", dateParameters))
                            {
                                successIndicator += cmd.ExecuteNonQuery();
                            }
                        }
                    }
                    else
                    {
                        return successIndicator;
                    }
                }
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627) // Primary key violation error number
                {
                    throw;
                }
                else
                {
                    throw new Exception("An error occurred while inserting a new couple in the InsertCouple method, sql related" + ex.Message);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while inserting a new couple in the InsertCouple method" + ex.Message);
            }

            return successIndicator == 1 + supplier.AvailableDates.Count() ? 1 : 0;
        }




        //-------------------------------------------------------
        // This method retrieves couple details from the database.
        //-------------------------------------------------------
        public Supplier GetSupplier(string email, string enteredPassword)
        {
            // Initialize the couple object to null.
            Supplier supplier = null;

            try
            {
                // Open a database connection.
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure for retrieving couple details.
                    var parameters = new Dictionary<string, object>
                    {
                        { "@supplier_email", email }
                    };
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetSupplierDetails", parameters))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader())
                        {
                            //* Step 1: Check if there is such couple in the db using dataReader.
                            if (dataReader.Read())
                            {
                                //* Step 2: Construct the couple object using data from the dataReader.
                                supplier = new Supplier
                                {
                                    SupplierEmail = email,
                                    BusinessName = dataReader["business_name"].ToString(),
                                    PhoneNumber = dataReader["phone_number"].ToString(),
                                    Price = Convert.ToInt32(dataReader["price"]),
                                    Rating = dataReader["rating"] != DBNull.Value ? Convert.ToDouble(dataReader["rating"]) : (double?)null,
                                    AvailableRegion = dataReader["region_name"].ToString(),
                                    SupplierType = dataReader["supplier_type_name"].ToString(),
                                    IsActive = Convert.ToBoolean(dataReader["is_active"]),
                                    Capacity = dataReader["capacity"] != DBNull.Value ? Convert.ToInt32(dataReader["capacity"]) : (int?)null,
                                    Latitude = dataReader["latitude"] != DBNull.Value ? Convert.ToDouble(dataReader["latitude"]) : (double?)null,
                                    Longitude = dataReader["longitude"] != DBNull.Value ? Convert.ToDouble(dataReader["longitude"]) : (double?)null
                                };

                                //* Step 3: Retrieve the password of the couple and check if it the same password the user entered.
                                string hashedPasswordFromDatabase = dataReader["password_hash"].ToString();
                                bool passwordsMatch = BCrypt.Net.BCrypt.EnhancedVerify(enteredPassword, hashedPasswordFromDatabase);

                                if (!passwordsMatch)
                                {
                                    return null; // Passwords don't match, return null indicating unsuccessful authentication.
                                }
                            }
                            // If there is no such couple
                            else
                            {
                                return null;
                            }
                        }
                    }
                }
                //* step 4: get the dates of the supplier
                supplier.AvailableDates = GetDatesForSupplier(email);

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving supplier object in the GetSupplier method: " + ex.Message);
            }

            // step 5: return the supplier
            return supplier;
        }


        //-------------------------------------------------------
        // This method updates the supplier details
        //-------------------------------------------------------
        public int UpdateSupplier(Supplier supplier)
        {
            int successIndicator = 0;

            try
            {
                // Step 1: Update the details of the supplier
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    var parameters = new Dictionary<string, object>
            {
                { "@supplier_email", supplier.SupplierEmail },
                { "@business_name", supplier.BusinessName },
                { "@phone_number", supplier.PhoneNumber },
                { "@price", supplier.Price },
                { "@capacity", supplier.Capacity },
                { "@region_name", supplier.AvailableRegion },
                { "@latitude", supplier.Latitude },
                { "@longitude", supplier.Longitude }
            };

                    // Check if password is provided, hash it using BCrypt and update the password
                    if (supplier.Password != null)
                    {
                        parameters.Add("@password_hash", BCrypt.Net.BCrypt.EnhancedHashPassword(supplier.Password, 10));
                    }

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPUpdateSupplierDetails", parameters))
                    {
                        successIndicator = cmd.ExecuteNonQuery();
                    }

                    // If no available dates, return the result of updating supplier details
                    if (supplier.AvailableDates.Count == 0)
                    {
                        return successIndicator;
                    }

                    // Step 2: Update the supplier's available dates
                    successIndicator += UpdateSupplierDates(con, supplier);

                    // If both updating the details and updating the dates were successful, return success
                    return successIndicator > 1 ? 1 : 0;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the supplier: " + ex.Message);
            }
        }

        //-------------------------------------------------------
        // This method updates the dates of a supplier
        //-------------------------------------------------------
        private int UpdateSupplierDates(SqlConnection con, Supplier supplier)
        {
            int successIndicator = 0;

            try
            {
                // Delete existing dates for the supplier
                using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPDeleteDatesForSupplier", new Dictionary<string, object>
        {
            { "@supplier_email", supplier.SupplierEmail }
        }))
                {
                    successIndicator += cmd.ExecuteNonQuery();
                }

                // Insert new available dates for the supplier
                foreach (var date in supplier.AvailableDates)
                {
                    var dateParameters = new Dictionary<string, object>
            {
                { "@supplier_email", supplier.SupplierEmail },
                { "@available_date", date }
            };

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertSupplierDates", dateParameters))
                    {
                        successIndicator += cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the supplier dates: " + ex.Message);
            }

            return successIndicator;
        }


        //-------------------------------------------------------
        // This method retrieves the top venues from each region
        //-------------------------------------------------------
        public List<Supplier> GetTopVenuesPerRegion()
        {
            List<Supplier> suppliers = new List<Supplier>();

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetTopRatedVenuesPerRegion", null))
                    {
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            suppliers = BuildSuppliers(dataReader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving top-rated venues in the GetTopVenuesPerRegion method" + ex.Message);
            }

            return suppliers;
        }


        //-------------------------------------------------------
        // This method retrieves the top venues from each region
        //-------------------------------------------------------
        public List<Supplier> GetTopSuppliersByType()
        {
            List<Supplier> suppliers = new List<Supplier>();

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetTopRankedSuppliersByType", null))
                    {
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            suppliers = BuildSuppliers(dataReader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving top-rated venues in the GetTopVenuesPerRegion method" + ex.Message);
            }

            return suppliers;
        }


        //------------------------------------------------------------------------------------------------------
        // This method retrieves suppliers based on a specific stored procedure and constructs supplier objects.
        // It is accessible for use by all classes for various purposes.
        //------------------------------------------------------------------------------------------------------
        public List<Supplier> BuildSuppliers(SqlDataReader dataReader)
        {
            List<Supplier> suppliers = new List<Supplier>();

            try
            {
                while (dataReader.Read())
                {
                    Supplier supplier = new Supplier
                    {
                        SupplierEmail = dataReader["supplier_email"].ToString(),
                        BusinessName = dataReader["business_name"].ToString(),
                        PhoneNumber = dataReader["phone_number"].ToString(),
                        Price = Convert.ToInt32(dataReader["price"]),
                        Rating = Convert.ToDouble(dataReader["rating"]),
                        AvailableRegion = dataReader["region_name"].ToString(),
                        SupplierType = dataReader["supplier_type_name"].ToString(),
                        IsActive = Convert.ToBoolean(dataReader["is_active"]),
                        Capacity = dataReader["capacity"] != DBNull.Value ? Convert.ToInt32(dataReader["capacity"]) : (int?)null,
                        Latitude = dataReader["latitude"] != DBNull.Value ? Convert.ToDouble(dataReader["latitude"]) : (double?)null,
                        Longitude = dataReader["longitude"] != DBNull.Value ? Convert.ToDouble(dataReader["longitude"]) : (double?)null
                    };

                    suppliers.Add(supplier);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while building a supplier in the BuildSuppliers method." + ex.Message);
            }

            return suppliers;
        }





        //--------------------------------------------------------------------------------------------------
        // This method retrieves dates for each supplier object from the database.
        //--------------------------------------------------------------------------------------------------
        private List<DateTime> GetDatesForSupplier(string supplierEmail)
        {
            List<DateTime> availableDates = new List<DateTime>();

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>
                    {
                        { "@SupplierEmail", supplierEmail }
                    };

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetDatesForSupplier", parameters))
                    {
                        using (SqlDataReader dataReader2 = cmd.ExecuteReader())
                        {
                            while (dataReader2.Read())
                            {
                                DateTime date = (DateTime)dataReader2["available_date"];
                                availableDates.Add(date);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving dates for the supplier in the GetDatesForSupplier method." + ex.Message);
            }

            return availableDates;
        }

    }

}




























