using Server.BL;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesCouple
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



        //-------------------------------------------------------
        // This method inserts a new couple into the database.
        //-------------------------------------------------------

        public int InsertCouple(Couple couple)
        {
            try
            {
                // Open a database connection.
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateInsertCoupleWithSP("SPInsertCoupleDetails", con, couple))
                    {
                        // Execute the SqlCommand and return the number of rows affected.
                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                // Throw a new exception with the desired error message.
                throw new Exception("An error occurred while inserting a new couple in the InsertCouple method" + ex.Message);
            }
        }


        private SqlCommand CreateInsertCoupleWithSP(String spName, SqlConnection con, Couple couple)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@couple_email", couple.Email);
            cmd.Parameters.AddWithValue("@partner_1_name", couple.Partner1Name);
            cmd.Parameters.AddWithValue("@partner_2_name", couple.Partner2Name);
            cmd.Parameters.AddWithValue("@phone_number", couple.PhoneNumber);
            cmd.Parameters.AddWithValue("@password_hash", couple.Password);
            cmd.Parameters.AddWithValue("@budget", couple.Budget);
            cmd.Parameters.AddWithValue("@number_of_invitees", couple.NumberOfInvitees);
            cmd.Parameters.AddWithValue("@desired_date", couple.DesiredDate);
            cmd.Parameters.AddWithValue("@desired_region_name", couple.DesiredRegion);

            return cmd;
        }




        //-------------------------------------------------------
        // This method retrieves couple details from the database.
        //-------------------------------------------------------

        public Couple GetCouple(string email, string password)
        {
            // Create a new Couple object to store the retrieved data.
            Couple couple = null;

            try
            {
                // Open a database connection.
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    using (SqlCommand cmd = CreateReadCoupleWithSP(con, "SPGetCoupleDetails", email, password))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            // Check if dataReader has any rows.
                            if (dataReader.Read())
                            {
                                // Construct the couple object using data from the dataReader.
                                couple = new Couple
                                {
                                    Email = dataReader["couple_email"].ToString(),
                                    Partner1Name = dataReader["partner_1_name"].ToString(),
                                    Partner2Name = dataReader["partner_2_name"].ToString(),
                                    PhoneNumber = dataReader["phone_number"].ToString(),
                                    Password = dataReader["password_hash"].ToString(),
                                    DesiredRegion = dataReader["region_name"].ToString(),
                                    Budget = Convert.ToInt32(dataReader["budget"]),
                                    NumberOfInvitees = Convert.ToInt32(dataReader["number_of_invitees"]),
                                    DesiredDate = (DateTime)dataReader["desired_date"],
                                    IsActive = Convert.ToBoolean(dataReader["is_active"]),
                                };

                                // Close the current connection and open a new one to retrieve type weights.
                                con.Close();
                                con.Open();

                                // Create a new SqlCommand to execute the stored procedure.
                                using (SqlCommand weightCmd = CreateReadCoupleWeightsWithSP(con, "SPGetCoupleTypeWeights", email))
                                {
                                    // Execute the SqlCommand and obtain a SqlDataReader.
                                    using (SqlDataReader weightReader = weightCmd.ExecuteReader(CommandBehavior.CloseConnection))
                                    {
                                        // Create a dictionary to store type weights.
                                        Dictionary<string, double> typeWeights = new Dictionary<string, double>();

                                        // Iterate through the dataReader and populate the dictionary.
                                        while (weightReader.Read())
                                        {
                                            string supplierType = weightReader["supplier_type_name"].ToString();
                                            double weight = Convert.ToDouble(weightReader["type_weight"]);
                                            typeWeights[supplierType] = weight;
                                        }

                                        // Assign the type weights to the couple object.
                                        couple.TypeWeights = typeWeights;
                                    }
                                }

                                // Retrieve the package for the couple.
                                DBServicesPackage dBServicesPackage = new DBServicesPackage();
                                couple.Package = dBServicesPackage.GetPackageFromDB(email);
                            }
                            else
                            {
                                return couple;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving couple details in the GetCouple method" + ex.Message);
            }

            // Return the retrieved couple object.
            return couple;
        }



        private SqlCommand CreateReadCoupleWithSP(SqlConnection con, String spName, string email, string password)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@couple_email", email);

            cmd.Parameters.AddWithValue("@password_hash", password);
            return cmd;
        }


        private SqlCommand CreateReadCoupleWeightsWithSP(SqlConnection con, String spName, string email)
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@couple_email", email);

            return cmd;
        }


    }
}
