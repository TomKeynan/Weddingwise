using Server.DAL;

namespace Server.BL
{
    public class Couple
    {
        // Private fields
        private string _email;
        private string? _password; // Nullable since we don't return the password saved in the data to the client
        private string? _phoneNumber; // Nullable since we don't yet know if we need it *****
        private string _partner1Name;
        private string _partner2Name;
        private DateTime _desiredDate;
        private string _desiredRegion;
        private int _budget;
        private int _numberOfInvitees;
        private Dictionary<string, double>? _typeWeights; // Nullable since couple doesn't necessarily have a package yet
        private Package? _package; // Nullable since couple doesn't necessarily have a package yet
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
        // Partner1Name: Name of the first partner
        public string Partner1Name
        {
            get { return _partner1Name; }
            set { _partner1Name = value; }
        }

        // Partner2Name: Name of the second partner
        public string Partner2Name
        {
            get { return _partner2Name; }
            set { _partner2Name = value; }
        }

        // DesiredDate: Date of the event desired by the couple
        public DateTime DesiredDate
        {
            get { return _desiredDate; }
            set { _desiredDate = value; }
        }

        // DesiredRegion: Region where the couple desires to host the event
        public string DesiredRegion
        {
            get { return _desiredRegion; }
            set { _desiredRegion = value; }
        }

        // Budget: Budget allocated for the event
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

        // NumberOfInvitees: Number of invitees expected for the event
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

        // TypeWeights: Dictionary representing weights for different types of event services (nullable)
        public Dictionary<string, double>? TypeWeights
        {
            get { return _typeWeights; }
            set { _typeWeights = value; }
        }

        // Package: Event package chosen by the couple (nullable)
        public Package? Package
        {
            get { return _package; }
            set { _package = value; }
        }

        // Email: Email address of the couple
        public string Email
        {
            get { return _email; }
            set { _email = value; }
        }

        // Password: Password chosen by the couple for authentication (nullable)
        public string? Password
        {
            get { return _password; }
            set { _password = value; }
        }

        // PhoneNumber: Phone number of the couple (nullable)
        public string? PhoneNumber
        {
            get { return _phoneNumber; }
            set { _phoneNumber = value; }
        }

        // IsActive: Indicates whether the couple is active (e.g., account status)
        public bool IsActive { get => _isActive; set => _isActive = value; }

        // InsertCouple: Method to insert couple data into the database
        public int InsertCouple()
        {
            DBServicesCouple dBServicesCouple = new DBServicesCouple();
            return dBServicesCouple.InsertCouple(this);
        }

        // FindCouple: Method to find couple data from the database based on email and password
        public static Couple FindCouple(string email, string password)
        {
            DBServicesCouple dBServicesCouple = new DBServicesCouple();
            return dBServicesCouple.GetCouple(email, password);
        }

        // UpdateCouple: Method to update couple data in the database
        public int UpdateCouple()
        {
            DBServicesCouple dBServicesCouple = new DBServicesCouple();
            return dBServicesCouple.UpdateCouple(this);
        }
    }
}
