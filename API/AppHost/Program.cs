using AppHost.Extensions;
using AppHost.Middlewares;
using Application.Extensions;
using Infrastructure.Extensions;
using Infrastructure.Seeders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var config = builder.Configuration;

builder.AddPresentation();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(config);

var app = builder.Build();

// Add seeder to the database
var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<ISeeder>();
await seeder.Seed();

// Configure the HTTP request pipeline. 
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
