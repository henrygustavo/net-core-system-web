namespace SystemNetCore.UnitTest
{
    using Microsoft.Extensions.Configuration;

    public abstract class BaseTest
    {
        protected BaseTest()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json");
            Configuration = builder.Build();
        }
        protected IConfiguration Configuration { get; }
    }
}
