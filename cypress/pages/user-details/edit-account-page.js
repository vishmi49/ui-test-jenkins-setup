class EditAccountInfoPage {
  getEditAccountPage() {
    cy.visit(`/customer/account/edit/`);
  }
  getPageTitle() {
    return cy.get("h1.page-title");
  }

  getCurrentPasswordInput() {
    return cy.get("#current-password");
  }

  getNewPasswordInput() {
    return cy.get("#password");
  }
  getPasswrodStrengthLable() {
    return cy.get("#password-strength-meter-label").invoke("text");
  }

  getConfirmPasswordInput() {
    return cy.get("#password-confirmation");
  }
  getSaveButton() {
    return cy.get('button.action.save.primary[title="Save"]');
  }
}

export default EditAccountInfoPage;
