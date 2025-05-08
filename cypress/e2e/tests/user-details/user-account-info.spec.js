import UserAccountDetailsPage from "../../../pages/user-details/user-account-details-page";
import EditAccountInfoPage from "../../../pages/user-details/edit-account-page";
import UserLoginPage from "../../../pages/user-registration/user-login-page";

describe("User Account Info", () => {
  const userAccountDetailsPage = new UserAccountDetailsPage();
  const editAccountInfoPage = new EditAccountInfoPage();
  const userLoginPage = new UserLoginPage();

  const email = "mary.jane@gmail.com";
  const password = "User123@+";
  const fullName = "Mary Jane";

  beforeEach(() => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.login(email, password, fullName);
  });

  it("should display user account info", () => {
    userAccountDetailsPage.getUserAccountDetailsPage();
    userAccountDetailsPage.getPageTitle().should("contain", "My Account");
    userAccountDetailsPage.getContactInformation().should("contain", fullName);
    userAccountDetailsPage.getContactInformation().should("contain", email);
    cy.logout();
  });

  it("should change password successfully", () => {
    const newPassword = "User123@+";
    const confirmPassword = "User123@+";

    userAccountDetailsPage.getUserAccountDetailsPage();
    cy.intercept("GET", "/customer/account/edit/**").as("editAccount");
    userAccountDetailsPage.getChangePasswordLink().click();
    cy.wait("@editAccount");
    editAccountInfoPage
      .getPageTitle()
      .should("contain", "Edit Account Information");

    editAccountInfoPage.getCurrentPasswordInput().type(password);
    editAccountInfoPage.getNewPasswordInput().type(newPassword);
    editAccountInfoPage.getPasswrodStrengthLable().should("contain", "Strong");
    editAccountInfoPage.getConfirmPasswordInput().type(confirmPassword);
    editAccountInfoPage.getSaveButton().click();
    cy.url().should("include", "/customer/account/login/");
  });
});
