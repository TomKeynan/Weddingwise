using Server.DAL;

namespace Server.BL
{
    public class Supplier
    {
        // Private fields
        private string _businessName;
        private string _supplierEmail;
        private string? _password;
        private string _phoneNumber;
        private int _price;
        private double? _rating;
        private int? _capacity;
        private string _availableRegion;
        private double? _latitude;
        private double? _longitude;
        private string _supplierType;
        private List<DateTime>? _availableDates;
        private bool _isActive;


        // Constructors
        public Supplier()
        {
            // Fields remain uninitialized
        }

        // Parameterized constructor
        public Supplier(
            string businessName,
            string supplierEmail,
            string password,
            string phoneNumber,
            int price,
            double rating,
            int capacity,
            string availableRegion,
            double latitude,
            double longitude,
            string supplierType,
            bool isActive,
            List<DateTime> availableDates
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

        // Properties
        public string BusinessName
        {
            get { return _businessName; }
            set { _businessName = value; }
        }

        public string SupplierEmail
        {
            get { return _supplierEmail; }
            set { _supplierEmail = value; }
        }

        public string? Password
        {
            get { return _password; }
            set { _password = value; }
        }

        public string PhoneNumber
        {
            get { return _phoneNumber; }
            set { _phoneNumber = value; }
        }

        public int Price
        {
            get { return _price; }
            set { _price = value; }
        }

        public double? Rating
        {
            get { return _rating; }
            set { _rating = value; }
        }

        public int? Capacity
        {
            get { return _capacity; }
            set { _capacity = value; }
        }

        public string AvailableRegion
        {
            get { return _availableRegion; }
            set { _availableRegion = value; }
        }

        public double? Latitude
        {
            get { return _latitude; }
            set { _latitude = value; }
        }

        public double? Longitude
        {
            get { return _longitude; }
            set { _longitude = value; }
        }

        public string SupplierType
        {
            get { return _supplierType; }
            set { _supplierType = value; }
        }

        public bool IsActive
        {
            get { return _isActive; }
            set { _isActive = value; }
        }

        public List<DateTime>? AvailableDates
        {
            get { return _availableDates; }
            set { _availableDates = value; }
        }



        public static List<Supplier> GetTopVenues()
        {
            DBServicesSupplier dbs = new DBServicesSupplier();
            return dbs.GetTopVenuesPerRegion();
        }


        public int InsertSupplier()
        {
            DBServicesSupplier dBServicesSupplier = new DBServicesSupplier();
            return dBServicesSupplier.InsertSupplier(this);
        }

    }
}
