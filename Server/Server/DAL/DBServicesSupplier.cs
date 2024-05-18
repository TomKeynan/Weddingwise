using Server.BL;
using System.Data;
using System.Data.SqlClient;


namespace Server.DAL
{
    public class DBServicesSupplier
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







        //-------------------------------------------------------
        // This method retrieves the top venues from each region
        //-------------------------------------------------------

        public List<Supplier> GetTopVenuesPerRegion()
        {
            // List to store the retrieved suppliers.
            List<Supplier> suppliers = new List<Supplier>();

            try
            {
                // Open a database connection.
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateReadTopVenuesPerRegionWithSp(con, "SPGetTopRatedVenuesPerRegion"))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            suppliers = BuildSuppliers(dataReader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while retrieving top-rated venues in the GetTopVenuesPerRegion method" + ex.Message);
            }

            // Return the retrieved suppliers.
            return suppliers;
        }


        private SqlCommand CreateReadTopVenuesPerRegionWithSp(SqlConnection con, String spName)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            return cmd;
        }






        //------------------------------------------------------------------------------------------------------
        // This method retrieves suppliers based on a specific stored procedure and constructs supplier objects.
        // It is accessible for use by all classes for various purposes.
        //------------------------------------------------------------------------------------------------------

        public List<Supplier> BuildSuppliers(SqlDataReader dataReader)
        {
            // List to store the constructed suppliers.
            List<Supplier> suppliers = new List<Supplier>();

            try
            {
                // Loop through the SqlDataReader to read supplier data.
                while (dataReader.Read())
                {
                    // Construct a new Supplier object.
                    Supplier supplier = new Supplier
                    {
                        SupplierEmail = dataReader["supplier_email"].ToString(),
                        BusinessName = dataReader["business_name"].ToString(),
                        Password = dataReader["password_hash"].ToString(),
                        PhoneNumber = dataReader["phone_number"].ToString(),
                        Price = Convert.ToInt32(dataReader["price"]),
                        Rating = Convert.ToDouble(dataReader["rating"]),
                        AvailableRegion = dataReader["region_name"].ToString(),
                        SupplierType = dataReader["supplier_type_name"].ToString(),
                        IsActive = Convert.ToBoolean(dataReader["is_active"]),
                        Capacity = dataReader["capacity"] != DBNull.Value ? Convert.ToInt32(dataReader["capacity"]) : null,
                        Latitude = dataReader["latitude"] != DBNull.Value ? Convert.ToDouble(dataReader["latitude"]) : null,
                        Longitude = dataReader["longitude"] != DBNull.Value ? Convert.ToDouble(dataReader["longitude"]) : null
                    };

                    // Add the constructed supplier to the list.
                    suppliers.Add(supplier);
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while building a supplier in the BuildSuppliers method." + ex.Message);
            }

            // Return the list of constructed suppliers.
            return suppliers;
        }





        //  ****************   Currently not in use   ****************  \\

        //--------------------------------------------------------------------------------------------------
        // This method retrieves dates for each supplier object from the database.
        //--------------------------------------------------------------------------------------------------
        private List<DateTime> GetDatesForSupplier(string supplierEmail)
        {
            // List to store the retrieved dates.
            List<DateTime> availableDates = new List<DateTime>();

            try
            {
                // Open a database connection.
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateReadDatesForSupplierWithSP(con, "SPGetDatesForSupplier", supplierEmail))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader2 = cmd.ExecuteReader())
                        {

                            // Loop through the SqlDataReader to read dates.
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
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while retrieving dates for the supplier in the GetDatesForSupplier method." + ex.Message);
            }

            // Return the retrieved dates.
            return availableDates;
        }

        private SqlCommand CreateReadDatesForSupplierWithSP(SqlConnection con, String spName, String supplierEmail)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@SupplierEmail", supplierEmail);

            return cmd;
        }


        //-------------------------------------------------------
        // This method retrieves the top venues from each region
        //-------------------------------------------------------

        public int InsertSupplier(Supplier supplier)
        {


            int successIndicator = 0;
            try
            {

                // Open a database connection.
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateInsertSupplierWithSP(con, "SPInsertSupplierDetails", supplier))
                    {
                        successIndicator = cmd.ExecuteNonQuery();
                    }

                    if (supplier.AvailableDates != null && successIndicator == 1)
                    {

                        foreach (var date in supplier.AvailableDates)
                        {


                            // Needs to rethink if the supplier registering includes dates already. *******
                            using (SqlCommand cmd = CreateInsertSupplierDateWithSP(con, "SPInsertSupplierDates", date, supplier.SupplierEmail))
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
                    // Handle primary key violation error
                    throw;
                }
                else
                {
                    // Handle other SQL exceptions
                    throw new Exception("An error occurred while inserting a new couple in the InsertCouple method, sql related" + ex.Message);
                }
            }
            catch (Exception ex)
            {
                // Handle other types of exceptions
                throw new Exception("An error occurred while inserting a new couple in the InsertCouple method" + ex.Message);
            }
            if (successIndicator == 1 + supplier.AvailableDates.Count())
            {
                return 1;
            }
            else
                return 0;

        }


        private SqlCommand CreateInsertSupplierWithSP(SqlConnection con, String spName, Supplier supplier)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@supplier_email", supplier.SupplierEmail);
            cmd.Parameters.AddWithValue("@business_name", supplier.BusinessName);
            string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(supplier.Password, 10);
            cmd.Parameters.AddWithValue("@password_hash", hashedPassword);
            cmd.Parameters.AddWithValue("@phone_number", supplier.PhoneNumber);
            cmd.Parameters.AddWithValue("@price", supplier.Price);
            cmd.Parameters.AddWithValue("@capacity", supplier.Capacity);
            cmd.Parameters.AddWithValue("@region_name", supplier.AvailableRegion);
            cmd.Parameters.AddWithValue("@latitude", supplier.Latitude);
            cmd.Parameters.AddWithValue("@longitude", supplier.Longitude);
            cmd.Parameters.AddWithValue("@supplier_type_name", supplier.SupplierType);

            return cmd;
        }


        private SqlCommand CreateInsertSupplierDateWithSP(SqlConnection con, String spName, DateTime date, String supplierEmail)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@supplier_email", supplierEmail);

            cmd.Parameters.AddWithValue("@available_date", date);

            return cmd;
        }

    }
}
