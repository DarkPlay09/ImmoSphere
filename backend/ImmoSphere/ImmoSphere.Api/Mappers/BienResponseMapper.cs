using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Api.Mappers;

public static class BienResponseMapper
{
    public static BienDetailResponseDto ToDetailResponseDto(Bien bien)
    {
        ArgumentNullException.ThrowIfNull(bien);

        return new BienDetailResponseDto
        {
            Id = bien.Id,
            Titre = bien.Titre,
            Description = bien.Description,
            Prix = bien.Prix,
            CodePostal = bien.CodePostal,
            Localite = bien.Localite,
            Province = bien.Province,
            TypeBien = bien.TypeBien,
            TypeTransaction = bien.TypeTransaction,
            Peb = bien.Peb
        };
    }
}