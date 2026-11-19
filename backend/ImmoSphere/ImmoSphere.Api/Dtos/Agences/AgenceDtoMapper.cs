using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Api.Dtos.Agences;

/// <summary>Domaine → DTO, et valeurs des paramètres de requête → domaine.</summary>
public static class AgenceDtoMapper
{
    public static AgenceDto ToDto(Agence agence)
    {
        bool aDesAvis = agence.NombreAvis > 0 && agence.Note is not null;

        return new AgenceDto
        {
            Id = agence.Id,
            Name = agence.Nom,
            Description = agence.Description,
            LogoUrl = agence.Logo,
            City = agence.Localite,
            Street = agence.Rue,
            Number = agence.Numero,
            PostalCode = agence.CodePostal,
            Region = agence.Region is { } region ? RegionToDto(region) : null,
            Phone = agence.Telephone,
            Email = agence.Mail,
            Website = agence.SiteWeb,
            Bce = agence.Bce,
            Tags = agence.Tags.ToList(),
            Specifications = new AgenceSpecificationsDto
            {
                Zone = agence.Specifications.Zone,
                PropertyTypes = agence.Specifications.TypesBiens,
                TransactionPoles = agence.Specifications.PolesTransaction,
                Languages = agence.Specifications.Langues
                    .Select(langue => new AgenceLanguageDto
                    {
                        Code = langue.Code,
                        Native = langue.Maternelle ? true : null,
                    })
                    .ToList(),
            },
            Rating = aDesAvis ? agence.Note : null,
            ReviewCount = aDesAvis ? agence.NombreAvis : null,
            PropertyCount = agence.NombreBiens,
        };
    }

    public static AgenceSearchResultDto ToDto(AgencePage page) => new()
    {
        Items = page.Agences.Select(ToDto).ToList(),
        Total = page.Total,
        Page = page.Page,
        PageCount = page.NombrePages,
    };

    public static string RegionToDto(Region region) => region switch
    {
        Region.Bruxelles => "brussels",
        Region.Flandre => "flanders",
        Region.Wallonie => "wallonia",
        _ => throw new ArgumentOutOfRangeException(nameof(region), region, null),
    };

    /// <summary>« all » ou vide : toutes les régions. Faux si la valeur est inconnue.</summary>
    public static bool TryParseRegion(string? valeur, out Region? region)
    {
        region = null;
        switch (valeur?.Trim().ToLowerInvariant())
        {
            case null or "" or "all":
                return true;
            case "brussels":
                region = Region.Bruxelles;
                return true;
            case "flanders":
                region = Region.Flandre;
                return true;
            case "wallonia":
                region = Region.Wallonie;
                return true;
            default:
                return false;
        }
    }

    /// <summary>Vide : « relevance ». Faux si la valeur est inconnue.</summary>
    public static bool TryParseSort(string? valeur, out AgenceTri tri)
    {
        switch (valeur?.Trim().ToLowerInvariant())
        {
            case null or "" or "relevance":
                tri = AgenceTri.Pertinence;
                return true;
            case "name":
                tri = AgenceTri.Nom;
                return true;
            case "rating":
                tri = AgenceTri.Note;
                return true;
            default:
                tri = AgenceTri.Pertinence;
                return false;
        }
    }
}
