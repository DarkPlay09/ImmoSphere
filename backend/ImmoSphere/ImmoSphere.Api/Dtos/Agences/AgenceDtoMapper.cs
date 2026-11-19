using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Api.Dtos.Agences;

/// <summary>Conversions domaine → DTO.</summary>
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
            Region = agence.Region is { } region ? AgenceApiValues.RegionVersTexte(region) : null,
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
}
