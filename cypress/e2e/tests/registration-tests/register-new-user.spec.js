import Utils from "../../../support/utils";
import UserRegistrationPage from "../../../pages/user-registration/user-registration-page";
import UserAccountPage from "../../../pages/user-registration/user-account-page";

describe("Register new user", () => {
  const generatedFirstName = Utils.getRandomFirstName();
  const generatedLastName = Utils.getRandomLastName();
  const generatedEmail = Utils.generateEmail();
  const password = "User123@+";

  it("should register a new user", () => {
    const userRegistrationPage = new UserRegistrationPage();

    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    userRegistrationPage.visit();
    cy.url().should("include", "/customer/account/create/");
    const userAccountPage = new UserAccountPage();

    userRegistrationPage
      .getRegistrationFormTitle()
      .should("have.text", "Create New Customer Account");

    userRegistrationPage.getFirstNameField().type(generatedFirstName);
    userRegistrationPage.getLastNameField().type(generatedLastName);
    userRegistrationPage.getEmailField().type(generatedEmail);
    userRegistrationPage.getPasswordField().type(password);

    userRegistrationPage;
    cy.get('[data-role="password-strength-meter-label"]')
      .invoke("text")
      .then((strength) => {
        cy.log("Password Strength:", strength.trim());

        expect(strength.trim()).to.equal("Strong");
      });
    userRegistrationPage.getPasswordConfirmationField().type(password);
    cy.intercept("GET", "/customer/account").as("getAccount");
    userRegistrationPage.getSubmitButton().click();

    cy.wait("@getAccount");

    userAccountPage
      .getWelcomeMessage()
      .should(
        "contain",
        `Welcome, ${generatedFirstName} ${generatedLastName}!`
      );
  });
});
