using Server.BL;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesPackage
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
        //-------------------------------------------------------------------------------------------------
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
                    using (SqlCommand cmd = CreateReadTopSuppliersWithSP(con, "SPGetTopRankedSuppliers", couple))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            // Construct suppliers using dataReader.
                            DBServicesSupplier dbs = new DBServicesSupplier();
                            suppliers = dbs.BuildSuppliers(dataReader);
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