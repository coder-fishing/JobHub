# Project Overview
The `Demo_Prj_Intern` (FreelancerV1) project is a backend RESTful API system for a freelance/outsourcing platform (similar to Upwork or Freelancer.com). It allows Clients to post projects and Freelancers to bid on them (proposals), establish contracts, manage project milestones, and handle virtual wallet transactions.

# Technology Stack
*   **Language**: Java 17
*   **Framework**: Spring Boot 4.1.0
*   **Build Tool**: Gradle (9.5.1)
*   **Data Access**: Spring Data JPA & Hibernate
*   **Database**: MySQL 8.0+
*   **Security**: Spring Security (with OAuth2 client dependency included)
*   **Other Libraries**: Lombok, HikariCP (Connection Pool)

# High Level Architecture
The application follows a standard layered architecture:
*   **Controller Layer**: Exposes REST APIs, handles HTTP requests/responses, and delegates business logic to services.
*   **Service Layer**: Contains the core business logic. Divided into interfaces and implementations (`serviceImpl`).
*   **Repository Layer**: Handles database operations using Spring Data JPA.
*   **Entity Layer**: Represents the database schema and object-relational mapping (ORM).
*   **DTO Layer**: Used for data transfer between the client and the server (Requests and Responses).

# Folder Structure
```
src/main/java/com/example/demo_prj_intern/
├── config/          # Configuration classes (e.g., SecurityConfig)
├── controller/      # REST API Controllers
├── dto/             
│   ├── request/     # DTOs for incoming requests
│   └── respone/     # DTOs for outgoing responses (Note: folder is named 'respone')
├── entity/          # JPA Entities mapping to DB tables
├── exception/       # Global exception handling logic
├── repository/      # Spring Data JPA Repository interfaces
└── service/         
    └── serviceImpl/ # Implementations of the service interfaces
```

# Package Responsibilities
*   **config**: Configures global beans and application settings, notably CORS and Spring Security.
*   **controller**: Defines the endpoints, HTTP methods, and maps incoming JSON to DTOs.
*   **dto.request / dto.respone**: Encapsulates data to decouple the API layer from the database schema. Prevents exposing sensitive fields and handles validation.
*   **entity**: Defines table structures, relationships (OneToMany, ManyToOne), and constraints.
*   **exception**: Intercepts unhandled exceptions and formats them into standardized error responses (e.g., `ErrorResponse`, `GlobalExceptionHandler`).
*   **repository**: Interfaces extending `JpaRepository` for CRUD operations and custom queries.
*   **service**: Interfaces defining the contract for business operations.
*   **service.serviceImpl**: Concrete classes implementing business logic, orchestrating repositories, and handling transactions.

# Core Modules

## 1. Auth Module
*   **Purpose**: Manages user registration, login (Local and OAuth2), role assignment, and logout.
*   **Controllers**: `AuthController`
*   **Services**: `AuthService`, `AuthServiceImpl`
*   **Repositories**: `UserRepository`, `WalletRepository`, `FreelancerProfileRepository`
*   **Entities**: `UserEntity`
*   **DTOs**: `RegisterRequest`, `LoginRequest`, `Oauth2LoginRequest`, `ChooseRoleRequest`, `AuthLoginRequest`, `AuthResponse`
*   **Dependencies**: Uses `PasswordEncoder` for hashing passwords. Interacts with Wallet and FreelancerProfile to initialize data on registration.

## 2. Freelancer Profile Module
*   **Purpose**: Manages the portfolios and profiles of freelancers.
*   **Controllers**: `FreelancerProfileController`
*   **Services**: `FreelancerProfileService`, `FreelancerProfileServiceImpl`
*   **Repositories**: `FreelancerProfileRepository`
*   **Entities**: `FreelancerProfileEntity`
*   **DTOs**: `FreelancerRequest`, `FreelancerProfileRespone`
*   **Dependencies**: None directly, but tightly coupled to `UserEntity`.

## 3. Project Module
*   **Purpose**: Allows clients to post and manage job opportunities.
*   **Controllers**: `ProjectController`
*   **Services**: `ProjectService`, `ProjectServiceImpl`
*   **Repositories**: `ProjectRepository`
*   **Entities**: `ProjectEntity`
*   **DTOs**: `CreateProjectRequest`, `UpdateProjectRequest`, `ProjectResponse`
*   **Dependencies**: Interacts with `UserEntity` (Client).

## 4. Proposal Module
*   **Purpose**: Enables freelancers to submit bids/proposals to open projects.
*   **Controllers**: `ProposalController`
*   **Services**: `ProposalService`, `ProposalServiceImpl`
*   **Repositories**: `ProposalRepository`
*   **Entities**: `ProposalEntity`
*   **DTOs**: `ProposalRequest`, `ProposalResponse`
*   **Dependencies**: Links `ProjectEntity` and `FreelancerProfileEntity` (or `UserEntity`).

## 5. Contract Module
*   **Purpose**: Manages the formal agreement between a Client and a Freelancer once a proposal is accepted.
*   **Controllers**: `ContractController`
*   **Services**: `ContractService`, `ContractServiceImpl`
*   **Repositories**: `ContractRepository`
*   **Entities**: `ContractEntity`
*   **DTOs**: `CreateContractRequest`, `ContractResponse`
*   **Dependencies**: Links `ProjectEntity` and `UserEntity`.

