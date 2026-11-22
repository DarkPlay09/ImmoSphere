using ImmoSphere.Api.Dtos.Faq;
using ImmoSphere.Api.Errors;
using ImmoSphere.Domain.Core.Faq;
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
    /// Questions publiques de la FAQ (UC7), triées par ordre de création. <paramref name="search"/>
    /// filtre sur la question et la réponse, sans tenir compte de la casse ni des accents.
    /// </summary>
    [HttpGet]
    [ProducesResponseType<IEnumerable<FaqQuestionDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiError>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<FaqQuestionDto>>> Search(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        if (search?.Trim().Length > QuestionFaq.LongueurMaxRecherche)
        {
            _logger.LogInformation("Recherche dans la FAQ refusée : {Code}", ApiErrorCodes.SearchTooLong);
            return BadRequest(new ApiError(
                ApiErrorCodes.SearchTooLong,
                $"La recherche est limitée à {QuestionFaq.LongueurMaxRecherche} caractères."));
        }

        var questions = await _faqService.SearchAsync(search, cancellationToken);

        _logger.LogInformation("Recherche dans la FAQ ({Recherche}) : {Total} résultat(s)", search, questions.Count);

        return Ok(questions.Select(FaqDtoMapper.ToDto));
    }
}
