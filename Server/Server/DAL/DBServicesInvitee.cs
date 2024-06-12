using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Server.BL;

namespace Server.DAL
{
    public class DBServicesInvitee
    {
        private SqlConnection Connect()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public int InsertInvitee(Invitee invitee)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPInsertInvitee", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@name", invitee.Name);
                    cmd.Parameters.AddWithValue("@email", invitee.Email);
                    cmd.Parameters.AddWithValue("@numberOfInvitees", invitee.NumberOfInvitees);
                    cmd.Parameters.AddWithValue("@rsvp", invitee.Rsvp);
                    cmd.Parameters.AddWithValue("@side", invitee.Side);
                    cmd.Parameters.AddWithValue("@couple_email", invitee.CoupleEmail);
                    return cmd.ExecuteNonQuery();
                }
            }
        }

        public List<Invitee> GetInvitees(string coupleEmail)
        {
            List<Invitee> invitees = new List<Invitee>();
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPGetInvitees", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@couple_email", coupleEmail);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Invitee invitee = new Invitee
                            {
                                InviteeID = Convert.ToInt32(reader["invitee_id"]),
                                Name = reader["name"].ToString(),
                                Email = reader["email"].ToString(),
                                NumberOfInvitees = Convert.ToInt32(reader["number_of_invitees"]),
                                Rsvp = Convert.ToBoolean(reader["rsvp"]),
                                Side = reader["side"].ToString(),
                                CoupleEmail = reader["couple_email"].ToString()
                            };
                            invitees.Add(invitee);
                        }
                    }
                }
            }
            return invitees;
        }

        public int DeleteInvitee(int inviteeID)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPDeleteInvitee", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@invitee_id", inviteeID);
                    return cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
