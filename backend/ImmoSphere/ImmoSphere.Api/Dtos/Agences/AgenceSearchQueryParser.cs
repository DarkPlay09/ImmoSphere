using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using ImmoSphere.Api.Errors;
using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Api.Dtos.Agences;

/// <summary>Valide les paramètres HTTP de la liste et les convertit en critères du domaine.</summary>
public static class AgenceSearchQueryParser
{
    public static bool TryParse(
        AgenceSearchQuery query,
        [NotNullWhen(true)] out AgenceRecherche? recherche,
        [NotNullWhen(false)] out ApiError? erreur)
    {
        recherche = null;

        string? nom = Texte(query.Name);
        string? localisation = Texte(query.Location);
        if (nom?.Length > AgenceRecherche.LongueurMaxTexte || localisation?.Length > AgenceRecherche.LongueurMaxTexte)
        {
            erreur = new ApiError(
                ApiErrorCodes.SearchTooLong,
                $"Le nom et la localisation recherchés sont limités à {AgenceRecherche.LongueurMaxTexte} caractères.");
            return false;
        }

        Region? region = null;
        string? texteRegion = Texte(query.Region);
        if (texteRegion is not null && !string.Equals(texteRegion, AgenceApiValues.ToutesRegions, StringComparison.OrdinalIgnoreCase))
        {
            if (!AgenceApiValues.Regions.TryGetValue(texteRegion, out var regionTrouvee))
            {
                erreur = new ApiError(
                    ApiErrorCodes.InvalidRegion,
                    $"La région doit valoir {AgenceApiValues.ToutesRegions}, {string.Join(", ", AgenceApiValues.Regions.Keys)}.");
                return false;
            }

            region = regionTrouvee;
        }

        AgenceTri tri = AgenceTri.Pertinence;
        string? texteTri = Texte(query.Sort);
        if (texteTri is not null && !AgenceApiValues.Tris.TryGetValue(texteTri, out tri))
        {
            erreur = new ApiError(
                ApiErrorCodes.InvalidSort,
                $"Le tri doit valoir {string.Join(", ", AgenceApiValues.Tris.Keys)}.");
            return false;
        }

        if (!TryEntier(query.Page, 1, 1, int.MaxValue, out int page))
        {
            erreur = new ApiError(ApiErrorCodes.InvalidPage, "La page doit être un entier supérieur ou égal à 1.");
            return false;
        }

        if (!TryEntier(query.PageSize, AgenceRecherche.TailleParDefaut, 1, AgenceRecherche.TailleMax, out int taillePage))
        {
            erreur = new ApiError(
                ApiErrorCodes.InvalidPageSize,
                $"La taille de page doit être un entier entre 1 et {AgenceRecherche.TailleMax}.");
            return false;
        }

        erreur = null;
        recherche = new AgenceRecherche
        {
            Nom = nom,
            Localisation = localisation,
            Region = region,
            Tri = tri,
            Page = page,
            TaillePage = taillePage,
        };
        return true;
    }

    /// <summary>Texte trimé ; null s'il est vide.</summary>
    private static string? Texte(string? valeur) =>
        string.IsNullOrWhiteSpace(valeur) ? null : valeur.Trim();

    /// <summary>Absent : <paramref name="parDefaut"/>. Faux si ce n'est pas un entier dans [min, max].</summary>
    private static bool TryEntier(string? valeur, int parDefaut, int min, int max, out int resultat)
    {
        string? texte = Texte(valeur);
        if (texte is null)
        {
            resultat = parDefaut;
            return true;
        }

        return int.TryParse(texte, NumberStyles.None, CultureInfo.InvariantCulture, out resultat)
               && resultat >= min
               && resultat <= max;
    }
}
