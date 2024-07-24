using Server.BL;
using Server.Services;
using System.Data;
using System.Data.SqlClient;

namespace Server.DAL
{
    public class DBServicesCouple
    {


        //-------------------------------------------------------
        // This method inserts a new couple into the database.
        //-------------------------------------------------------
        public int InsertCouple(Couple couple)
        {
            try
            {
                // Open a database connection.
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    var parameters = new Dictionary<string, object>
                    {
                        { "@couple_email", couple.Email },
                        { "@partner_1_name", couple.Partner1Name },
                        { "@partner_2_name", couple.Partner2Name },
                        { "@phone_number", couple.PhoneNumber },
                        { "@password_hash", BCrypt.Net.BCrypt.EnhancedHashPassword(couple.Password, 10) },
                        { "@budget", couple.Budget },
                        { "@number_of_invitees", couple.NumberOfInvitees },
                        { "@desired_date", couple.DesiredDate },
                        { "@desired_region_name", couple.DesiredRegion }
                    };
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPInsertCoupleDetails", parameters))
                    {
                        // Execute the SqlCommand and return the number of rows affected.
                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627) // Primary key violation error number
                {
                    throw; // If it's a primary key violation, rethrow the exception to handle it elsewhere.
                }
                else
                {
                    throw new Exception("An error occurred while inserting a new couple in the InsertCouple method, SQL related: " + ex.Message);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while inserting a new couple in the InsertCouple method: " + ex.Message);
            }
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
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure for retrieving couple details.
                    var parameters = new Dictionary<string, object>
                    {
                        { "@couple_email", email }
                    };
                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPGetCoupleDetails", parameters))
                    {
                        // Execute the SqlCommand and obtain a SqlDataReader.
                        using (SqlDataReader dataReader = cmd.ExecuteReader())
                        {
                            // Step 1: Check if there is such couple in the db using dataReader.
                            if (dataReader.Read())
                            {
                                // Step 2: Construct the couple object using data from the dataReader.
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

                                // Step 3: Retrieve the password of the couple and check if it the same password the user entered.
                                string hashedPasswordFromDatabase = dataReader["password_hash"].ToString();
                                bool passwordsMatch = BCrypt.Net.BCrypt.EnhancedVerify(enteredPassword, hashedPasswordFromDatabase);

                                if (!passwordsMatch)
                                {
                                    return null; // Passwords don't match, return null indicating unsuccessful authentication.
                                }
                            }
                            else
                            {
                                return null; // No couple found, return null indicating unsuccessful authentication.
                            }
                        }
                    }

                    // Step 4: Retrieves the couples weights for each type of supplier.
                    using (SqlCommand weightCmd = DBServiceHelper.CreateSqlCommand(con, "SPGetCoupleTypeWeights", parameters))
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
                // Step 5: If the couple has type weights, then it has a package.
                else
                {
                    // Retrieves the package of the couple from the db using a method in DBServiceHelpersPackage.
                    DBServicesPackage DBServiceHelpersPackage = new DBServicesPackage();
                    couple.Package = DBServiceHelpersPackage.GetCouplePackageFromDB(email);
                }

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving couple details in the GetCouple method: " + ex.Message);
            }

            // Step 6: Return the retrieved couple object.
            return couple;
        }

        //-------------------------------------------------------
        // This method updates couple's details database.
        //-------------------------------------------------------
        public int UpdateCouple(Couple couple)
        {
            try
            {
                // Establish a database connection.
                using (SqlConnection con = DBServiceHelper.Connect())
                {
                    // Create a SqlCommand to execute the stored procedure.
                    var parameters = new Dictionary<string, object>
                    {
                        { "@couple_email", couple.Email },
                        { "@partner_1_name", couple.Partner1Name },
                        { "@partner_2_name", couple.Partner2Name },
                        { "@phone_number", couple.PhoneNumber },
                        { "@budget", couple.Budget },
                        { "@number_of_invitees", couple.NumberOfInvitees },
                        { "@desired_date", couple.DesiredDate },
                        { "@desired_region_name", couple.DesiredRegion }
                    };

                    // Check if password is provided, hash it using BCrypt and update the password
                    if (couple.Password != null)
                    {
                        parameters.Add("@password_hash", BCrypt.Net.BCrypt.EnhancedHashPassword(couple.Password, 10));
                    }


                    using (SqlCommand cmd = DBServiceHelper.CreateSqlCommand(con, "SPUpdateCoupleDetails", parameters))
                    {
                        // Execute the SqlCommand and return the number of rows affected.
                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the couple: " + ex.Message);
            }
        }
    }
}
