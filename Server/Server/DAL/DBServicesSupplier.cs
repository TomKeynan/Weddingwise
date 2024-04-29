using Server.BL;
using System.Data.SqlClient;


namespace Server.DAL
{
    public class DBServicesSupplier
    {


        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public static SqlConnection Connect()
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }




        //--------------------------------------------------------------------------------------------------
        // This method retrieves suppliers based on a specific stored procedure and constructs supplier objects.
        // It is accessible for use by all classes for various purposes.
        //--------------------------------------------------------------------------------------------------

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
                        UserType = dataReader["user_type"].ToString(),
                        IsActive = Convert.ToBoolean(dataReader["is_active"]),
                        Capacity = dataReader["capacity"] != DBNull.Value ? Convert.ToInt32(dataReader["capacity"]) : 0,
                        Latitude = dataReader["latitude"] != DBNull.Value ? Convert.ToDouble(dataReader["latitude"]) : 0.0,
                        Longitude = dataReader["longitude"] != DBNull.Value ? Convert.ToDouble(dataReader["longitude"]) : 0.0
                    };

                    // Call GetDatesForSupplier to retrieve available dates for the supplier.
                    supplier.AvailableDates = GetDatesForSupplier(supplier.SupplierEmail);

                    // Add the constructed supplier to the list.
                    suppliers.Add(supplier);
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while building a supplier in method BuildSuppliers: " + ex.Message);
            }

            // Return the list of constructed suppliers.
            return suppliers;
        }

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
                throw new Exception("An error occurred while retrieving dates for the supplier in method GetDatesForSupplier: " + ex.Message);
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

    }
}
