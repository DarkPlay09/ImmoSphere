using ImmoSphere.Domain.Core.Agence;
using ImmoSphere.Infrastructure.Repositories;

namespace ImmoSphere.Infrastructure.Mappers;

/// <summary>
/// Projection SQL d'une agence → modèle du domaine.
///
/// Les spécifications (<c>specifications.titre</c> / <c>description</c>) sont génériques en base.
/// Convention : une spécification dont le titre est l'une des clés ci-dessous alimente la
/// catégorie correspondante du profil (sa description est la valeur) ; toutes les autres
/// deviennent des tags (leur titre).
/// </summary>
internal static class AgenceMapper
{
    public const string CleZone = "ZONE";
    public const string CleTypesBiens = "TYPES_BIENS";
    public const string ClePolesTransaction = "POLES_TRANSACTION";

    /// <summary>Description au format « fr*, nl, en » : codes séparés par des virgules, « * » = langue maternelle.</summary>
    public const string CleLangues = "LANGUES";

    private static readonly HashSet<string> CodesLangues = ["fr", "nl", "de", "en"];

    private static readonly HashSet<string> Cles =
        new([CleZone, CleTypesBiens, ClePolesTransaction, CleLangues], StringComparer.OrdinalIgnoreCase);

    public static Agence AgenceToDomain(AgenceLigne ligne)
    {
        var specifications = ligne.Specifications
            .Where(s => !string.IsNullOrWhiteSpace(s.Titre))
            .ToList();

        return new Agence
        {
            Id = ligne.Id,
            Nom = ligne.Nom,
            Description = ligne.Description ?? string.Empty,
            Logo = string.IsNullOrWhiteSpace(ligne.Logo) ? null : ligne.Logo,

            Localite = ligne.Localite ?? string.Empty,
            Rue = Vide(ligne.Rue),
            Numero = Vide(ligne.Numero),
            CodePostal = ligne.CodePostal?.Trim() ?? string.Empty,
            Region = RegionCodesPostaux.DepuisCodePostal(ligne.CodePostal?.Trim()),

            Telephone = Vide(ligne.NumeroTel),
            Mail = Vide(ligne.Mail),
            SiteWeb = Vide(ligne.LienPlateforme),
            Bce = Vide(ligne.Bce),

            Tags = specifications
                .Where(s => !Cles.Contains(s.Titre.Trim()))
                .Select(s => s.Titre.Trim())
                .Distinct()
                .ToList(),

            Specifications = new AgenceSpecifications
            {
                Zone = Valeur(specifications, CleZone),
                TypesBiens = Valeur(specifications, CleTypesBiens),
                PolesTransaction = Valeur(specifications, ClePolesTransaction),
                Langues = Langues(Valeur(specifications, CleLangues)),
            },

            Note = ligne.Note is { } note ? Math.Round(note, 1) : null,
            NombreAvis = ligne.NombreAvis,
            NombreBiens = ligne.NombreBiens,
        };
    }

    private static string? Vide(string? valeur) => string.IsNullOrWhiteSpace(valeur) ? null : valeur.Trim();

    private static string Valeur(IEnumerable<SpecificationLigne> specifications, string cle) =>
        specifications
            .FirstOrDefault(s => string.Equals(s.Titre.Trim(), cle, StringComparison.OrdinalIgnoreCase))
            ?.Description?.Trim()
        ?? string.Empty;

    private static List<AgenceLangue> Langues(string valeur) =>
        valeur
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(code => new AgenceLangue
            {
                Code = code.TrimEnd('*').Trim().ToLowerInvariant(),
                Maternelle = code.EndsWith('*'),
            })
            .Where(langue => CodesLangues.Contains(langue.Code))
            .DistinctBy(langue => langue.Code)
            .ToList();
}
