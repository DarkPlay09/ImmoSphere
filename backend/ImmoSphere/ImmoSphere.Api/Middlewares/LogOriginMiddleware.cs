namespace ImmoSphere.Api.Middlewares;

public class LogOriginMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LogOriginMiddleware> _logger;

    public LogOriginMiddleware(
        RequestDelegate next,
        ILogger<LogOriginMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log de la requête entrante
        _logger.LogInformation(
            "Requête HTTP reçue : {Method} {Path}",
            context.Request.Method,
            context.Request.Path
        );

        // Transmission au middleware suivant
        await _next(context);
    }
}