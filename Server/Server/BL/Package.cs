using Server.DAL;
using Server.Services;

namespace Server.BL
{
    // Represents a package for a couple's event.
    public class Package
    {
        // Private fields
        private int _packageId;
        private string _coupleEmail;
        private DateTime _date;
        private string _region;
        private int _totalCost;
        private double _totalScore;
        private List<Supplier> _selectedSuppliers;
        private Dictionary<string, List<Supplier>> _alternativeSuppliers;

        // Default constructor
        public Package() { }

        // Parameterized constructor
        public Package(int packageId, string coupleEmail, DateTime date, string region, int totalCost, double totalScore, List<Supplier> selectedSuppliers, Dictionary<string, List<Supplier>> alternativeSuppliers)
        {
            _packageId = packageId;
            _coupleEmail = coupleEmail;
            _date = date;
            _region = region;
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

        // Gets or sets the date of the package.
        public DateTime Date
        {
            get { return _date; }
            set { _date = value; }
        }

        // Gets or sets the region of the package.
        public string Region
        {
            get { return _region; }
            set { _region = value; }
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


        public static int InsertOrUpdatePackage(PackageApprovalData packageApprovalData, string actionString)
        {

            DBServicesPackage dBServicesPackage = new DBServicesPackage();
            return dBServicesPackage.InsertPackageToDB(packageApprovalData, actionString);
        }


        // Generates a package for the couple based on their details and questionnaire answers.
        public static Couple GetPackage(Couple coupleWithData, int[] questionnaireAnswers)
        {
            coupleWithData.TypeWeights = PackageService.CalculateVendorWeights(questionnaireAnswers);
            coupleWithData.Package = PackageService.GeneratePackage(coupleWithData);
            return coupleWithData;
        }
    }
}
