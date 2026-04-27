using AppHost.Extensions;
using AppHost.Middlewares;
using Application.Extensions;
using Application.Notifications;
using Infrastructure.Extensions;
using Infrastructure.Seeders;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.LoadEnv();

// Ép Kestrel sử dụng URL từ biến môi trường
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (!string.IsNullOrEmpty(urls))
{
    builder.WebHost.UseUrls(urls.Split(';'));
}

// Add services to the container.
var config = builder.Configuration;

builder.AddPresentation(config);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(config);

var app = builder.Build();

// Add seeder to the database
var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<ISeeder>();
await seeder.Seed();

// Configure the HTTP request pipeline. 
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseMiddleware<RequestTimeLoggingMiddleware>();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapHub<NotificationHub>("/hubs/notifications");

app.MapControllers();

app.Run();
