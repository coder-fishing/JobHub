# Project Context

## Project Goals
The goal of `Demo_Prj_Intern` (FreelancerV1) is to provide a comprehensive REST API backend for a freelance and outsourcing marketplace. The system aims to seamlessly connect Clients with Freelancers by managing the entire project lifecycle—from initial job posting and bidding, to contract establishment, milestone tracking, and financial transactions.

## User Roles
Based on the implementation, the system supports the following roles:
1. **Freelancer**: Can set up a professional profile, browse available projects, submit proposals (bids), accept contracts, submit milestone deliverables, and receive payments into their virtual wallet.
2. **Client**: Can post new projects, review incoming proposals from freelancers, hire freelancers by generating contracts, review milestone submissions, and release funds.
*(Note: A base User role exists for shared functionality like authentication, OAuth2, and managing the core virtual wallet).*

## Business Domain
The application operates within the Gig Economy / Freelance Marketplace domain. The core business concepts include:
*   **Authentication & Profiles**: Managing secure access and distinct identities/capabilities based on user roles.
*   **Project Marketplace**: A central hub where demand (Projects) meets supply (Proposals).
*   **Contract Management**: Formalizing agreements between parties.
*   **Milestone Tracking**: Breaking down large contracts into smaller, manageable, and verifiable phases (Milestones & Submissions).
*   **Virtual Wallet & Transactions**: A built-in ledger system to handle internal currency deposits and payouts between parties. (Note: Escrow logic is defined in the database but not yet fully implemented in code).

## Core Workflow
1. **Onboarding**: Users register an account and instantly receive a virtual `Wallet`. If the user chooses the `FREELANCER` role, an empty `FreelancerProfile` is automatically generated. OAuth2 users are given a default role and can explicitly choose their role later.
2. **Job Posting**: A Client creates a `Project` specifying the requirements, budget, and scope.
3. **Bidding**: Freelancers find the `Project` and submit `Proposals` detailing their terms and pricing.
4. **Hiring**: The Client reviews the proposals and accepts one. This action transitions the relationship into a formal `Contract`.
5. **Execution**: The `Contract` is divided into `Milestones`. As work is completed, the Freelancer makes a `MilestoneSubmission`.
6. **Payment**: The Client approves the milestone submissions or pays the milestone, triggering the `Wallet` system to release funds (currently implemented as a direct transfer from the Client's available balance to the Freelancer's available balance).

## Existing Features
*   **Authentication API**: Support for local registration/login and a stubbed OAuth2 login flow.
*   **Role Management**: Ability to assign and update roles (Client vs. Freelancer).
*   **Profile Management**: Freelancers can update their personal profiles/portfolios.
*   **Project Board**: Clients can create and manage projects.
*   **Proposal System**: Freelancers can submit bids to open projects.
*   **Contract & Milestone System**: Generation of contracts and tracking of phased project deliverables.
*   **Wallet System**: Basic entities and structures for tracking balances and transaction history.
*   **Global Error Handling**: Standardized API error responses via `@ControllerAdvice`.

## Current Implementation Status
*   **Structural Foundation**: The system is well-structured using the classic Controller-Service-Repository pattern. Entities and DTOs are properly separated.
*   **Database Schema**: Relational database mappings (JPA/Hibernate) are fully defined for all core business entities.
*   **Security (Partial)**: Spring Security is configured, but currently, it permits all requests to `/api/**` without requiring an active token. The JWT token generation is currently stubbed (returning `"SAMPLE_JWT_TOKEN"`).
*   **OAuth2 (Partial)**: The OAuth2 login endpoint successfully maps emails to accounts but currently skips verifying the actual identity provider's token.
*   **Logout**: The logout function is defined in the service but currently empty.
*   **Financials**: The Wallet and Transaction models exist, and milestone payments are processed directly between available balances. True escrow logic (using `freezingBalance`) is not yet implemented.
