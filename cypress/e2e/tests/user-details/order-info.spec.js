import OrderDetailsPage from "../../../pages/user-details/order-details-page";
import CheckoutWizardPage from "../../../pages/checkout-wizard/checkout-wizard-page";

describe("Order Details Page", () => {
  const orderDetailsPage = new OrderDetailsPage();
  const checkoutWizardPage = new CheckoutWizardPage();

  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("Should be able to view the order history", () => {
    cy.userRegister();
    cy.placeOrder();
    checkoutWizardPage.getOrderNumber().then(($orderNumber) => {
      const orderNumberText = $orderNumber.text().trim();
      cy.log("Order Number:", orderNumberText);
      orderDetailsPage.visitOrderDetailsPage();
      cy.url().should("include", "/sales/order/history/");
      orderDetailsPage.getPageTitle().should("contain", "My Orders");
      orderDetailsPage.getOrderId().should("contain", orderNumberText);

      cy.logout();
    });
  });
});
