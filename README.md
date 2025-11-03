# Product Validation App

## Opis projektu
Aplikacja do rejestracji produktów z walidacją po stronie klienta i backendu.  
- Frontend: HTML5, JavaScript (walidacja w przeglądarce)  
- Backend: Node.js, Express, Zod (walidacja danych, reguły biznesowe)  
- Testy jednostkowe i integracyjne: Jest  

## Adresy środowisk

- **Środowisko produkcyjne:** [https://product-validation-app.onrender.com](https://product-validation-app.onrender.com)  
- **Endpoint zdrowia:** [https://product-validation-app.onrender.com/health](https://product-validation-app.onrender.com/health)

Formularz rejestracji produktu i API są dostępne pod powyższym adresem.

## Uruchomienie lokalne

1. Sklonuj repozytorium:  
```bash
git clone https://github.com/masha282728/product-validation-app.git
cd product-validation-app
Testy

Uruchomienie wszystkich testów jednostkowych i integracyjnych:

npm test

Testy integracyjne

POST z błędnym payload → 400

POST z duplikatem → 409

GET/DELETE nieistniejącego zasobu → 404

Brak tokena → 401/403

Raport testów jest widoczny w logach konsoli.

CI/CD

Workflow GitHub Actions (.github/workflows/ci-cd.yml):

Uruchamia testy po każdym pushu do branch main

Deploy do Render tylko, jeśli testy zakończą się sukcesem

Smoke test /health po wdrożeniu

Konta testowe

Brak specjalnych kont — endpoint /api/protected wymaga nagłówka Authorization.

Uwagi

Walidacja działa zarówno w UI, jak i backendzie.

Serwer zwraca poprawne kody HTTP: 400, 409, 422, 404, 401/403.

Endpoint /health do sprawdzenia statusu serwera.
