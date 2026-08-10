# Business Analysis

This document explains the business logic, rules, and workflows for every module in the `Demo_Prj_Intern` platform.

---

## 1. Authentication

*   **Business objective**: Secure the platform by verifying user identities and handling session tokens.
*   **Business rules**:
    *   Emails must be unique across the platform.
    *   Users can register via standard Local credentials or via OAuth2 (Google).
    *   OAuth2 users without a pre-defined role are defaulted to `CLIENT` and can choose their role later.
*   **Workflow**:
    1.  User submits credentials (or OAuth token).
    2.  System verifies credentials.
    3.  System returns a JWT Token and assigns a Role.
*   **Current implementation**: Implemented in `AuthServiceImpl`. Supports basic Registration, Login, OAuth2 stub, and Role choosing.
*   **Missing implementation**: Real JWT generation/validation is mocked. Real OAuth2 provider verification is missing. Logout is empty.

## 2. User

*   **Business objective**: Manage core user accounts, roles, and status.
*   **Business rules**:
    *   Every user is strictly classified as either an `ADMIN`, `CLIENT`, or `FREELANCER` (or `ROLE_PENDING`).
    *   Every registered user automatically receives a `Wallet`.
    *   If a user registers as a `FREELANCER`, a profile is auto-generated.
*   **Workflow**: Registration -> Wallet Creation -> (Optional) Freelancer Profile Creation.
*   **Current implementation**: Handled implicitly during Authentication. `UserEntity` manages state.
*   **Missing implementation**: Dedicated User management APIs (e.g., Change Password, Admin ban user) are missing or limited.

## 3. Freelancer Profile

*   **Business objective**: Allow freelancers to showcase their skills, portfolio, and hourly rate to attract clients.
*   **Business rules**: Only users with the `FREELANCER` role possess a profile.
*   **Workflow**: Freelancer updates their Bio, Skills, and Hourly Rate -> Clients view this profile when reviewing Proposals.
*   **Current implementation**: `FreelancerProfileServiceImpl` allows basic CRUD operations for the profile.
*   **Missing implementation**: Advanced search, filtering by skills, or portfolio file uploads.

## 4. Project

*   **Business objective**: A marketplace listing where Clients advertise their needs.
*   **Business rules**:
    *   Only `CLIENT`s can post projects.
    *   Projects have a strict budget and deadline.
    *   Projects can define the maximum number of freelancers needed.
*   **Workflow**: Client posts Project -> Freelancers view and bid -> Status changes from `OPEN` to `IN_PROGRESS` when contracted.
*   **Current implementation**: `ProjectServiceImpl` allows Clients to create, update, and list projects.
*   **Missing implementation**: Categorization/Tags, advanced search/filtering, and automatic expiry if no proposals are received.

## 5. Proposal

*   **Business objective**: The bidding mechanism for Freelancers.
*   **Business rules**:
    *   Only `FREELANCER`s can submit proposals.
    *   A Freelancer can only bid once per project.
*   **Workflow**: Freelancer submits proposed price and cover letter -> Client reviews -> Client Accepts or Rejects.
*   **Current implementation**: `ProposalServiceImpl` supports creating proposals and listing them for a project.
*   **Missing implementation**: Counter-offers or negotiation workflows.

## 6. Contract

*   **Business objective**: Formalize the agreement between a Client and a Freelancer.
*   **Business rules**:
    *   Created immediately upon the acceptance of a Proposal.
    *   Locks in the `finalPrice`.
*   **Workflow**: Proposal Accepted -> Contract Created (`PROCESSING`) -> Milestones are completed -> Contract `COMPLETED`.
*   **Current implementation**: `ContractServiceImpl` handles contract generation linking the Project, Client, and Freelancer.
*   **Missing implementation**: Dispute resolution workflow (`DISPUTED` status).

## 7. Milestone

*   **Business objective**: Break down large contracts into smaller, trackable deliverables and payments.
*   **Business rules**:
    *   Milestones allow tracking deliverables and paying for them individually.
*   **Workflow**: Contract Created -> Milestones Defined (`PENDING`) -> Freelancer Submits Work (`SUBMITTED`) -> Client Approves/Pays -> Status changes to `RELEASED`.
*   **Current implementation**: `MilestoneServiceImpl` manages milestone creation and submission via `MilestoneSubmissionEntity`.
*   **Missing implementation**: There are no validations ensuring the total milestone amounts do not exceed the contract budget. The `FUNDED` status exists but is not used in the code.

## 8. Wallet

*   **Business objective**: Internal financial ledger for users to store funds securely.
*   **Business rules**:
    *   Cannot have a negative available balance.
*   **Workflow**: User Deposits Money -> Balance Increases -> Client Pays Milestone -> Client Balance Decreases and Freelancer Balance Increases.
*   **Current implementation**: `WalletServiceImpl` manages the balance and freezing balance fields.
*   **Missing implementation**: True Escrow logic (using `freezingBalance`) is completely missing; funds are transferred directly. Real-world payment gateway integration is also missing.

## 9. Transactions

*   **Business objective**: Maintain an immutable audit trail of all financial movements.
*   **Business rules**: Every change to a Wallet's balance must be accompanied by a `WalletTransactionEntity`.
*   **Workflow**: Deposit -> Transaction Logged; Milestone Paid -> `ESCROW_RELEASE` Transaction Logged for both parties.
*   **Current implementation**: Tracked alongside Wallet operations via `WalletTransactionEntity`.
*   **Missing implementation**: Transaction exporting (CSV/PDF) or detailed invoicing.

## 10. Review

*   **Business objective**: Establish a trust and rating system based on past contracts.
*   **Business rules**: TODO
*   **Workflow**: TODO
*   **Current implementation**: TODO - **Not implemented.**
*   **Missing implementation**: Entire module is missing. Entities, Controllers, and Services need to be created to allow Clients to rate Freelancers (and vice versa) after a Contract is `COMPLETED`.

## 11. Notification

*   **Business objective**: Keep users informed about important events (new proposals, accepted contracts, messages).
*   **Business rules**: TODO
*   **Workflow**: TODO
*   **Current implementation**: TODO - **Not implemented.**
*   **Missing implementation**: Entire module is missing. Needs WebSocket integration or basic polling with a `NotificationEntity` to alert users of system events.
