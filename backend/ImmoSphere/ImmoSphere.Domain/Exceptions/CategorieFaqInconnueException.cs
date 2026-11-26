namespace ImmoSphere.Domain.Exceptions;

public class CategorieFaqInconnueException : Exception
{
    public string Code { get; }

    public CategorieFaqInconnueException(string code)
        : base($"La catégorie de FAQ « {code} » n'existe pas.")
    {
        Code = code;
    }
}
