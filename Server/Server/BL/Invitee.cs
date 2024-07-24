using Server.DAL;
using System.Collections.Generic;

namespace Server.BL
{
    public class Invitee
    {
        private int? _inviteeID;
        private string _name;
        private string _email;
        private int _numberOfInvitees;
        private bool _rsvp;
        private string _side;
        private string _coupleEmail; // Add coupleEmail

        public int? InviteeID { get => _inviteeID; set => _inviteeID = value; }
        public string Name { get => _name; set => _name = value; }
        public string Email { get => _email; set => _email = value; }
        public int NumberOfInvitees { get => _numberOfInvitees; set => _numberOfInvitees = value; }
        public bool Rsvp { get => _rsvp; set => _rsvp = value; }
        public string Side { get => _side; set => _side = value; }
        public string CoupleEmail { get => _coupleEmail; set => _coupleEmail = value; } // Add getter and setter

        public Invitee() { }

        public Invitee(string name, string email, int numberOfInvitees, bool rsvp, string side, string coupleEmail)
        {
            Name = name;
            Email = email;
            NumberOfInvitees = numberOfInvitees;
            Rsvp = rsvp;
            Side = side;
            CoupleEmail = coupleEmail;
        }

        public int InsertInvitee()
        {
            DBServicesInvitee dbServicesInvitee = new DBServicesInvitee();
            return dbServicesInvitee.InsertInvitee(this);
        }

        public static List<Invitee> GetInvitees(string email)
        {
            DBServicesInvitee dbServicesInvitee = new DBServicesInvitee();
            return dbServicesInvitee.GetInvitees(email);
        }
    }
}
