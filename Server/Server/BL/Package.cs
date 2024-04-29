using Server.Services;

namespace Server.BL
{
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
        private Dictionary<string, List<Supplier>> _secondarySuppliers;

        // Constructors
        public Package() { }
        public Package(int packageId, string coupleEmail, DateTime date, string region, int totalCost, double totalScore, List<Supplier> selectedSuppliers, Dictionary<string, List<Supplier>> secondarySuppliers)
        {
            _packageId = packageId;
            _coupleEmail = coupleEmail;
            _date = date;
            _region = region;
            _totalCost = totalCost;
            _totalScore = totalScore;
            _selectedSuppliers = selectedSuppliers;
            _secondarySuppliers = secondarySuppliers;
        }

        // Properties
        public int PackageId
        {
            get { return _packageId; }
            set { _packageId = value; }
        }
        public string CoupleEmail
        {
            get { return _coupleEmail; }
            set { _coupleEmail = value; }
        }
        public DateTime Date
        {
            get { return _date; }
            set { _date = value; }
        }
        public string Region
        {
            get { return _region; }
            set { _region = value; }
        }
        public int TotalCost
        {
            get { return _totalCost; }
            set { _totalCost = value; }
        }
        public double TotalScore
        {
            get { return _totalScore; }
            set { _totalScore = value; }
        }
        public List<Supplier> SelectedSuppliers
        {
            get { return _selectedSuppliers; }
            set { _selectedSuppliers = value; }
        }
        public Dictionary<string, List<Supplier>> SecondarySuppliers
        {
            get { return _secondarySuppliers; }
            set { _secondarySuppliers = value; }

        }


        public static Package getPackage(Couple coupleDetails, int[] questionaireAnswers)
        {
            coupleDetails.TypeWeights = PackageService.CalculateVendorWeights(questionaireAnswers);
            return PackageService.GeneratePackage(coupleDetails);
        }



    }
}






