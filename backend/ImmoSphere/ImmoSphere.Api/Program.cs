using Serilog;
using ImmoSphere.Api.Middlewares;
using ImmoSphere.Infrastructure;
using ImmoSphere.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Ajout de Serilog
builder.Services.AddSerilog((services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});

// Enregistrement des services
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Services infra
builder.Services.AddInfrastructure(builder.Configuration);

// Autorise les requêtes provenant du front-end Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Construction de l'application
var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Endpoint temporaire pour tester PostgreSQL
    app.MapGet("/dev/database-check",
        async (ApplicationDbContext db) =>
        {
            var connected = await db.Database.CanConnectAsync();

            return connected
                ? Results.Ok("Connexion PostgreSQL réussie")
                : Results.Problem(
                    "Connexion PostgreSQL impossible",
                    statusCode: 503);
        });
}


app.Lifetime.ApplicationStarted.Register(() =>
{
    app.Logger.LogInformation(
        "Démarrage de {Application} en environnement {Environment} sur {Urls}",
        app.Environment.ApplicationName,
        app.Environment.EnvironmentName,
        string.Join(", ", app.Urls)
    );
});

// Logging des requêtes entrantes
app.UseMiddleware<LogOriginMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AngularDev");

app.MapControllers();

app.Run();