using API.Extensions.Services;

namespace API.Extensions;

public static class ApplyServicesExtensions
{
    public static IServiceCollection ApplyServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGenConfig();
        services.ConfigureDatabase(configuration);
        services.AddMediatorConfig();
        services.AddAutoMapperConfig();
        services.AddCorsConfig();
        return services;
    }
}