# Backend

The backend is a Spring Boot REST API that handles clinic data persistence, authentication, and business logic. It uses JPA entities, service and repository layers, controller endpoints, and JWT-based security utilities.

## Project Structure

- `src/main/java/com/petclinic/backend/controller/` — REST controllers for health checks, authentication, owners, pets, pet types, and veterinarians
- `src/main/java/com/petclinic/backend/service/` — service implementations containing business logic
- `src/main/java/com/petclinic/backend/dao/` — JPA repositories for `Owner`, `Pet`, `PetType`, `Veterinarian`, and `Login`
- `src/main/java/com/petclinic/backend/entity/` — persistent domain entities
- `src/main/java/com/petclinic/backend/dto/` — request and response DTOs for API payload mapping
- `src/main/java/com/petclinic/backend/security/` — JWT utility and authentication support
- `src/test/java/com/petclinic/backend/` — unit and integration tests

## Running

```powershell
cd backend
./mvnw.cmd test
./mvnw.cmd spring-boot:run
```

## Notes

- Security is managed by `JwtUtil` and `SecurityConfig`.
- Data access uses Spring Data JPA repositories extending `JpaRepository`.
- The backend exposes JSON endpoints for frontend integration.
- Tests are located under `src/test/java/com/petclinic/backend/`.
