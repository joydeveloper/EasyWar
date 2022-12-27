using HeadQuarters.Data;
using HeadQuarters.Hubs;
using HeadQuarters.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace HeadQuarters
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));
            builder.Services.AddDatabaseDeveloperPageExceptionFilter();
            builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();
            builder.Services.AddRazorPages();
            builder.Services.AddSignalR();
            builder.Logging.AddFile(Path.Combine(Directory.GetCurrentDirectory(), "logger.txt"));
            var app = builder.Build();
            IHostEnvironment? env = app.Services.GetService<IHostEnvironment>();
            if (app.Environment.IsDevelopment())
            {
                app.UseMigrationsEndPoint();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            // app.UseSession();
            // app.UseResponseCompression();
            // app.UseResponseCaching();
            // app.UseCookiePolicy();
            app.MapRazorPages();
            app.MapControllerRoute(name: "default",pattern: "{controller=Home}/{action=Index}/{id?}");
            if (env != null)
            {
                // добавляем поддержку каталога node_modules
                app.UseFileServer(new FileServerOptions()
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(env.ContentRootPath, "node_modules")
                    ),
                    RequestPath = "/node_modules",
                    EnableDirectoryBrowsing = false
                    
            });
                Console.WriteLine("catalog");
                Console.WriteLine("catalog");
            }
            //===============================
           app.Map("/getheader", GetHeadersRequest);
            app.Map("/counter", Counter);
            app.Map("/checkstate", CheckProjectState);
            app.Map("/loggertest", LoggersTest);
            //===============================
            // app.UseMiddleware<TokenMiddleware>();
            Console.WriteLine($"{app.Environment.EnvironmentName}");
           // app.MapHub<TestHub>("/testHub");
            app.Run();
            static void GetHeadersRequest(IApplicationBuilder app)
            {
                app.Run(async context =>
              {
                  context.Response.ContentType = "text/html; charset=utf-8";
                  var stringBuilder = new System.Text.StringBuilder("<table>");

                  foreach (var header in context.Request.Headers)
                  {
                      stringBuilder.Append($"<tr><td>{header.Key}</td><td>{header.Value}</td></tr>");
                  }
                  stringBuilder.Append("</table>");
                  await context.Response.WriteAsync(stringBuilder.ToString());
              });
            }
            static void Counter(IApplicationBuilder app)
            {
                int x = 0;
                app.Run(async (context) =>
                {
                    x = x + 1;
                    await context.Response.WriteAsync($"Result: {x}");
                });
            }
            void LoggersTest(IApplicationBuilder appx)
            {
                appx.Run(async (context) =>
                {
                    var path = context.Request.Path;
                    app.Logger.LogCritical($"LogCritical {path}");
                    app.Logger.LogError($"LogError {path}");
                    app.Logger.LogInformation($"LogInformation {path}");
                    app.Logger.LogWarning($"LogWarning {path}");
                    app.Logger.LogInformation($"Path: {context.Request.Path}  Time:{DateTime.Now.ToLongTimeString()}");
                    await context.Response.WriteAsync("Hello World!");
                });
            }
            void CheckProjectState(IApplicationBuilder appx)
            {
                if (app.Environment.IsDevelopment())
                {
                    appx.Run(async (context) =>
                    {
                        app.Logger.LogInformation($"Processing request {context.Request.Path}");
                        await context.Response.WriteAsync("In Development Stage");
                    });
                }
                else
                {
                    appx.Run(async (context) => await context.Response.WriteAsync("In Production Stage"));
                }
            }
        }
    }
    public class TokenMiddleware
    {
        private readonly RequestDelegate next;

        public TokenMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Query["token"];
            if (token != "12345678")
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Token is invalid");
            }
            else
            {
                await next.Invoke(context);
            }
        }
    }
}











