Cypress.on("uncaught:exception", () => false);

// ─────────────────────────────────────────────────────────────
// Shared login helper — runs before each test
// ─────────────────────────────────────────────────────────────
const adminLogin = () => {
  cy.visit("/en/login");
  cy.get("button[type='submit']").should("not.be.disabled");
  cy.wait(1000);

  cy.intercept("POST", "**/auth/login").as("loginRequest");
  cy.get("#identifier").clear().type("0900000000");
  cy.get("#password").clear().type("Admin123!");
  cy.get("button[type='submit']").click();

  cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);
  cy.url({ timeout: 10000 }).should("not.include", "/login");
};

// ─────────────────────────────────────────────────────────────
// Workflow 1 — User detail: disable → enable → edit
// ─────────────────────────────────────────────────────────────
describe("User Management — Workflow 1: View, Disable, Enable & Edit a User", () => {
  beforeEach(() => {
    adminLogin();
    cy.visit("/en/users");
    cy.wait(2000); // wait for user table to load
  });

  it("should open a user detail dialog, disable the account, re-enable it, then edit the name", () => {
    // ── 1. Click the Eye icon on the SECOND table row (avoid editing admin self) ─────────
    cy.get("table tbody tr").eq(1).within(() => {
      cy.get("svg.lucide-eye").parent("button").click();
    });

    // ── 2. Verify dialog opens ───────────────────────────────
    cy.get("div[role='dialog']").should("be.visible");

    // ── 3. Wait for user data to load (Edit Profile button appears when loaded)
    cy.get("div[role='dialog']")
      .contains("button", /edit profile/i, { timeout: 8000 })
      .should("be.visible");

    // ── 4. Open the MoreVertical (⋮) dropdown ────────────────
    cy.get('div[role="dialog"]').within(() => {
      cy.get('[data-testid="user-actions-trigger"]').click();
    });
    // Ensure the dropdown menu is visible before selecting items
    cy.get('[role="menuitem"]').should('be.visible');

    // ── 5. Determine current status and disable if ACTIVE ────
    cy.get("[role='menuitem']").then($items => {
      const labels = [...$items].map(el => el.textContent?.trim());
      const hasDisable = labels.some(l => l?.toLowerCase().includes("disable"));

      if (hasDisable) {
        // Account is ACTIVE — disable it
        cy.intercept("PATCH", "**/users/**/disable").as("disableUser");
        cy.get('[role="menuitem"]').contains(/disable/i).click();
        cy.wait("@disableUser").its("response.statusCode").should("be.oneOf", [200, 201]);
        cy.contains("User account disabled.", { timeout: 6000 }).should("exist");

        // ── 6. Re-enable via ⋮ dropdown ──────────────────────
        cy.get("div[role='dialog']")
          .contains("button", /edit profile/i, { timeout: 6000 })
          .should("exist");
        cy.get('div[role="dialog"]').within(() => {
          cy.get('[data-testid="user-actions-trigger"]').click();
        });
        cy.intercept("PATCH", "**/users/**/enable").as("enableUser");
        cy.get('[role="menuitem"]').contains(/enable/i).click();
        cy.wait("@enableUser").its("response.statusCode").should("be.oneOf", [200, 201]);
        cy.contains("User account re-enabled.", { timeout: 6000 }).should("exist");
      } else {
        // Account was already DISABLED — enable it first
        cy.intercept("PATCH", "**/users/**/enable").as("enableUser");
        cy.contains("[role='menuitem']", /enable/i).click();
        cy.wait("@enableUser").its("response.statusCode").should("be.oneOf", [200, 201]);
        cy.contains("User account re-enabled.", { timeout: 6000 }).should("exist");

        // Then disable
        cy.get("div[role='dialog']")
          .contains("button", /edit profile/i, { timeout: 6000 })
          .should("exist");
        cy.get('div[role="dialog"]').within(() => {
          cy.get('[data-testid="user-actions-trigger"]').click();
        });
        cy.intercept("PATCH", "**/users/**/disable").as("disableUser");
        cy.get('[role="menuitem"]').contains(/disable/i).click();
        cy.wait("@disableUser").its("response.statusCode").should("be.oneOf", [200, 201]);
        cy.contains("User account disabled.", { timeout: 6000 }).should("exist");

        // Re-enable to restore state
        cy.get("div[role='dialog']")
          .contains("button", /edit profile/i, { timeout: 6000 })
          .should("exist");
        cy.get('div[role="dialog"]').within(() => {
          cy.get('[data-testid="user-actions-trigger"]').click();
        });
        cy.intercept("PATCH", "**/users/**/enable").as("enableUser2");
        cy.get('[role="menuitem"]').contains(/enable/i).click();
        cy.wait("@enableUser2").its("response.statusCode").should("be.oneOf", [200, 201]);
        cy.contains("User account re-enabled.", { timeout: 6000 }).should("exist");
      }
    });

    // ── 7. Click "Edit Profile" button ───────────────────────
    cy.get("div[role='dialog']")
      .contains("button", /edit profile/i, { timeout: 6000 })
      .click();

    // ── 8. Edit mode: clear and type new name ────────────────
    cy.get("input#edit-fullName", { timeout: 5000 }).should("be.visible").clear().type("Test User Updated");

    // ── 9. Save changes ──────────────────────────────────────
    cy.intercept("PATCH", /\/users\/[^/]+$/).as("updateUser");
    cy.get("div[role='dialog'] form button[type='submit']").click();
    cy.wait("@updateUser").its("response.statusCode").should("be.oneOf", [200, 201]);

    // ── 10. Success toast and edit mode closed ───────────────
    cy.contains("User profile updated successfully.", { timeout: 6000 }).should("exist");
    cy.get("input#edit-fullName").should("not.exist");
  });
});

// ─────────────────────────────────────────────────────────────
// Workflow 2 — Register a brand new user
// ─────────────────────────────────────────────────────────────
describe("User Management — Workflow 2: Register New User", () => {
  beforeEach(() => {
    adminLogin();
    cy.visit("/en/users");
    cy.wait(2000);
  });

  it("should open the Register New User dialog and create a passenger account", () => {
    // ── 1. Click "Register" button in the header ─────────────
    cy.contains("button", /register/i).click();

    // ── 2. Dialog opens ──────────────────────────────────────
    cy.get("div[role='dialog']").should("be.visible");

    // Set up intercept for user creation
    cy.intercept("POST", "**/users").as("createUser");

    // Generate unique test data to avoid duplicate conflicts on repeated runs
    // Phone must match +251[79]\d{8} = 13 chars: "+2519" (5) + 8 digits
    const ts = Date.now().toString().slice(-8);
    const uniquePhone = '+2519' + ts;
    const uniqueFid = 'CY-TEST-' + ts;

    // Fill the form fields with correct IDs
    cy.get('input#cu-fullName').should('be.visible').type('Cypress Test User');
    cy.get('input#cu-phone').should('be.visible').type(uniquePhone);
    // Role defaults to PASSENGER ("Passenger") — no need to change it
    cy.get('input#cu-password').should('be.visible').type('TestPass123!');
    // FID is required for PASSENGER accounts
    cy.get('input#cu-fid').should('be.visible').type(uniqueFid);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for createUser request
    cy.wait("@createUser").its("response.statusCode").should("be.oneOf", [200, 201]);

    // ── 5. Dialog closes and toast appears ───────────────────
    cy.get("div[role='dialog']").should("not.exist");
    cy.contains("User created successfully.", { timeout: 6000 }).should("exist");

    // ── 6. New user appears in the table ────────────────────
    cy.contains("Cypress Test User", { timeout: 6000 }).should("exist");
  });
});
