namespace ImmoSphere.Domain.Core.Agence;

public enum AgenceTri
{
    /// <summary>Ordre de création (identifiant croissant).</summary>
    Pertinence,
    Nom,
    /// <summary>Meilleure note d'abord, agences sans note en dernier.</summary>
    Note,
}

/// <summary>Critères de la liste des agences.</summary>
public class AgenceRecherche
{
    public const int TailleParDefaut = 6;
    public const int TailleMax = 50;
    public const int LongueurMaxTexte = 100;

    /// <summary>Recherche dans le nom (insensible à la casse et aux accents).</summary>
    public string? Nom { get; set; }

    /// <summary>Ville ou code postal ; plusieurs mots séparés par des espaces ou des virgules doivent tous correspondre.</summary>
    public string? Localisation { get; set; }

    /// <summary>Null : toutes les régions.</summary>
    public Region? Region { get; set; }

    public AgenceTri Tri { get; set; } = AgenceTri.Pertinence;

    /// <summary>Page demandée, à partir de 1.</summary>
    public int Page { get; set; } = 1;

    public int TaillePage { get; set; } = TailleParDefaut;
}

public class AgencePage
{
    public IList<Agence> Agences { get; set; } = new List<Agence>();
    public int Total { get; set; }
    /// <summary>Page réellement renvoyée (ramenée dans les bornes).</summary>
    public int Page { get; set; }
    public int NombrePages { get; set; }
}
