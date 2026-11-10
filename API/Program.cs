using API.Extensions;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add application and infrastructure services
builder.Services.ApplyServices(builder.Configuration, builder.Environment);

var app = builder.Build();

// Ensure database is created and seeded with standard QC protocols
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DatabaseContext>();
        await DbInitializer.SeedDataAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration/seeding.");
    }
}

// Configure HTTP pipeline
app.ApplyPipelines(app.Environment);

app.Run();
