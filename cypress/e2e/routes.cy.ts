Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test on unhandled exceptions
  return false;
});

describe("Routes Management E2E Workflow", () => {
  beforeEach(() => {
    // 1. Admin logs in
    cy.visit("/en/login");
    cy.get("button[type='submit']").should("not.be.disabled");
    cy.wait(1000); // Give Next.js time to hydrate

    // Intercept login request
    cy.intercept("POST", "**/auth/login").as("loginRequest");

    // Enter credentials
    cy.get("#identifier").clear().type("0900000000");
    cy.get("#password").clear().type("Admin123!");
    cy.get("button[type='submit']").click({ force: true });

    // Verify login success
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 201);
    cy.url({ timeout: 10000 }).should("not.include", "/login");
  });

  it("should complete the full route lifecycle: create, view, edit metadata, stops, and fares", () => {
    // 2. Navigate to Routes page
    cy.visit("/en/routes");
    cy.wait(2000); // wait for routes to load

    // Generate unique route details to prevent conflict
    const ts = Date.now().toString().slice(-6);
    const routeNum = `CY-R-${ts}`;
    const routeNameEn = `Cypress Route En ${ts}`;
    const routeNameAm = `ሳይፕረስ መስመር ${ts}`;

    // 3. Click the "Create Route" button
    cy.contains("button", "Create Route").should("be.visible").click({ force: true });

    // Verify Create Route dialog opens
    cy.get("div[role='dialog']").should("be.visible");

    // ─── Step 1: General Info ───
    cy.get("div[role='dialog']").within(() => {
      cy.get("input#routeNumber").type(routeNum);
      cy.get("input#routeNameEn").type(routeNameEn);
      cy.get("input#routeNameAm").type(routeNameAm);
      cy.get("textarea#descriptionEn").type("Cypress Route description English");
      cy.get("textarea#descriptionAm").type("ሳይፕረስ መስመር ማብራሪያ");
      cy.get("input#duration").clear().type("45");
      cy.get("input#distance").clear().type("12"); // Must be an integer to satisfy backend
      cy.get("input#baseFare").clear().type("30");

      // Click "Next"
      cy.contains("button", "Next").click({ force: true });
    });

    // ─── Step 2: Define Stops ───
    cy.get("div[role='dialog']").within(() => {
      // Fill Stop 1 (which exists by default)
      cy.get('input[placeholder="e.g. Piazza"]').eq(0).type("Piazza Cy Start");
      cy.get('input[placeholder="e.g. ፒያሳ"]').eq(0).type("ፒያሳ ሳይፕረስ መጀመሪያ");
      cy.get('input[type="number"][step="0.000001"]').eq(0).clear().type("9.0123");
      cy.get('input[type="number"][step="0.000001"]').eq(1).clear().type("38.7567");

      // Add Stop 2
      cy.contains("button", "Add Stop").click({ force: true });

      // Fill Stop 2 details
      cy.get('input[placeholder="e.g. Piazza"]').eq(1).type("Bole Cy End");
      cy.get('input[placeholder="e.g. ፒያሳ"]').eq(1).type("ቦሌ ሳይፕረስ መጨረሻ");
      cy.get('input[type="number"][step="0.000001"]').eq(2).clear().type("9.0234");
      cy.get('input[type="number"][step="0.000001"]').eq(3).clear().type("38.7678");

      // Click "Next"
      cy.contains("button", "Next").click({ force: true });
    });

    // ─── Step 3: Fares & Segments ───
    cy.get("div[role='dialog']").within(() => {
      // Verify we are on Step 3
      cy.contains("Customize Stop-to-Stop Fares").should("be.visible");
    });

    // Intercept creation POST request
    cy.intercept("POST", "**/routes").as("createRoute");

    // Click "Create Route" inside dialog
    cy.get("div[role='dialog']").contains("button", "Create Route").click({ force: true });

    // Wait for route creation to complete
    cy.wait("@createRoute").its("response.statusCode").should("be.oneOf", [200, 201]);

    // Dialog should close, and we should be back on the directory table
    cy.get("div[role='dialog']").should("not.exist");
    cy.wait(1500); // Wait for table refresh

    // 4. Locate the newly created route at the top of the table and open details
    // We sort/filter or locate it by route number `routeNum` in the first table row
    cy.get("table tbody tr").first().within(() => {
      cy.contains(routeNum).should("exist");
      cy.get("button").click({ force: true }); // Click the "Eye" icon to view details
    });

    // Verify Route Detail dialog opens
    cy.get("div[role='dialog']").should("be.visible");
    cy.contains(routeNameEn).should("be.visible");

    // ─── Edit Metadata ───
    cy.get("div[role='dialog']").within(() => {
      cy.contains("button", "Edit").click({ force: true });

      // Edit English name and description
      const editedName = `${routeNameEn} Edited`;
      cy.get("input").eq(0).clear().type(editedName); // The first input in edit mode is the route name
      cy.get("textarea").clear().type("Cypress Route description English Edited");
    });

    // Intercept update API call
    cy.intercept("PATCH", "**/routes/*").as("updateRoute");

    // Save changes
    cy.get("div[role='dialog']").contains("button", "Save Changes").click({ force: true });

    // Wait for update
    cy.wait("@updateRoute").its("response.statusCode").should("be.oneOf", [200, 204]);

    // Verify edited name is visible in details header
    const finalEditedName = `${routeNameEn} Edited`;
    cy.get("div[role='dialog']").contains(finalEditedName).should("be.visible");

    // ─── Edit Fares (must be done before Edit Stops, since Edit Stops deletes existing fares) ───
    cy.get("div[role='dialog']").contains("button", "Edit Fares").click({ force: true });

    // Update the fare amount (the first fare input field)
    cy.get("div[role='dialog']").within(() => {
      cy.get('input[type="number"]').first().clear().type("35");
    });

    // Intercept fares update API call (PUT)
    cy.intercept("PUT", "**/routes/*/fares").as("updateFares");

    // Save fares
    cy.get("div[role='dialog']").contains("button", "Save Fares").click({ force: true });

    // Wait for update
    cy.wait("@updateFares").its("response.statusCode").should("be.oneOf", [200, 204]);

    // Verify updated fare amount is shown in the timeline (which has a label like "ETB 35.00")
    cy.get("div[role='dialog']").contains("ETB 35.00").should("be.visible");

    // ─── Edit Stops ───
    cy.get("div[role='dialog']").contains("button", "Edit Stops").click({ force: true });

    // Edit first stop name
    const editedStopName = "Piazza Cy Start Edited";
    cy.get("div[role='dialog']").within(() => {
      cy.get('input[placeholder="Enter stop name"]').eq(0).clear().type(editedStopName);
    });

    // Intercept stops update API call (PUT)
    cy.intercept("PUT", "**/routes/*/stops").as("updateStops");

    // Save stops
    cy.get("div[role='dialog']").contains("button", "Save Stops").click({ force: true });

    // Wait for update
    cy.wait("@updateStops").its("response.statusCode").should("be.oneOf", [200, 204]);

    // Verify updated stop name is displayed in the stops timeline list
    cy.get("div[role='dialog']").contains(editedStopName).should("be.visible");

    // Close the dialog using Escape key on body
    cy.get("body").type("{esc}", { force: true });
  });
});
