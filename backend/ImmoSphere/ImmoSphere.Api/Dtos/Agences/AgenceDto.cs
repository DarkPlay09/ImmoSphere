using System.Text.Json.Serialization;

namespace ImmoSphere.Api.Dtos.Agences;

/// <summary>
/// Contrat de <c>frontend/src/app/shared/agences/models/agence.model.ts</c>.
/// Les champs optionnels du front sont omis du JSON quand ils n'ont pas de valeur
/// (le front teste <c>undefined</c>, pas <c>null</c>). Les champs du front sans
/// colonne en base (district, ipiNumber, federiaMember, openingHours, about,
/// highlights) ne sont pas envoyés.
/// </summary>
public class AgenceDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? LogoUrl { get; init; }

    public string City { get; init; } = string.Empty;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Street { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Number { get; init; }

    public string PostalCode { get; init; } = string.Empty;

    /// <summary>brussels | flanders | wallonia. Omis si le code postal ne permet pas de la déduire.</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Region { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Phone { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Email { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Website { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Bce { get; init; }

    public IReadOnlyList<string> Tags { get; init; } = [];

    public AgenceSpecificationsDto Specifications { get; init; } = new();

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? Rating { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? ReviewCount { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? PropertyCount { get; init; }
}

public class AgenceSpecificationsDto
{
    public string Zone { get; init; } = string.Empty;
    public string PropertyTypes { get; init; } = string.Empty;
    public string TransactionPoles { get; init; } = string.Empty;
    public IReadOnlyList<AgenceLanguageDto> Languages { get; init; } = [];
}

public class AgenceLanguageDto
{
    /// <summary>fr | nl | de | en</summary>
    public string Code { get; init; } = string.Empty;

    /// <summary>Envoyé seulement à <c>true</c> (mention « maternelle »).</summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? Native { get; init; }
}

/// <summary>Contrat de <c>AgenceSearchResult</c> (agence-search.model.ts).</summary>
public class AgenceSearchResultDto
{
    public IReadOnlyList<AgenceDto> Items { get; init; } = [];
    public int Total { get; init; }
    public int Page { get; init; }
    public int PageCount { get; init; }
}