## 6. Milestone Module
*   **Purpose**: Handles the division of a contract into deliverable phases and tracks submissions.
*   **Controllers**: `MilestoneController`
*   **Services**: `MilestoneService`, `MilestoneServiceImpl`
*   **Repositories**: `MilestoneRepository`, `MilestoneSubmissionRepository`
*   **Entities**: `MilestoneEntity`, `MilestoneSubmissionEntity`
*   **DTOs**: `MilestoneRequest`, `MilestoneSubmissionRequest`, `MilestoneResponse`, `MilestoneSubmissionResponse`
*   **Dependencies**: Extends the `ContractEntity`.

## 7. Wallet Module
*   **Purpose**: Manages virtual balances, freezing funds (escrow), and transaction history.
*   **Controllers**: `WalletController`
*   **Services**: `WalletService`, `WalletServiceImpl`
*   **Repositories**: `WalletRepository`, `WalletTransactionRepository`
*   **Entities**: `WalletEntity`, `WalletTransactionEntity`
*   **DTOs**: `DepositRequest`, `WalletResponse`, `WalletTransactionResponse`
*   **Dependencies**: Linked to `UserEntity`. Used heavily when contracts/milestones are funded or released.

# Module Dependency Graph
*   **Auth** -> initializes -> **Wallet** & **FreelancerProfile**
*   **Project** <- depends on - **Proposal** (Freelancers bid on Projects)
*   **Proposal** -> transforms into -> **Contract** (When Client accepts)
*   **Contract** -> broken down into -> **Milestone**
*   **Milestone** -> tracks progress via -> **MilestoneSubmission**
*   **Wallet** <- interacts with - **Contract** / **Milestone** (For Escrow and Payouts)

# Request Flow
Client Request
↓
Controller (Validates input via DTOs, maps HTTP requests)
↓
Service (Executes business logic, orchestrates data)
↓
Repository (Executes Spring Data JPA methods)
↓
Database (MySQL)

# Authentication Flow
1.  User sends credentials via `/api/auth/login` or OAuth2 data via `/api/auth/oauth2`.
2.  `AuthController` routes request to `AuthServiceImpl`.
3.  `AuthServiceImpl` queries `UserRepository` by email.
4.  For local login, `PasswordEncoder` verifies the hashed password.
5.  If valid, an `AuthResponse` is returned with user details and a Token (Currently mocked as "SAMPLE_JWT_TOKEN").
6.  For OAuth2, if the user doesn't exist, they are registered implicitly with a "CLIENT" role.
7.  New OAuth2 users can choose their role later via `/api/auth/choose-role`.

# Business Flow
1.  **Registration**: Users register and receive a Wallet (Balance: 0). If they select "FREELANCER", a profile is created.
2.  **Project Posting**: Client creates a Project.
3.  **Bidding**: Freelancer views the Project and submits a Proposal.
4.  **Hiring**: Client reviews Proposals and creates a Contract with the selected Freelancer.
5.  **Execution**: The Contract is divided into Milestones.
6.  **Submission**: Freelancer submits work via MilestoneSubmissions.
7.  **Payment**: Client approves submissions. Funds move via the Wallet Module.

# Existing Features
*   User registration, login, and basic OAuth2 logic.
*   Role assignment (Freelancer/Client).
*   Automatic wallet creation upon registration.
*   Automatic freelancer profile creation.
*   CRUD structures for Projects, Proposals, Contracts, Milestones, and Wallets.
*   Global exception handling.
*   CORS configuration for Next.js/ReactJS integration.

# Missing Features
*   **JWT Implementation**: The token generated is a hardcoded string `"SAMPLE_JWT_TOKEN"`.
*   **Security Filter**: Spring Security currently permits all requests to `/api/**` instead of validating a JWT filter.
*   **OAuth2 Provider Validation**: The OAuth2 login logic bypasses checking the actual authentication provider if the email exists.
*   **Logout Logic**: The logout function is completely empty.
*   **Escrow Logic**: Funding milestones (moving balance to freezing balance) might be incomplete or missing actual payment gateway integration.

# Technical Debt
*   **Typo in Package Name**: The package `dto.respone` is misspelled (should be `response`).
*   **Hardcoded Values**: `SAMPLE_JWT_TOKEN` in authentication.
*   **Security Configuration**: `.authorizeHttpRequests` permits all `/api/**` which means APIs are not actually protected by authentication yet.
*   **OAuth2 Security Risk**: Currently trusts any request hitting `/api/auth/oauth2` with an email, without verifying an actual OAuth2 provider token.

# TODO
*   TODO: Implement JWT generation and validation (JwtFilter).
*   TODO: Update `SecurityConfig` to restrict endpoints based on roles (e.g., only Clients can create Projects).
*   TODO: Rename `dto.respone` to `dto.response`.
*   TODO: Implement actual logout logic (e.g., token blacklisting or clearing client cookies).
*   TODO: Secure the `/api/auth/oauth2` endpoint to validate actual Google/Facebook access tokens before authenticating.
*   TODO: Add proper password validation constraints on Registration.
