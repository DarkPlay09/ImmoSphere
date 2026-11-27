namespace ImmoSphere.Domain.Core.Bien;

/// <summary>Représente une image publique d'un bien et sa position dans la galerie.</summary>
public sealed record ImageBien(
    string Chemin,
    int Ordre,
    string TexteAlternatif
);
