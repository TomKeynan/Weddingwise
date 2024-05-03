namespace Server.BL
{
    public class PackageApprovalData
    {
        // Private fields
        private Package _package;
        private Dictionary<string, double> _typeWeights;
        private int[] _typeReplacments;

        // Constructors
        public PackageApprovalData()
        {
            // Default constructor
        }

        public PackageApprovalData(Package package, Dictionary<string, double> typeWeights, int[] typeReplacments)
        {
            _package = package;
            _typeWeights = typeWeights;
            _typeReplacments = typeReplacments;
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

        public int[] TypeReplacments
        {
            get { return _typeReplacments; }
            set { _typeReplacments = value; }
        }
    }
}
