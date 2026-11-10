using API.Middleware;

namespace API.Extensions.ConfigurePipeline;

public static class PipelineExtensions
{
    public static WebApplication AddUseSwagger(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        return app;
    }

    public static WebApplication AddUseHttpRedirection(this WebApplication app)
    {
        app.UseHttpsRedirection();
        return app;
    }

    public static WebApplication AddUseCors(this WebApplication app)
    {
        app.UseCors("AllowSpecificOrigins");

        return app;
    }

    public static WebApplication AddUseStaticFiles(this WebApplication app, IWebHostEnvironment environment)
    {

        return app;
    }

    public static WebApplication AddUseAuth(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        return app;
    }


    public static WebApplication AddUseLoggingMiddleware(this WebApplication app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        return app;
    }

    public static WebApplication AddUseMapControllers(this WebApplication app)
    {
        app.MapControllers();
        return app;
    }
}