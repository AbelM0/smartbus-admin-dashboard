Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test on unhandled exceptions (like JSDOM errors or minor 3rd party script errors)
  return false;
});

describe("Trips Workflow", () => {
  beforeEach(() => {
    // 1. Admin logs in
    cy.visit("/en/login");
    cy.get("button[type='submit']").should('not.be.disabled');
    cy.wait(1000); // Give Next.js time to hydrate

    // Intercept login request
    cy.intercept("POST", "**/auth/login").as("loginRequest");

    // Enter credentials safely
    cy.get("#identifier").clear().type("0900000000");
    cy.get("#password").clear().type("Admin123!");
    cy.get("button[type='submit']").click();

    // Verify login success — the API returns 201 on successful auth
    cy.wait("@loginRequest").its('response.statusCode').should('eq', 201);
    cy.url({ timeout: 10000 }).should("not.include", "/login");
  });

  it("should create a trip with AI driver suggestion and appear in the table", () => {
    // 2. Go to trips tab
    cy.visit("/en/trips");
    cy.wait(2000); // wait for trips to load
    
    // 3. Click "Schedule Trip" button
    cy.get("svg.lucide-plus").parent("button").click();

    // Verify dialog opens
    cy.get("div[role='dialog']").should("be.visible");

    // Wait a brief moment for the routes and drivers to load from API
    cy.wait(1500);

    // 4. Select the route (grab the first valid option)
    cy.get("select#routeId").find("option").not('[disabled]').first().then(option => {
      cy.get("select#routeId").select(option.val() as string);
    });

    // 5. Select a date (tomorrow at noon)
    let dayOffset = 1;
    const pickDate = (offset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      date.setHours(12, 0, 0, 0);
      return date.toISOString().slice(0, 16);
    };

    cy.get("input#scheduledFor").type(pickDate(dayOffset));

    // 6. Use the AI driver recommendation feature first before manually selecting
    cy.get("svg.lucide-sparkles").parent("button").click();
    
    // Wait for the AI recommendations API to return suggestions
    cy.wait(2000);

    // 7. Manually select a driver from the standard dropdown
    cy.get("select#driverId").find("option").not('[disabled]').first().then(option => {
      cy.get("select#driverId").select(option.val() as string);
    });

    // 8. Enter a random bus identifier (persist it as an alias so we can check later)
    const randomBusId = `BUS-${Math.floor(Math.random() * 90000) + 10000}`;
    cy.get("input#busIdentifier").type(randomBusId);

    // 9. Intercept trip creation and handle scheduling conflicts (HTTP 409)
    //    Strategy: if the selected driver is already scheduled, advance the date by 1 day and retry
    cy.intercept("POST", "**/trips").as("createTrip");

    // First submission attempt
    cy.get("div[role='dialog'] form button[type='submit']").click();

    cy.wait("@createTrip").then(interception => {
      if (interception.response?.statusCode === 409) {
        // ── Conflict: driver already scheduled ──
        // The toast "Driver already has a trip scheduled on this day." is shown.
        // Verify the error toast is visible so the tester knows why we're retrying.
        cy.contains("Driver already has a trip scheduled on this day.", { timeout: 5000 })
          .should("exist");

        // The dialog stays open — advance the date by one more day and retry
        dayOffset += 1;
        cy.get("input#scheduledFor").clear().type(pickDate(dayOffset));

        // Re-intercept for the retry submission
        cy.intercept("POST", "**/trips").as("createTripRetry");
        cy.get("div[role='dialog'] form button[type='submit']").click();

        cy.wait("@createTripRetry").its("response.statusCode").should("be.oneOf", [200, 201]);
      } else {
        // No conflict — first attempt was successful (200 or 201)
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
      }
    });

    // 10. Dialog should close after successful creation
    cy.get("div[role='dialog']").should("not.exist");

    // 11. Wait for the trips table to refetch and verify the new trip is present
    cy.wait(2000);
    cy.get("table").should("contain.text", randomBusId);
  });
});
