var builder = WebApplication.CreateBuilder(args);

// Enregistrement des services
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Autorise les requêtes provenant de "http://localhost:4200" => Front-end
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

app.Run();