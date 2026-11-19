using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Api.Dtos.Agences;

/// <summary>
/// Valeurs textuelles du contrat (agence.model.ts, agence-search.model.ts) et leur équivalent
/// dans le domaine. Source unique pour la sérialisation et la lecture des paramètres.
/// </summary>
public static class AgenceApiValues
{
    /// <summary>Valeur du paramètre <c>region</c> qui désactive le filtre.</summary>
    public const string ToutesRegions = "all";

    public static readonly IReadOnlyDictionary<string, Region> Regions =
        new Dictionary<string, Region>(StringComparer.OrdinalIgnoreCase)
        {
            ["brussels"] = Region.Bruxelles,
            ["flanders"] = Region.Flandre,
            ["wallonia"] = Region.Wallonie,
        };

    public static readonly IReadOnlyDictionary<string, AgenceTri> Tris =
        new Dictionary<string, AgenceTri>(StringComparer.OrdinalIgnoreCase)
        {
            ["relevance"] = AgenceTri.Pertinence,
            ["name"] = AgenceTri.Nom,
            ["rating"] = AgenceTri.Note,
        };

    public static string RegionVersTexte(Region region) =>
        Regions.First(paire => paire.Value == region).Key;
}
