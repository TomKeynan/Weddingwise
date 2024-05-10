using Server.DAL;

namespace Server.BL
{
    public class Couple
    {
        // Private fields
        private string _email;
        private string _password;
        private string _phoneNumber;
        private string _partner1Name;
        private string _partner2Name;
        private DateTime _desiredDate;
        private string _desiredRegion;
        private int _budget;
        private int _numberOfInvitees;
        private Dictionary<string, double> _typeWeights;
        private Package _package;
        private bool _isActive = true;

        // Constructors
        public Couple() { }


        // Parameterized constructor
        public Couple(
            string partner1Name,
            string partner2Name,
            DateTime desiredDate,
            string desiredRegion,
            int budget,
            int numberOfInvitees,
            Dictionary<string, double> typeWeights,
            Package package,
            string email,
            string password,
            string phoneNumber
        )
        {
            _partner1Name = partner1Name;
            _partner2Name = partner2Name;
            _desiredDate = desiredDate;
            _desiredRegion = desiredRegion;
            _budget = budget;
            _numberOfInvitees = numberOfInvitees;
            _typeWeights = typeWeights;
            _package = package;
            _email = email;
            _password = password;
            _phoneNumber = phoneNumber;

        }

        // Properties
        public string Partner1Name
        {
            get { return _partner1Name; }
            set { _partner1Name = value; }
        }

        public string Partner2Name
        {
            get { return _partner2Name; }
            set { _partner2Name = value; }
        }

        public DateTime DesiredDate
        {
            get { return _desiredDate; }
            set { _desiredDate = value; }
        }

        public string DesiredRegion
        {
            get { return _desiredRegion; }
            set { _desiredRegion = value; }
        }

        public int Budget
        {
            get { return _budget; }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("Budget cannot be negative.");
                }
                _budget = value;
            }
        }

        public int NumberOfInvitees
        {
            get { return _numberOfInvitees; }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("NumberOfInvitees cannot be negative.");
                }
                _numberOfInvitees = value;
            }
        }

        public Dictionary<string, double>? TypeWeights
        {
            get { return _typeWeights; }
            set { _typeWeights = value; }
        }

        public Package? Package
        {
            get { return _package; }
            set { _package = value; }
        }

        public string Email
        {
            get { return _email; }
            set { _email = value; }
        }

        public string? Password
        {
            get { return _password; }
            set { _password = value; }
        }

        public string? PhoneNumber
        {
            get { return _phoneNumber; }
            set { _phoneNumber = value; }
        }

        public bool IsActive { get => _isActive; set => _isActive = value; }

        public int InsertCouple()
        {
            DBServicesCouple dBServicesCouple = new DBServicesCouple();
            return dBServicesCouple.InsertCouple(this);
        }

        public static Couple FindCouple(string email, string password)
        {
            DBServicesCouple dBServicesCouple = new DBServicesCouple();
            return dBServicesCouple.GetCouple(email, password);
        }

        public int UpdateCouple()
        {
            DBServicesCouple dBServicesCouple = new DBServicesCouple();
            return dBServicesCouple.UpdateCouple(this);
        }




    }
}
