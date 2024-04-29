namespace Server.BL
{
    public abstract class User
    {
        // Private fields

        private string _email;
        private string _password;
        private string _phoneNumber;
        private string _userType;
        private bool _isActive;

        // Constructor
        protected User(string email, string password, string phoneNumber, bool isActive, string userType)
        {
            _email = email;
            _password = password;
            _phoneNumber = phoneNumber;
            _isActive = isActive;
            _userType = userType;
        }

        // Properties
        public string Email
        {
            get { return _email; }
            set { _email = value; }
        }

        public string Password
        {
            get { return _password; }
            set { _password = value; }
        }

        public string PhoneNumber
        {
            get { return _phoneNumber; }
            set { _phoneNumber = value; }
        }

        public bool IsActive
        {
            get { return _isActive; }
            set { _isActive = value; }
        }


        public string UserType
        {
            get { return _userType; }
            set { _userType = value; }
        }
    }
}

