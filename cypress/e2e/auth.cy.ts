Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

describe("Authentication Flow", () => {
  beforeEach(() => {
    // Visit localized login page
    cy.visit("/en/login");
    cy.get("button[type='submit']").should('not.be.disabled');
    cy.wait(1000); // Give Next.js time to hydrate
  });

  it("should display login form elements correctly", () => {
    // Check main title and description are visible
    cy.get("h2").should("exist");
    
    // Check identifiers
    cy.get("label[for='identifier']").should("exist");
    cy.get("#identifier").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.get("button[type='submit']").should("exist");
  });

  it("should trigger validation errors on empty submission", () => {
    // Click submit without entering credentials
    cy.get("button[type='submit']").click();


    cy.get("#identifier").should("have.class", "border-red-400");
    cy.get("#password").should("have.class", "border-red-400");
  });

  it("should allow entering login credentials", () => {
    // Type credentials and assert on separate lines to avoid detached from DOM issues
    cy.get("#identifier").type("+251911234567");
    cy.get("#identifier").should("have.value", "+251911234567");
      
    cy.get("#password").type("12345678");
    cy.get("#password").should("have.value", "12345678");
  });

  it("should login and display the dashboard when entering correct credentials", () => {
    cy.get("#identifier").type("0900000000");
    cy.get("#password").type("Admin123!");
    cy.get("button[type='submit']").click();

    // After login, the application redirects to the dashboard
    cy.url().should("not.include", "/login");
    // Verify an element from the dashboard exists
    cy.contains(/dashboard/i).should("exist");
  });
});
