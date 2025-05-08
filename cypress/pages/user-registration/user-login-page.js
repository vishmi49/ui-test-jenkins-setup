class UserLoginPage {
  visit() {
    cy.visit(`/customer/account/login/`);
  }
  getLoginPageTitle() {
    return cy.get('[data-ui-id="page-title-wrapper"]');
  }
  getEmailField() {
    return cy.get("#email");
  }
  getPasswordField() {
    return cy.get("#pass");
  }

  getSignInButton() {
    return cy.get("#send2");
  }

  getCustomerMenuToggle() {
    return cy.get('button.action.switch[data-action="customer-menu-toggle"]');
  }
  getSignOutButton() {
    return cy.get("li.authorization-link a").contains("Sign Out");
  }

  getSignedOutTitle() {
    return cy.get('span.base[data-ui-id="page-title-wrapper"]');
  }
  getSuccessMessage() {
    return cy.get("#message-success");
  }
  getErrorMessage() {
    return cy.get("div.message-error > div");
  }
}

export default UserLoginPage;
