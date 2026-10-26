# Vurn Frontend

Frontend application for **Vurn**, an AI-native engineering workspace built with React and TypeScript.

## Status

Currently under active development.

Implemented:
- User registration
- Email OTP verification
- Login and Google authentication
- Password reset
- JWT-based authentication
- Protected and public routes
- Automatic access-token refresh
- User navigation and responsive application shell

Profile and organization management are in development.

## Tech Stack

- **React + TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Redux Toolkit**
- **TanStack Query**
- **React Router**
- **Axios**
- **React Hook Form + Zod**
- **Lucide React**

## Architecture

The frontend follows a feature-oriented architecture with centralized application infrastructure.

```text
Browser
  |
  v
React Application
  |
  +-- Routing
  +-- Authentication
  +-- State Management
  +-- API Layer
  +-- Feature Modules
  +-- Shared UI
  |
  v
Django REST API
```

## Development Principles

The frontend follows several architectural principles:

### Separation of Concerns

UI components should not contain unnecessary API or business logic.

### Feature Ownership

Domain-specific functionality should remain within its feature module.

### Centralized Infrastructure

Application-wide concerns such as:

* Routing
* Redux
* API configuration
* Axios interceptors
* Authentication bootstrap
* Modal state

are handled centrally.

### Type Safety

TypeScript is used throughout the application to provide compile-time guarantees for API contracts, component props, application state, and form data.

### Validation at the Boundary

Forms use Zod schemas together with React Hook Form to validate user input before requests are sent to the backend.

## Project Context

Vurn is an AI-native engineering workspace designed to bring essential software development workflows into a unified platform.

The platform is intended to provide a centralized environment for teams to manage:

* Organizations
* Projects
* Sprints
* Issues
* Engineering workflows
* Documentation
* Notifications
* Integrations
* AI-assisted engineering workflows

The frontend provides the client-side application layer for these capabilities and is being developed incrementally, with authentication and identity forming the foundation for the remaining workspace features.

---

*Currently under active development.*
