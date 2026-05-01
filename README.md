# VLU Hospital Management System (HMS)

A comprehensive Hospital Management System (HMS) developed for VLU, featuring a modern, clean architecture backend with .NET and a responsive frontend built with React and Vite.

## 🏗️ Architecture

The project is divided into two main components:
- **Backend (`API/`)**: A robust API built with ASP.NET Core following the Clean Architecture pattern.
- **Frontend (`client/`)**: A modern Single Page Application (SPA) built with React, TypeScript, and Vite.

### Backend Structure (Clean Architecture)
* **`Domain/`**: Contains enterprise logic and types (Entities, Enums, Constants, Exceptions, Interfaces). It represents the core of the system and has no dependencies on other layers.
* **`Application/`**: Contains the business logic (Commands, Queries, DTOs, Event Handlers). It depends only on the Domain layer and defines interfaces that are implemented by outside layers.
* **`Infrastructure/`**: Contains infrastructure-specific implementations like Database Persistence (Entity Framework Core), Background Services, Authorization, and external service integrations (e.g., EmailService).
* **`AppHost/`**: The presentation layer (ASP.NET Core Web API). It contains Controllers, Middlewares, and configuration to run the application.

### Frontend Structure
* **`src/components/`**: Reusable UI components.
* **`src/pages/`**: Application views and pages.
* **`src/layouts/`**: Page layout wrappers.
* **`src/services/`**: API integration and communication layers.
* **`src/contexts/` & `src/hooks/`**: React Contexts and custom hooks for state management.
* **`src/types/`**: TypeScript type definitions.

## ✨ Key Features
- **Patient Management**: Manage patient records, admissions, and discharges.
- **Medical Records**: Track detailed medical histories, clinical types, pathology results, and treatments.
- **Departments & Transfers**: Manage hospital departments and patient transfers.
- **Lab & Imaging**: Handle Hematology tests, X-Rays, and medical attachments with MinIO storage.
- **Real-time Notifications**: WebSockets (SignalR) integration for system notifications.
- **Role-based Authorization**: Secure access control for different hospital roles.
- **Statistics & Reporting**: Dashboard and statistical queries.

## 🚀 Getting Started

### Prerequisites
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download) (or newer)
- [Node.js](https://nodejs.org/) (v24+ recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- A relational database (PostgreSQL) as configured in your `appsettings.json`

### 1. Environment Configuration

**Backend:**
1. Navigate to `API/AppHost/`.
2. Copy `.env.example` to `.env` and fill in your configuration.
3. Ensure `appsettings.Development.json` is properly configured.

**Frontend:**
1. Navigate to `client/`.
2. Copy `.env.example` to `.env` and set your API base URL (e.g., `VITE_API_URL=http://localhost:5000/api`).

### 2. Running Services (MinIO)
The system uses MinIO for object storage (e.g., Medical Attachments). Run the required services using Docker:
```bash
docker-compose up -d minio
```
MinIO Console will be accessible at `http://localhost:9001`.

### 3. Running the Backend API
```bash
cd API/AppHost
dotnet build
dotnet run
```
The API will typically start on `http://localhost:5000` or `https://localhost:5001`. Swagger UI is available at `/swagger`.

### 4. Running the Frontend Client
```bash
cd client
npm install
npm run dev
```
The React application will be accessible at `http://localhost:5173`.

## 🛠️ Technologies Used
- **Backend**: C#, ASP.NET Core, Entity Framework Core, SignalR.
- **Frontend**: React, TypeScript, Vite, Tailwind CSS (assumed based on `components.json`/shadcn), React Router.
- **Storage**: Relational DB, MinIO (S3 Compatible).
