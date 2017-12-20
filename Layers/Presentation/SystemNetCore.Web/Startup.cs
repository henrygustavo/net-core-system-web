namespace SystemNetCore.Web
{
    using AutoMapper;
    using Business.Entity;
    using Core.Email;
    using Core.Filters;
    using Core.Midleware;
    using DataAccess.Implementations;
    using DataAccess.Initializer;
    using DataAccess.Interfaces;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.IdentityModel.Tokens;
    using Swashbuckle.AspNetCore.Swagger;
    using System;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<ApplicationContext>(ServiceLifetime.Scoped);
            services.AddScoped<IDbContext>(_ => new ApplicationContext(Configuration));
            services.AddTransient<DbInitializer>();
            services.AddTransient<IdentityInitializer>();

            var lockoutOptions = new LockoutOptions
            {
             
                AllowedForNewUsers = Convert.ToBoolean(Configuration["Account:UserLockoutEnabledByDefault"]),
                DefaultLockoutTimeSpan = TimeSpan.FromMinutes(Double.Parse(Configuration["Account:DefaultAccountLockoutTimeSpan"])),
                MaxFailedAccessAttempts = Convert.ToInt32(Configuration["Account:MaxFailedAccessAttemptsBeforeLockout"])
            };

            services.AddIdentity<User, Role>(options =>
            {
                options.Lockout = lockoutOptions;
            }).AddEntityFrameworkStores<ApplicationContext>()
              .AddDefaultTokenProviders();

            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromHours(Convert.ToInt32(Configuration["Account:TokenExpirationTimeSpan"]));
            });

            services.AddScoped<IUserRepository>(_ => new UserRepository(_.GetService<IUnitOfWork>()));
            services.AddScoped<IRoleRepository>(_ => new RoleRepository(_.GetService<IUnitOfWork>()));
            services.AddScoped<IUnitOfWork>(_ => new UnitOfWork(_.GetService<IDbContext>()));

            services.AddAuthorization(cfg =>
            {
                cfg.AddPolicy("Administrator", p => p.RequireClaim(ClaimTypes.Role, "Admin"));
            });

            services.AddAuthentication().AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;

                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Configuration["Tokens:Issuer"],
                    ValidAudience = Configuration["Tokens:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Tokens:Key"]))
                };
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.Events.OnRedirectToLogin = (ctx) =>
                {
                    if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == 200)
                    {
                        ctx.Response.StatusCode = 401;
                    }

                    return Task.CompletedTask;
                };

                options.Events.OnRedirectToAccessDenied = (ctx) =>
                {
                    if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == 200)
                    {
                        ctx.Response.StatusCode = 403;
                    }

                    return Task.CompletedTask;
                };

            });

            services.AddMvc( options =>
                {
                    options.Filters.Add(typeof(ValidateModelAttribute));
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info {Title = "System API", Version = "v1"});
                c.AddSecurityDefinition("Bearer",
                    new ApiKeyScheme
                    {
                        In = "header",
                        Description = "Please insert JWT with Bearer into field",
                        Name = "Authorization",
                        Type = "bearer"
                    });
            });
           
            services.AddAutoMapper();

            services.AddScoped<IEmailSender>(_ => new AuthMessageSender(Configuration["EmailSettings:FromAddress"],
                                                                        Configuration["EmailSettings:Password"], 
                                                                        Configuration["EmailSettings:EmailServer"]));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env,
            DbInitializer seeder, IdentityInitializer identitySeeder)
        {

            var options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("index.html");

            app.UseDeveloperExceptionPage()
                .UseCors(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials())
                .Use(async (context, next) =>
                {
                    await next();

                    if (context.Request.Path.Equals("/admin"))
                    {
                        context.Request.Path = "/admin.html";
                        await next();
                    }
                })
                .UseSwagger() // Enable middleware to serve generated Swagger as a JSON endpoint.
                .UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                }) // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
                .UseMiddleware(typeof(ErrorWrappingMiddleware))
                .UseMvc()
                .UseDefaultFiles(options)
                .UseStaticFiles();

            seeder.Seed().Wait();

            if(env.IsDevelopment())
            identitySeeder.Seed().Wait();
        }
    }
}
