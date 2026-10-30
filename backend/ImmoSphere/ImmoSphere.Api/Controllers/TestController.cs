using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { Message = "C'est carré (ça fonctionne)" });
    }
}