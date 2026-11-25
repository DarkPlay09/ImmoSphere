namespace ImmoSphere.Domain.Exceptions;

public class RechercheTropLongueException : Exception
{
    public int LongueurMax { get; }

    public RechercheTropLongueException(int longueurMax)
        : base($"La recherche est limitée à {longueurMax} caractères.")
    {
        LongueurMax = longueurMax;
    }
}
