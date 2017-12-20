namespace SystemNetCore.Web
{
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Serilog;
    using Serilog.Events;
    using Serilog.Formatting.Compact;
    using System.IO;
    using System.Reflection;

    public class Program
    {
        public static void Main(string[] args)
        {

            AddLogger();
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>

            WebHost.CreateDefaultBuilder(args).UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureAppConfiguration((context, builder) =>
                {
                    IHostingEnvironment env = context.HostingEnvironment;

                    builder.
                     AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).
                     AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true)
                    .AddEnvironmentVariables();

                    if (env.IsDevelopment())
                    {
                        var appAssembly = Assembly.Load(new AssemblyName(env.ApplicationName));
                        if (appAssembly != null)
                        {
                            builder.AddUserSecrets(appAssembly, optional: true);
                        }
                    }
                })
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseSerilog()
                .Build();


        private static void AddLogger()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Verbose()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File(new CompactJsonFormatter(), "Logs/Logs.json", rollingInterval: RollingInterval.Day)
                .CreateLogger();
        }
    }
}
