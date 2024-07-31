namespace Server.BL
{
    public class SupplierEvent
    {
        private string coupleEmail;
        private double latitude;
        private double longitude;
        private DateTime date;
        private string coupleNames;
        private int numberOfInvitees;
        private int importanceRank;

        public SupplierEvent(string coupleEmail, double latitude, double longitude, DateTime date, string coupleNames, int numberOfInvitees, int importanceRank)
        {
            this.CoupleEmail = coupleEmail;
            this.Latitude = latitude;
            this.Longitude = longitude;
            this.Date = date;
            this.CoupleNames = coupleNames;
            this.NumberOfInvitees = numberOfInvitees;
            this.ImportanceRank = importanceRank;
        }

        public double Latitude { get => latitude; set => latitude = value; }
        public double Longitude { get => longitude; set => longitude = value; }
        public DateTime Date { get => date; set => date = value; }
        public string CoupleNames { get => coupleNames; set => coupleNames = value; }
        public int NumberOfInvitees { get => numberOfInvitees; set => numberOfInvitees = value; }
        public int ImportanceRank { get => importanceRank; set => importanceRank = value; }
        public string CoupleEmail { get => coupleEmail; set => coupleEmail = value; }
    }
}
