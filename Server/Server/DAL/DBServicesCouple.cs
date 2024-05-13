using Server.BL;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesCouple
    {


        //-----------------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //-----------------------------------------------------------------------------------------------------------
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

        //----------------------------------------------------------------------------------------------------------|
        //----------------------------------------------------------------------------------------------------------|
        //----------------------------------------------------------------------------------------------------------|


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
            catch (SqlException ex)
            {
                // Check if the SQL exception is due to a primary key violation.
                if (ex.Number == 2627) // Primary key violation error number
                {
                    // If it's a primary key violation, rethrow the exception to handle it elsewhere.
                    throw;
                }
                else
                {
                    // If it's another SQL exception, throw a new exception with an appropriate message.
                    throw new Exception("An error occurred while inserting a new couple in the InsertCouple method, SQL related: " + ex.Message);
                }
            }
            catch (Exception ex)
            {
                // Handle other types of exceptions by throwing a new exception with an appropriate message.
                throw new Exception("An error occurred while inserting a new couple in the InsertCouple method: " + ex.Message);
            }
        }

        // Creates a SqlCommand object for inserting a new couple using a stored procedure.
        private SqlCommand CreateInsertCoupleWithSP(string spName, SqlConnection con, Couple couple)
        {
            SqlCommand cmd = new SqlCommand();

            // Set the SqlConnection object for the SqlCommand.
            cmd.Connection = con;

            // Set the name of the stored procedure to be executed.
            cmd.CommandText = spName;

            // Set the command timeout.
            cmd.CommandTimeout = 10;

            // Set the CommandType to StoredProcedure.
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            // Add parameters for the stored procedure based on the Couple object.
            cmd.Parameters.AddWithValue("@couple_email", couple.Email);
            cmd.Parameters.AddWithValue("@partner_1_name", couple.Partner1Name);
            cmd.Parameters.AddWithValue("@partner_2_name", couple.Partner2Name);
            cmd.Parameters.AddWithValue("@phone_number", couple.PhoneNumber);

            // Hash the password before adding it as a parameter.
            string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(couple.Password, 10);
            cmd.Parameters.AddWithValue("@password_hash", hashedPassword);

            cmd.Parameters.AddWithValue("@budget", couple.Budget);
            cmd.Parameters.AddWithValue("@number_of_invitees", couple.NumberOfInvitees);
            cmd.Parameters.AddWithValue("@desired_date", couple.DesiredDate);
            cmd.Parameters.AddWithValue("@desired_region_name", couple.DesiredRegion);

            return cmd;
        }




        //-------------------------------------------------------
        // This method retrieves couple details from the database.
        //-------------------------------------------------------

        public Couple GetCouple(string email, string enteredPassword)
        {
            // Initialize the couple object to null.
            Couple couple = null;

            try
            {
                // Open a database connection.
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure for retrieving couple details.
                    using (SqlCommand cmd = CreateReadCoupleWithSP(con, "SPGetCoupleDetails", email, enteredPassword))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader())
                        {

                            //* step 1: Check if there is such couple in the db using dataReader.
                            if (dataReader.Read())
                            {
                                //* step 2: Construct the couple object using data from the dataReader.
                                couple = new Couple
                                {
                                    Email = dataReader["couple_email"].ToString(),
                                    Partner1Name = dataReader["partner_1_name"].ToString(),
                                    Partner2Name = dataReader["partner_2_name"].ToString(),
                                    PhoneNumber = dataReader["phone_number"].ToString(),
                                    DesiredRegion = dataReader["region_name"].ToString(),
                                    Budget = Convert.ToInt32(dataReader["budget"]),
                                    NumberOfInvitees = Convert.ToInt32(dataReader["number_of_invitees"]),
                                    DesiredDate = (DateTime)dataReader["desired_date"],
                                    IsActive = Convert.ToBoolean(dataReader["is_active"]),
                                };

                                //* step 3: Retreive the password of the couple and check if it the same password the user entered 

                                // Retrieve hashed password from the database based on the user's email.
                                string hashedPasswordFromDatabase = dataReader["password_hash"].ToString();

                                // Compare the entered password with the retrieved hashed password.
                                bool passwordsMatch = BCrypt.Net.BCrypt.EnhancedVerify(enteredPassword, hashedPasswordFromDatabase);

                                if (!passwordsMatch)
                                {
                                    return null; // Passwords don't match, return null indicating unsuccessful authentication.
                                }
                            }
                            else
                            {
                                return couple; // No couple found, return null indicating unsuccessful authentication.
                            }
                        }
                    }


                    //* step 4: Retrieves the couples weights for each type of supplier

                    // Create a SqlCommand to execute the stored procedure for retrieving couple type weights.
                    using (SqlCommand weightCmd = CreateReadCoupleWeightsWithSP(con, "SPGetCoupleTypeWeights", email))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader weightReader = weightCmd.ExecuteReader(CommandBehavior.CloseConnection))
                        {
                            // Create a dictionary to store type weights.
                            Dictionary<string, double> typeWeights = new Dictionary<string, double>();

                            // Iterate through the weightReader and populate the dictionary.
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
                }

                // If the couple doesn't have weights, return the couple as it is.
                if (couple.TypeWeights == null)
                {
                    return couple;
                }
                //* step 5: If the couple has type weights, then it has a package.
                else
                {
                    // Retrieves the package of the the couple from the db using a method in DBservicesPackage
                    DBServicesPackage dBServicesPackage = new DBServicesPackage();
                    couple.Package = dBServicesPackage.GetCouplePackageFromDB(email);
                }

            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the process.
                throw new Exception("An error occurred while retrieving couple details in the GetCouple method: " + ex.Message);
            }

            //* step 6: Return the retrieved couple object.
            return couple;
        }

        // Creates a SqlCommand object for reading couple details using a stored procedure.
        private SqlCommand CreateReadCoupleWithSP(SqlConnection con, string spName, string email, string password)
        {
            SqlCommand cmd = new SqlCommand();

            cmd.Connection = con;

            cmd.CommandText = spName;

            cmd.CommandTimeout = 10;

            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@couple_email", email);


            return cmd;
        }

        // Creates a SqlCommand object for reading couple type weights using a stored procedure.
        private SqlCommand CreateReadCoupleWeightsWithSP(SqlConnection con, string spName, string email)
        {
            SqlCommand cmd = new SqlCommand();

            cmd.Connection = con;

            cmd.CommandText = spName;

            cmd.CommandTimeout = 10;

            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@couple_email", email);

            return cmd;
        }


        //-------------------------------------------------------
        // This method updates couple's details database.
        //-------------------------------------------------------

        public int UpdateCouple(Couple couple)
        {
            try
            {
                // Establish a database connection
                using (SqlConnection con = Connect())
                {
                    // Create a SqlCommand to execute the stored procedure
                    using (SqlCommand cmd = CreateUpdateCoupleWithSP("SPUpdateCoupleDetails", con, couple))
                    {
                        // Execute the SqlCommand and return the number of rows affected
                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                // Throw an exception with the error message
                throw new Exception("An error occurred while updating the couple: " + ex.Message);
            }
        }

        // Function to create a SqlCommand object for updating a couple with a stored procedure
        private SqlCommand CreateUpdateCoupleWithSP(String spName, SqlConnection con, Couple couple)
        {
            SqlCommand cmd = new SqlCommand();

            cmd.Connection = con;

            cmd.CommandText = spName;

            cmd.CommandTimeout = 10;

            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            // Add parameters to the command object
            cmd.Parameters.AddWithValue("@couple_email", couple.Email);
            cmd.Parameters.AddWithValue("@partner_1_name", couple.Partner1Name);
            cmd.Parameters.AddWithValue("@partner_2_name", couple.Partner2Name);
            cmd.Parameters.AddWithValue("@phone_number", couple.PhoneNumber);

            // Check if password is provided hash it using BCrypt and update the password
            if (couple.Password != null)
            {
                string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(couple.Password, 10);
                cmd.Parameters.AddWithValue("@password_hash", hashedPassword);
            }

            // Add budget, number of invitees, desired date, and desired region parameters
            cmd.Parameters.AddWithValue("@budget", couple.Budget);
            cmd.Parameters.AddWithValue("@number_of_invitees", couple.NumberOfInvitees);
            cmd.Parameters.AddWithValue("@desired_date", couple.DesiredDate);
            cmd.Parameters.AddWithValue("@desired_region_name", couple.DesiredRegion);

            return cmd; // Return the command object
        }


    }
}
