using Server.DAL;

namespace Server.BL
{
    public class Supplier
    {
        // Fields
        private string _businessName;       // Name of the business
        private string _supplierEmail;      // Email of the supplier
        private string? _password;          // Password for the supplier account (nullable)
        private string _phoneNumber;        // Phone number of the supplier
        private int _price;                 // Price of services provided
        private double? _rating;            // Rating of the supplier (nullable)
        private int? _capacity;             // Capacity of the supplier (nullable)
        private string _availableRegion;    // Region where the supplier provides services
        private double? _latitude;          // Latitude coordinate of the supplier's location (nullable)
        private double? _longitude;         // Longitude coordinate of the supplier's location (nullable)
        private string _supplierType;       // Type of supplier
        private List<DateTime>? _availableDates;  // List of available dates for the supplier (nullable)
        private bool _isActive;             // Indicates if the supplier is active



        // Constructors

        // Default constructor
        public Supplier() { }

        // Parameterized constructor
        public Supplier(
            string businessName,
            string supplierEmail,
            string password,
            string phoneNumber,
            int price,
            double? rating,
            int? capacity,
            string availableRegion,
            double? latitude,
            double? longitude,
            string supplierType,
            bool isActive,
            List<DateTime>? availableDates
        )
        {
            _businessName = businessName;
            _supplierEmail = supplierEmail;
            _password = password;
            _phoneNumber = phoneNumber;
            _price = price;
            _rating = rating;
            _capacity = capacity;
            _availableRegion = availableRegion;
            _latitude = latitude;
            _longitude = longitude;
            _supplierType = supplierType;
            _isActive = isActive;
            _availableDates = availableDates;
        }

        // Properties and methods omitted for brevity...

        // Gets or sets the business name
        public string BusinessName
        {
            get { return _businessName; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Business name cannot be null or empty.");
                _businessName = value;
            }
        }

        // Gets or sets the email of the supplier
        public string SupplierEmail
        {
            get { return _supplierEmail; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Supplier email cannot be null or empty.");
                _supplierEmail = value;
            }
        }

        // Gets or sets the password for the supplier account
        public string? Password
        {
            get { return _password; }
            set { _password = value; }
        }

        // Gets or sets the phone number of the supplier
        public string PhoneNumber
        {
            get { return _phoneNumber; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Phone number cannot be null or empty.");
                _phoneNumber = value;
            }
        }

        // Gets or sets the price of services provided by the supplier
        public int Price
        {
            get { return _price; }
            set
            {
                if (value < 0)
                    throw new ArgumentException("Price cannot be negative.");
                _price = value;
            }
        }

        // Gets or sets the rating of the supplier
        public double? Rating
        {
            get { return _rating; }
            set { _rating = value; }
        }

        // Gets or sets the capacity of the supplier
        public int? Capacity
        {
            get { return _capacity; }
            set
            {
                if (value < 0)
                    throw new ArgumentException("Capacity cannot be negative.");
                _capacity = value;
            }
        }

        // Gets or sets the region where the supplier provides services
        public string AvailableRegion
        {
            get { return _availableRegion; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Available region cannot be null or empty.");
                _availableRegion = value;
            }
        }

        // Gets or sets the latitude coordinate of the supplier's location
        public double? Latitude
        {
            get { return _latitude; }
            set { _latitude = value; }
        }

        // Gets or sets the longitude coordinate of the supplier's location
        public double? Longitude
        {
            get { return _longitude; }
            set { _longitude = value; }
        }

        // Gets or sets the type of supplier
        public string SupplierType
        {
            get { return _supplierType; }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                    throw new ArgumentException("Supplier type cannot be null or empty.");
                _supplierType = value;
            }
        }

        // Gets or sets a value indicating whether the supplier is active
        public bool IsActive
        {
            get { return _isActive; }
            set { _isActive = value; }
        }

        // Gets or sets the list of available dates for the supplier
        public List<DateTime>? AvailableDates
        {
            get { return _availableDates; }
            set { _availableDates = value; }
        }


        // Retrieves a list of top venues from the database.

        public static List<Supplier> GetTopVenues()
        {
            // Create an instance of DBServicesSupplier to interact with the database
            DBServicesSupplier dbs = new DBServicesSupplier();
            // Call the method to get top venues per region from the database
            return dbs.GetTopVenuesPerRegion();
        }

        public static List<Supplier> GetTopSuppliers()
        {
            // Create an instance of DBServicesSupplier to interact with the database
            DBServicesSupplier dbs = new DBServicesSupplier();
            // Call the method to get top suppliers from the database
            return dbs.GetTopSuppliersByType();
        }


        //Inserts the current supplier into the database.
        public int InsertSupplier()
        {
            // Create an instance of DBServicesSupplier to interact with the database
            DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
            // Call the method to insert the current supplier into the database
            return dBServicesSupplier.InsertSupplier(this);
        }


        // FindCouple: Method to find couple data from the database based on email and password
        public static Supplier FindSupplier(string email, string password)
        {
            DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
            return dBServicesSupplier.GetSupplier(email, password);
        }

        // UpdateCouple: Method to update couple data in the database
        public int UpdateCouple()
        {
            DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
            return dBServicesSupplier.UpdateSupplier(this);
        }

    }
}
