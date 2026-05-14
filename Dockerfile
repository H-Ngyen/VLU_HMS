# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["API/src/AppHost/AppHost.csproj", "API/src/AppHost/"]
COPY ["API/src/Application/Application.csproj", "API/src/Application/"]
COPY ["API/src/Domain/Domain.csproj", "API/src/Domain/"]
COPY ["API/src/Infrastructure/Infrastructure.csproj", "API/src/Infrastructure/"]

RUN dotnet restore "API/src/AppHost/AppHost.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/API/src/AppHost"
RUN dotnet build "AppHost.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "AppHost.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Install curl for healthcheck (optional but good for performance env)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["dotnet", "AppHost.dll"]
