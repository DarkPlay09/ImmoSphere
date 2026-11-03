
using Serilog;
using ImmoSphere.Api.Middlewares;
using ImmoSphere.Infrastructure;
using ImmoSphere.Infrastructure.Identity;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Seeders;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// SERILOG
// ==========================================

builder.Services.AddSerilog((services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});

// ==========================================
// SERVICES API
// ==========================================

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// ==========================================
// INFRASTRUCTURE (PostgreSQL, DbContext...)
// ==========================================

builder.Services.AddInfrastructure(builder.Configuration);

// ==========================================
// ASP.NET CORE IDENTITY
// ==========================================

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        // Utilisateurs
        options.User.RequireUniqueEmail = true;

        // Sécurité des mots de passe
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireNonAlphanumeric = false;

        // À activer lorsque la confirmation par email sera prête
        // options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Service pour inscrire les utilisateurs
builder.Services.AddScoped<UtilisateurRegistrationService>();

// Autorisation des accès
builder.Services.AddAuthorization();

// ==========================================
// CORS (FRONT-END ANGULAR)
// ==========================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ==========================================
// CONSTRUCTION DE L'APPLICATION
// ==========================================

var app = builder.Build();

// ==========================================
// ENVIRONNEMENT DEVELOPMENT
// ==========================================

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

    // ==========================================
    // SEEDERS (DONNÉES DE DÉMONSTRATION)
    // ==========================================

    // IMPORTANT :
    // Exécuter ce bloc uniquement après avoir
    // appliqué les migrations EF Core.

    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();

    var userManager = scope.ServiceProvider
        .GetRequiredService<UserManager<ApplicationUser>>();

    // 1. Création des rôles Identity
    await IdentitySeeder.SeedRolesAsync(roleManager);

    // 2. Création des données immobilières
    await DatabaseSeeder.SeedAsync(db);

    // 3. Création des utilisateurs de démonstration
    await IdentitySeeder.SeedDemoUsersAsync(
        userManager,
        db,
        builder.Configuration["DemoSeed:Password"]
    );
}

// ==========================================
// LOGGING AU DÉMARRAGE
// ==========================================

app.Lifetime.ApplicationStarted.Register(() =>
{
    app.Logger.LogInformation(
        "Démarrage de {Application} en environnement {Environment} sur {Urls}",
        app.Environment.ApplicationName,
        app.Environment.EnvironmentName,
        string.Join(", ", app.Urls)
    );
});

// ==========================================
// PIPELINE HTTP
// ==========================================

// Logging des requêtes entrantes
app.UseMiddleware<LogOriginMiddleware>();

// Redirection HTTPS
app.UseHttpsRedirection();

// Autoriser le front Angular
app.UseCors("AngularDev");

// Authentification Identity
app.UseAuthentication();

// Vérification des autorisations
app.UseAuthorization();

// Endpoints des controllers
app.MapControllers();

// ==========================================
// DÉMARRAGE
// ==========================================

app.Run();
