using Application.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Persistence;


namespace API.Extensions.Services;

public static class ServiceExtensions
{
    
    public static IServiceCollection AddSwaggerGenConfig(this IServiceCollection services)
    {
        services.AddSwaggerGen();
        return services;
    }

    public static IServiceCollection AddCorsConfig(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigins", policy =>
            {
                policy.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .SetIsOriginAllowed(origin => true);
            });
        });

        return services;
    }

    public static IServiceCollection AddMediatorConfig(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(Result<>).Assembly);
        });
        
        return services;
    }

    public static IServiceCollection AddAutoMapperConfig(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => { cfg.AddProfile<MappingProfiles>(); });

        return services;
    }


    public static IServiceCollection ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DatabaseContext>(options =>
        {
            string connStr;

            //
            //     switch (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"))
            //     {
            //         case "Development":
            //             connStr = configuration.GetConnectionString("DefaultConnection")!;
            //             break;
            //         case "Production":
            //         default:
            //             var connUrl = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
            //
            //             // Parse connection URL to connection string for Npgsql
            //
            //             if (connUrl!.StartsWith("postgresql://"))
            //             {
            //                 connUrl = connUrl!.Replace("postgresql://", string.Empty);
            //                 var pgUserPass = connUrl.Split("@")[0];
            //                 var pgHostPortDb = connUrl.Split("@")[1];
            //                 var pgHostPort = pgHostPortDb.Split("/")[0];
            //                 var pgDb = pgHostPortDb.Split("/")[1];
            //                 var pgUser = pgUserPass.Split(":")[0];
            //                 var pgPass = pgUserPass.Split(":")[1];
            //                 var pgHost = pgHostPort.Split(":")[0];
            //                 var pgPort = pgHostPort.Split(":")[1];
            //
            //                 connStr =
            //                     $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}; Trust Server Certificate=true";
            //                 break;
            //             }
            //
            //             connStr = $"{connUrl}";
            //             break;
            //     }
            //
            //     options.UseNpgsql(connStr);
            // });
            //
            // AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            options.UseSqlite(
                configuration.GetConnectionString("DefaultConnection"),
                // This tells EF Core to save migrations inside the Persistence project folder
                b => b.MigrationsAssembly(typeof(DatabaseContext).Assembly.FullName));
        });
        return services;
    }
}