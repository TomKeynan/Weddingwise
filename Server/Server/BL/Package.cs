using Server.DAL;
using Server.Services;

namespace Server.BL
{
    // Represents a package for a couple's event.
    public class Package
    {
        // Private fields
        private int _packageId;                         // ID of the package
        private string _coupleEmail;                    // Email of the couple
        private int _totalCost;                         // Total cost of the package
        private double _totalScore;                     // Total score of the package
        private List<Supplier> _selectedSuppliers;      // List of selected suppliers for the package
        private Dictionary<string, List<Supplier>> _alternativeSuppliers;  // Dictionary of alternative suppliers for the package

        // Default constructor
        public Package() { }

        // Parameterized constructor
        public Package(int packageId, string coupleEmail, int totalCost, double totalScore, List<Supplier> selectedSuppliers, Dictionary<string, List<Supplier>> alternativeSuppliers)
        {
            _packageId = packageId;
            _coupleEmail = coupleEmail;
            _totalCost = totalCost;
            _totalScore = totalScore;
            _selectedSuppliers = selectedSuppliers;
            _alternativeSuppliers = alternativeSuppliers;
        }

        // Properties

        // Gets or sets the package ID.
        public int PackageId
        {
            get { return _packageId; }
            set { _packageId = value; }
        }

        // Gets or sets the email of the couple.
        public string CoupleEmail
        {
            get { return _coupleEmail; }
            set { _coupleEmail = value; }
        }

        // Gets or sets the total cost of the package.
        public int TotalCost
        {
            get { return _totalCost; }
            set
            {
                if (value >= 0)
                {
                    _totalCost = value;
                }
                else
                {
                    throw new ArgumentOutOfRangeException(nameof(TotalCost), "Total cost cannot be negative.");
                }
            }
        }

        // Gets or sets the total score of the package.
        public double TotalScore
        {
            get { return _totalScore; }
            set
            {
                if (value >= 0)
                {
                    _totalScore = value;
                }
                else
                {
                    throw new ArgumentOutOfRangeException(nameof(TotalScore), "Total score cannot be negative.");
                }
            }
        }

        // Gets or sets the list of selected suppliers for the package.
        public List<Supplier> SelectedSuppliers
        {
            get { return _selectedSuppliers; }
            set { _selectedSuppliers = value; }
        }

        // Gets or sets the dictionary of alternative suppliers for the package.
        public Dictionary<string, List<Supplier>> AlternativeSuppliers
        {
            get { return _alternativeSuppliers; }
            set { _alternativeSuppliers = value; }
        }


        // Inserts or updates a package in the database.

        public static int InsertOrUpdatePackage(PackageApprovalData packageApprovalData)
        {
            // Create an instance of DBServicesPackage to interact with the database
            DBServicesPackage dBServicesPackage = new DBServicesPackage();
            // Call the method to insert or update the package in the database
            return dBServicesPackage.InsertPackageToDB(packageApprovalData);
        }


        // Generates a package for the couple based on their details and questionnaire answers.

        public static Couple GetPackage(Couple coupleWithData, int[] questionnaireAnswers)
        {
            // Calculate vendor weights based on questionnaire answers
            coupleWithData.TypeWeights = PackageService.CalculateVendorWeights(questionnaireAnswers);
            // Generate a package for the couple
            coupleWithData.Package = PackageService.GeneratePackage(coupleWithData);

            // If neither were successful, return a null couple
            if (coupleWithData.TypeWeights == null || coupleWithData.Package == null)
            {
                return null;
            }

            return coupleWithData;
        }
    }
}
