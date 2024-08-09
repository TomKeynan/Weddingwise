using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Server.BL;

namespace Server.DAL
{
    public class DBServicesExpense
    {
        private SqlConnection Connect()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public int InsertExpense(Expense expense)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPInsertExpense", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@serviceName", expense.ServiceName);
                    cmd.Parameters.AddWithValue("@sponsorName", expense.SponsorName);
                    cmd.Parameters.AddWithValue("@totalCost", expense.TotalCost);
                    cmd.Parameters.AddWithValue("@downPayment", expense.DownPayment);
                    cmd.Parameters.AddWithValue("@couple_email", expense.CoupleEmail);

                    // Use ExecuteScalar to get the returned expense_id
                    object result = cmd.ExecuteScalar();
                    if (result != null && int.TryParse(result.ToString(), out int expenseId))
                    {
                        expense.ExpenseID = expenseId;
                        return expenseId;
                    }
                    return 0; // Return 0 if insertion failed
                }
            }
        }

        public List<Expense> GetExpenses(string coupleEmail)
        {
            List<Expense> expenses = new List<Expense>();
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPGetExpenses", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@couple_email", coupleEmail);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Expense expense = new Expense
                            {
                                ExpenseID = Convert.ToInt32(reader["expense_id"]),
                                ServiceName = reader["service_name"].ToString(),
                                SponsorName = reader["sponsor_name"].ToString(),
                                TotalCost = Convert.ToDecimal(reader["total_cost"]),
                                DownPayment = Convert.ToDecimal(reader["down_payment"]),
                                CoupleEmail = reader["couple_email"].ToString()
                            };
                            expenses.Add(expense);
                        }
                    }
                }
            }
            return expenses;
        }

        public int DeleteExpense(int expenseID)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPDeleteExpense", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@expense_id", expenseID);
                    return cmd.ExecuteNonQuery();
                }
            }
        }
    }
}