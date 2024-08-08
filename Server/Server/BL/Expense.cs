using System;
using System.Collections.Generic;
using Server.DAL;

namespace Server.BL
{
    public class Expense
    {
        private int? _expenseID;
        private string _serviceName;
        private string _sponsorName;
        private decimal _totalCost;
        private decimal _downPayment;
        private string _coupleEmail;

        public int? ExpenseID { get => _expenseID; set => _expenseID = value; }
        public string ServiceName { get => _serviceName; set => _serviceName = value; }
        public string SponsorName { get => _sponsorName; set => _sponsorName = value; }
        public decimal TotalCost { get => _totalCost; set => _totalCost = value; }
        public decimal DownPayment { get => _downPayment; set => _downPayment = value; }
        public string CoupleEmail { get => _coupleEmail; set => _coupleEmail = value; }

        public Expense() { }

        public Expense(string serviceName, string sponsorName, decimal totalCost, decimal downPayment, string coupleEmail)
        {
            ServiceName = serviceName;
            SponsorName = sponsorName;
            TotalCost = totalCost;
            DownPayment = downPayment;
            CoupleEmail = coupleEmail;
        }

        public int InsertExpense()
        {
            DBServicesExpense dbServicesExpense = new DBServicesExpense();
            return dbServicesExpense.InsertExpense(this);
        }

        public static List<Expense> GetExpenses(string email)
        {
            DBServicesExpense dbServicesExpense = new DBServicesExpense();
            return dbServicesExpense.GetExpenses(email);
        }
    }
}