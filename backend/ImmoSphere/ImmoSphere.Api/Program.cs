using Serilog;
using ImmoSphere.Api.Middlewares;

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
}

app.Logger.LogInformation("Demarrage de {app}, en environnement {environnement}", app.Environment.ApplicationName, app.Environment.EnvironmentName);

// Logging des requêtes entrantes
app.UseMiddleware<LogOriginMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AngularDev");

app.MapControllers();

app.Run();