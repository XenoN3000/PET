using API.Extensions.ConfigurePipeline;

namespace API.Extensions;

public static class ApplyPipelineExtensions
{
    

    public static WebApplication ApplyPipelines(this WebApplication app,  IWebHostEnvironment environment)
    {

        app.AddUseSwagger();
        app.AddUseHttpRedirection();
        app.AddUseCors();
        app.AddUseStaticFiles(environment);
        app.AddUseAuth();
        app.AddUseLoggingMiddleware();
        app.AddUseMapControllers();
        
        return app;
    }
}