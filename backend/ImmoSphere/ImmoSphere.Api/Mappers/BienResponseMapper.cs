using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Api.Mappers;

public static class BienResponseMapper
{
    public static BienDetailResponseDto ToDetailResponseDto(Bien bien)
    {
        ArgumentNullException.ThrowIfNull(bien);
        AdressePublique adresse =
            bien.ObtenirAdressePublique();

        return new BienDetailResponseDto
        {
            Id = bien.Id,
            Titre = bien.Titre,
            Description = bien.Description,
            Prix = bien.Prix,
            CodePostal = adresse.CodePostal,
            Localite = adresse.Localite,
            Province = adresse.Province,
            AdresseConfidentielle = adresse.EstConfidentielle,
            Rue = adresse.Rue,
            Numero = adresse.Numero,
            Boite = adresse.Boite,
            TypeBien = bien.TypeBien,
            TypeTransaction = bien.TypeTransaction,
            Peb = bien.Peb
        };
    }
}