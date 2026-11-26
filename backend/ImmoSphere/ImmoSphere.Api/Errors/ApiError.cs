namespace ImmoSphere.Api.Errors;

/// <summary>
/// Corps JSON d'une erreur métier : <c>{ "code": "...", "message": "..." }</c>.
/// <see cref="Code"/> est un identifiant stable en majuscules (à utiliser côté front),
/// <see cref="Message"/> un texte lisible qui peut changer.
/// Format provisoire, à aligner avec KAN-246 (gestion globale des erreurs).
/// </summary>
public record ApiError(string Code, string Message);

/// <summary>Codes d'erreur stables renvoyés par l'API.</summary>
public static class ApiErrorCodes
{
    public const string AgenceNotFound = "AGENCE_NOT_FOUND";
    public const string InvalidRegion = "INVALID_REGION";
    public const string InvalidSort = "INVALID_SORT";
    public const string InvalidPage = "INVALID_PAGE";
    public const string InvalidPageSize = "INVALID_PAGE_SIZE";
    public const string SearchTooLong = "SEARCH_TOO_LONG";
    public const string FaqCategoryUnknown = "FAQ_CATEGORY_UNKNOWN";
}
