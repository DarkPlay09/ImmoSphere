using Serilog;
using ImmoSphere.Api.Middlewares;
using ImmoSphere.Api.Security;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services;
using ImmoSphere.Domain.Services.Auth;
using ImmoSphere.Domain.Services.Interfaces;
using ImmoSphere.Infrastructure;
using ImmoSphere.Infrastructure.Identity;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Seeders;
using ImmoSphere.Infrastructure.Repositories;
using ImmoSphere.Infrastructure.Services.Email;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using System.Threading.RateLimiting;

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
// SÉCURITÉ CSRF
// ==========================================

builder.Services.AddAntiforgery(options =>
{
    // En-tête que le frontend devra envoyer.
    options.HeaderName = "X-XSRF-TOKEN";

    // Cookie technique contenant le jeton antiforgery.
    options.Cookie.Name = "ImmoSphere.Antiforgery";

    options.Cookie.HttpOnly = true;

    options.Cookie.SameSite = SameSiteMode.Lax;

    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

// ==========================================
// INFRASTRUCTURE (PostgreSQL, DbContext...)
// ==========================================

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

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

        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var jwtKey = Convert.FromBase64String(
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Clé JWT manquante.")
);

if (jwtKey.Length < 32)
    throw new InvalidOperationException("Clé JWT trop courte.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(jwtKey),

            NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,

            ClockSkew = TimeSpan.FromSeconds(30)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (!context.Request.Headers.ContainsKey("Authorization") &&
                    context.Request.Cookies.TryGetValue(
                        AuthSessionCookie.Name,
                        out var jwt))
                {
                    context.Token = jwt;
                }

                return Task.CompletedTask;
            }
        };
    });

// Service pour inscrire les utilisateurs
builder.Services.AddScoped<UtilisateurRegistrationService>();

// Autorisation des accès
builder.Services.AddAuthorization();

// ==========================================
// LIMITATION DES REQUÊTES
// ==========================================

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;

    options.AddPolicy("resend-confirmation", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey:
            context.Connection.RemoteIpAddress?.ToString()
            ?? "unknown",

            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(5),
                QueueLimit = 0,
                AutoReplenishment = true
            }
        )
    );
});

// ==========================================
// CORS (FRONT-END ANGULAR)
// ==========================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ==========================================
// Inscription des repositories
// ==========================================
//                          Interface, Classe qui l'implémente
builder.Services.AddScoped<IBienRepository, BienRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAgenceRepository, AgenceRepository>();
builder.Services.AddScoped<IFaqRepository, FaqRepository>();
builder.Services.AddScoped<IFavoriRepository, FavoriRepository>();

// ==========================================
// Inscription des services
// ==========================================
//                          Interface, Classe qui l'implémente
builder.Services.AddScoped<IBienService, BienService>();
builder.Services.AddScoped<IRegisterService, RegisterService>();
builder.Services.AddScoped<IEmailConfirmationService, EmailConfirmationService>();
builder.Services.AddScoped<IAgenceService, AgenceService>();
builder.Services.AddScoped<IFaqService, FaqService>();

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
        "Password1234$"
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

app.UseRouting();

// Autoriser le front Angular
app.UseCors("AngularDev");

app.UseRateLimiter();

// Authentification
app.UseAuthentication();

// Autorisation
app.UseAuthorization();

// ==========================================
// VALIDATION CSRF DES SESSIONS PAR COOKIE
// ==========================================

app.Use(async (context, next) =>
{
    // Protection active uniquement lorsque
    // les cookies de session sont activés.
    var cookiesEnabled = app.Configuration
        .GetValue<bool>("Auth:SessionCookiesEnabled");

    // Les méthodes de lecture ne nécessitent pas
    // de jeton CSRF.
    var method = context.Request.Method;

    var isUnsafeMethod =
        !HttpMethods.IsGet(method) &&
        !HttpMethods.IsHead(method) &&
        !HttpMethods.IsOptions(method) &&
        !HttpMethods.IsTrace(method);

    // Vérifier que l'authentification utilise
    // réellement notre cookie de session.
    var hasSessionCookie = context.Request.Cookies
        .ContainsKey(AuthSessionCookie.Name);

    var hasAuthorizationHeader = context.Request.Headers
        .ContainsKey("Authorization");

    var isAuthenticated =
        context.User.Identity?.IsAuthenticated == true;

    var usesCookieAuthentication =
        hasSessionCookie &&
        !hasAuthorizationHeader &&
        isAuthenticated;

    if (
        cookiesEnabled &&
        isUnsafeMethod &&
        usesCookieAuthentication
    )
    {
        var antiforgery = context.RequestServices
            .GetRequiredService<IAntiforgery>();

        var isValid = await antiforgery
            .IsRequestValidAsync(context);

        if (!isValid)
        {
            context.Response.StatusCode =
                StatusCodes.Status403Forbidden;

            await context.Response.WriteAsJsonAsync(new
            {
                message = "Jeton CSRF absent ou invalide."
            });

            return;
        }
    }

    await next();
});

// Endpoints
app.MapControllers();

// ==========================================
// ENDPOINT CSRF
// ==========================================

app.MapGet("/api/auth/csrf",
    (HttpContext context, IAntiforgery antiforgery) =>
    {
        // Générer un jeton associé au navigateur.
        var tokens = antiforgery.GetAndStoreTokens(context);

        // Éviter la mise en cache de cette réponse.
        context.Response.Headers["Cache-Control"] = "no-store";

        return Results.Ok(new
        {
            csrfToken = tokens.RequestToken
        });
    });

// ==========================================
// DÉMARRAGE
// ==========================================

app.Run();
