using Serilog;

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

// Configuration du pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AngularDev");

// Configuration des routes des Controllers
app.MapControllers();

app.Logger.LogInformation(
    "Demarrage en environnement : {Environment}",
    app.Environment.EnvironmentName
);

app.Run();