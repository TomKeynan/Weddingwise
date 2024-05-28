using Server.BL;

public class PackageApprovalData
{
    // Private fields
    private Couple _couple;
    private string[] _typeReplacements;
    private string _actionString;


    // Default constructor
    public PackageApprovalData()
    {
    }

    // Parameterized constructor
    public PackageApprovalData(Couple couple, string[] typeReplacements, string actionString)
    {
        _couple = couple;
        _typeReplacements = typeReplacements;
        _actionString = actionString;
    }



    // Public properties
    public Couple Couple
    {
        get { return _couple; }
        set { _couple = value; }
    }

    public string[] TypeReplacements
    {
        get { return _typeReplacements; }
        set { _typeReplacements = value; }
    }

    public string ActionString
    {
        get { return _actionString; }
        set { _actionString = value; }
    }


}
