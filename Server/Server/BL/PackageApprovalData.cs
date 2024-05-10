namespace Server.BL
{
    public class PackageApprovalData
    {
        // Private fields
        private Package _package;
        private Dictionary<string, double> _typeWeights;
        private string[] _typeReplacements;

        // Constructors
        public PackageApprovalData()
        {
            // Default constructor
        }

        public PackageApprovalData(Package package, Dictionary<string, double> typeWeights, string[] typeReplacements)
        {
            _package = package;
            _typeWeights = typeWeights;
            _typeReplacements = typeReplacements;
        }

        // Properties
        public Package Package
        {
            get { return _package; }
            set { _package = value; }
        }

        public Dictionary<string, double> TypeWeights
        {
            get { return _typeWeights; }
            set { _typeWeights = value; }
        }

        public string[] TypeReplacements
        {
            get { return _typeReplacements; }
            set { _typeReplacements = value; }
        }
    }
}
