using OfficeOpenXml;
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
                        { "@supplier_type_name", supplier.SupplierType },
                        { "@rating", supplier.Rating }
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
                    throw new Exception("An error occurred while inserting a new couple in the InsertSupplier method, sql related" + ex.Message);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while inserting a new couple in the InsertSupplier method" + ex.Message);
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
                                    Rating = dataReader["rating"] != DBNull.Value ? Convert.ToDouble(dataReader["rating"]) : 0.0,
                                    RatedCount = Convert.ToInt32(dataReader["rated_count"]),
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
        public int UpdateSupplierDetails(Supplier supplier)
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
                    if (supplier.Password != "" && supplier.Password != null)
                    {
                        parameters.Add("@password_hash", BCrypt.Net.BCrypt.EnhancedHashPassword(supplier.Password, 10));
                    }

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPUpdateSupplierDetails", parameters))
                    {
                        successIndicator = cmd.ExecuteNonQuery();
                    }


                    return successIndicator;
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
        public int UpdateSupplierDates(Supplier supplier)
        {
            int successIndicator = 0;

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {

                    // Delete existing dates for the supplier
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPDeleteDatesForSupplier", new Dictionary<string, object>
        {
            { "@supplier_email", supplier.SupplierEmail }
        }))
                    {
                        cmd.ExecuteNonQuery();
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
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the supplier dates: " + ex.Message);
            }

            return successIndicator == supplier.AvailableDates.Count() ? 1 : 0;
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
                        Rating = dataReader["rating"] != DBNull.Value ? Convert.ToDouble(dataReader["rating"]) : 0.0,
                        RatedCount = Convert.ToInt32(dataReader["rated_count"]),
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



        //--------------------------------------------------------------------------------------------------
        // 
        //--------------------------------------------------------------------------------------------------
        public List<SupplierEvent> GetSupplierEvents(string supplierEmail)
        {
            List<SupplierEvent> supplierEvents = new List<SupplierEvent>();

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>
                    {
                        { "@supplier_email", supplierEmail }
                    };

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetSupplierEvents", parameters))
                    {
                        using (SqlDataReader dataReader = cmd.ExecuteReader())
                        {
                            while (dataReader.Read())
                            {

                                SupplierEvent supplierEvent = new SupplierEvent
                                 (
                                dataReader["CoupleEmail"].ToString(),
                                Convert.ToDouble(dataReader["Latitude"]),
                                Convert.ToDouble(dataReader["longitude"]),
                                (DateTime)dataReader["EventDate"],
                                dataReader["CoupleNames"].ToString(),
                                Convert.ToInt32(dataReader["NumberOfInvitees"]),
                                Convert.ToInt32(dataReader["ImportanceRank"])
                                 );

                                supplierEvents.Add(supplierEvent);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving events for the supplier in the GetSuppliersEvents method." + ex.Message);
            }

            return supplierEvents;
        }



        //-------------------------------------------------------
        // This method rates an existing supplier in the db 
        //-------------------------------------------------------
        public int RateSupplier(string supplierEmail, string coupleEmail, int rating)
        {
            int successIndicator = 0;

            try
            {
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>
                    {
                        { "@receiver_email", supplierEmail },
                        { "@giver_email", coupleEmail },
                        { "@rating_given", rating }

                    };

                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertSupplierRatings", parameters))
                    {
                        successIndicator = cmd.ExecuteNonQuery();
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
                    throw new Exception("An error occurred while inserting a new couple in the InsertSupplier method, sql related" + ex.Message);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while inserting a new couple in the InsertSupplier method" + ex.Message);
            }

            return successIndicator;
        }







        // Temporary
        public List<Supplier> UploadSuppliersToDatabase(string excelFilePath)
        {
            // Set the license context to NonCommercial
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            FileInfo fileInfo = new FileInfo(excelFilePath);

            List<Supplier> suppliers = new List<Supplier>();



            using (ExcelPackage package = new ExcelPackage(fileInfo))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0]; // Assuming data is in the first worksheet

                int rowCount = worksheet.Dimension.Rows;




                for (int row = 2; row <= rowCount; row++) // Start from row 2 assuming row 1 contains headers
                {

                    Supplier newSupplier = new Supplier();

                    newSupplier.BusinessName = worksheet.Cells[row, 1].Value?.ToString().Trim();
                    newSupplier.SupplierEmail = worksheet.Cells[row, 2].Value?.ToString().Trim();
                    newSupplier.SupplierType = worksheet.Cells[row, 3].Value?.ToString().Trim();
                    newSupplier.Password = worksheet.Cells[row, 4].Value?.ToString().Trim();
                    newSupplier.PhoneNumber = worksheet.Cells[row, 5].Value?.ToString().Trim();
                    newSupplier.Price = Convert.ToInt32(worksheet.Cells[row, 6].Value);
                    newSupplier.Rating = Convert.ToDouble(worksheet.Cells[row, 7].Value);
                    newSupplier.Capacity = Convert.ToInt32(worksheet.Cells[row, 8].Value);
                    newSupplier.AvailableRegion = worksheet.Cells[row, 10].Value?.ToString().Trim(); // Assuming region name is in column 10
                    newSupplier.IsActive = Convert.ToBoolean(worksheet.Cells[row, 13].Value);
                    newSupplier.Latitude = Convert.ToDouble(worksheet.Cells[row, 11].Value);
                    newSupplier.Longitude = Convert.ToDouble(worksheet.Cells[row, 12].Value);



                    // If the supplier type is dress, skip adding available dates
                    string supplierType = worksheet.Cells[row, 3].Value?.ToString().Trim();
                    if (supplierType == "dress")
                    {
                        suppliers.Add(newSupplier);
                        continue;
                    }
                    else
                    {
                        // Get comma-separated list of dates from Excel and split it into array
                        string[] datesArray = worksheet.Cells[row, 9].Value?.ToString().Trim('[', ']').Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                        List<DateTime> dates = new List<DateTime>();
                        // Insert each date for the supplier
                        foreach (string dateStr in datesArray)
                        {
                            DateTime date = DateTime.Parse(dateStr.Trim('\'', ' '));
                            dates.Add(date);
                        }

                        newSupplier.AvailableDates = dates;

                        suppliers.Add(newSupplier);
                    }
                }
            }

            return suppliers;

        }




    }

}




























