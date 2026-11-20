namespace ImmoSphere.Domain.Core.Agence;

public enum Region
{
    Bruxelles,
    Flandre,
    Wallonie,
}

/// <summary>
/// La base ne stocke pas la région d'une agence : elle est déduite du code postal belge.
/// La même table de tranches sert au calcul (profil, liste) et au filtre en base.
/// </summary>
public static class RegionCodesPostaux
{
    /// <summary>Tranches inclusives de codes postaux belges (4 chiffres) par région.</summary>
    public static readonly IReadOnlyList<(Region Region, string Debut, string Fin)> Tranches =
    [
        (Region.Bruxelles, "1000", "1299"),
        (Region.Wallonie, "1300", "1499"), // Brabant wallon
        (Region.Flandre, "1500", "3999"),  // Brabant flamand, Anvers, Limbourg
        (Region.Wallonie, "4000", "7999"), // Liège, Namur, Luxembourg, Hainaut
        (Region.Flandre, "8000", "9999"),  // Flandre occidentale et orientale
    ];

    public static Region? DepuisCodePostal(string? codePostal)
    {
        if (codePostal is not { Length: 4 } || !codePostal.All(char.IsAsciiDigit))
        {
            return null;
        }

        foreach (var (region, debut, fin) in Tranches)
        {
            if (string.CompareOrdinal(codePostal, debut) >= 0 && string.CompareOrdinal(codePostal, fin) <= 0)
            {
                return region;
            }
        }

        return null;
    }
}
