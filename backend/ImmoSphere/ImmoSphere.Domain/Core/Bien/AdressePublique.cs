namespace ImmoSphere.Domain.Core.Bien;

/// <summary>Représente l'adresse d'un bien telle qu'elle peut être exposée publiquement.</summary>
public sealed record AdressePublique(
    bool EstConfidentielle,
    string? Rue,
    int? Numero,
    string? Boite,
    int CodePostal,
    string Localite,
    string Province
);
