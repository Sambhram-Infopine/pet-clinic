# Pet Clinic

Pet Clinic is a web-based veterinary clinic management system built with a Spring Boot backend and a React + Vite frontend. It provides secure login, pet and owner management, appointment and visit records, and a simple administrative dashboard.

## Project Structure

- `backend/` — Spring Boot REST API, JPA entities, service layer, controllers, security, and tests.
- `frontend/` — React application powered by Vite, client routes, authentication, and UI components.

## Getting Started

### Backend

```powershell
cd backend
./mvnw.cmd test
./mvnw.cmd spring-boot:run
```

### Frontend

```powershell
cd frontend
npm install
npm test
npm run dev
```

## What’s Included

- Controllers for health, login, owners, pets, pet types, and veterinarians
- Service and repository layers with JPA persistence
- JWT utility and security configuration
- React protected routes and authenticated login flow
- Unit tests for backend services/controllers and frontend components

## Notes

This repository includes both backend and frontend documentation to help new contributors get started quickly.
 