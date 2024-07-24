using System.Data;
using System.Data.SqlClient;

namespace Server.Services
{
    public class DBServiceHelper
    {




        // This method creates a connection to the database according to the connectionString name in the web.config 

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

        // Common method for creating SqlCommand objects with parameters
        public static SqlCommand CreateSqlCommand(SqlConnection con, string spName, Dictionary<string, object> parameters)
        {
            SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandText = spName;
            cmd.CommandTimeout = 10;
            cmd.CommandType = CommandType.StoredProcedure;

            // Add parameters if provided
            if (parameters != null)
            {
                foreach (var param in parameters)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            return cmd;
        }


    }
}
