class UserAccountDetailsPage {
  getUserAccountDetailsPage() {
    cy.visit(`/customer/account/`);
  }
  getPageTitle() {
    return cy.get("h1.page-title");
  }

  getContactInformation() {
    return cy.get("div.box-content");
  }

  getChangePasswordLink() {
    return cy.get("a.change-password");
  }
}

export default UserAccountDetailsPage;
