class UserRegistrationPage {
  visit() {
    cy.visit(`/customer/account/create/`);
  }
  getRegistrationFormTitle() {
    return cy.get('[data-ui-id="page-title-wrapper"]');
  }
  getFirstNameField() {
    return cy.get("#firstname");
  }

  getLastNameField() {
    return cy.get("#lastname");
  }

  getEmailField() {
    return cy.get("#email_address");
  }

  getPasswordField() {
    return cy.get("#password");
  }

  getPasswordStrength() {
    return cy.get("#password-strength-meter").invoke("text");
  }

  getPasswordConfirmationField() {
    return cy.get("#password-confirmation");
  }

  getSubmitButton() {
    return cy.get('button.action.submit.primary[title="Create an Account"]');
  }
}
export default UserRegistrationPage;
