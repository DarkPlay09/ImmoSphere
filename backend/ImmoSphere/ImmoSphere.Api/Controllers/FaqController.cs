using ImmoSphere.Api.Dtos.Faq;
using ImmoSphere.Api.Errors;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/faq")]
[AllowAnonymous]
public class FaqController : ControllerBase
{
    private readonly IFaqService _faqService;
    private readonly ILogger<FaqController> _logger;

    public FaqController(IFaqService faqService, ILogger<FaqController> logger)
    {
        _faqService = faqService;
        _logger = logger;
    }

    /// <summary>
    /// FAQ publique (UC7) : catégories avec leur nombre de questions et questions triées par catégorie.
    /// <paramref name="search"/> filtre sur la question et la réponse, sans tenir compte de la casse
    /// ni des accents ; <paramref name="category"/> (code de catégorie) ne filtre que les questions.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<FaqSearchResultDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiError>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FaqSearchResultDto>> Search(
        [FromQuery] string? search,
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        try
        {
            var resultat = await _faqService.SearchAsync(search, category, cancellationToken);

            _logger.LogInformation(
                "Recherche dans la FAQ ({Recherche}, catégorie : {Categorie}) : {Total} résultat(s)",
                search,
                category,
                resultat.Questions.Count);

            return Ok(FaqDtoMapper.ToDto(resultat));
        }
        catch (RechercheTropLongueException ex)
        {
            return Refuser(ApiErrorCodes.SearchTooLong, ex.Message);
        }
        catch (CategorieFaqInconnueException ex)
        {
            return Refuser(ApiErrorCodes.FaqCategoryUnknown, ex.Message);
        }
    }

    private BadRequestObjectResult Refuser(string code, string message)
    {
        _logger.LogInformation("Recherche dans la FAQ refusée : {Code}", code);
        return BadRequest(new ApiError(code, message));
    }
}
