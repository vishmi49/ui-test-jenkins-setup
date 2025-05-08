import CheckoutWizardPage from "../../../pages/checkout-wizard/checkout-wizard-page";
import ShoppingCartPage from "../../../pages/shoping-cart/shopping-cart-page";

describe("Checkout Wizard", () => {
  const shoppingCartPage = new ShoppingCartPage();
  const checkoutWizardPage = new CheckoutWizardPage();

  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("should syuccessfully complete the checkout process - new user", () => {
    const streetAddress = "1st Lane, Colombo";
    const city = "Colombo";
    const country = "Sri Lanka";
    const zipCode = "10100";
    const phoneNumber = "0771234567";

    cy.userRegister();
    cy.addProductToCart();
    shoppingCartPage.visitCartPage();
    shoppingCartPage.getPageTitle().should("contain", "Shopping Cart");
    shoppingCartPage.getOrderTotal().should("be.visible");
    shoppingCartPage
      .getProceedToCheckoutButton()
      .should("be.visible")
      .click({ force: true }, { timeout: 30000 });
    cy.url().should("include", "/checkout/#shipping");
    checkoutWizardPage
      .getShippingPageTitle()
      .should("contain", "Shipping Address");
    checkoutWizardPage.getStreetAddressInput().type(streetAddress);
    checkoutWizardPage.getCityInput().type(city);
    checkoutWizardPage.getCountrySelect().select(country);
    checkoutWizardPage.getPostcodeInput().type(zipCode);
    checkoutWizardPage.getPhoneNumberInput().type(phoneNumber);
    checkoutWizardPage.getPaymentMethod().check();
    checkoutWizardPage.getPaymentMethod().should("be.checked");
    checkoutWizardPage.getNextButton().click();
    cy.url().should("include", "/checkout/#payment");
    checkoutWizardPage
      .getPaymentMethodTitle()
      .should("contain", "Payment Method");
    checkoutWizardPage.getPlaceOrderButton().click();
    cy.url().should("include", "/checkout/onepage/success/");
    checkoutWizardPage
      .getOrderSuccessPageTitle()
      .should("contain", "Thank you for your purchase!");
  });

  it("should syuccessfully complete the checkout process - existing user", () => {
    const email = "mary.jane@gmail.com";
    const password = "User123@+";
    const fullName = "Mary Jane";

    cy.login(email, password, fullName);
    cy.addProductToCart();
    shoppingCartPage.visitCartPage();
    shoppingCartPage.getPageTitle().should("contain", "Shopping Cart");
    shoppingCartPage.getOrderTotal().should("be.visible");
    shoppingCartPage
      .getProceedToCheckoutButton()
      .should("be.visible")
      .click({ force: true }, { timeout: 30000 });
    cy.url().should("include", "/checkout/#shipping");
    checkoutWizardPage
      .getShippingPageTitle()
      .should("contain", "Shipping Address");
    checkoutWizardPage.getShippingAddressBox().should("be.visible");
    checkoutWizardPage.getPaymentMethod().check();
    checkoutWizardPage.getPaymentMethod().should("be.checked");
    checkoutWizardPage.getNextButton().click();
    cy.url().should("include", "/checkout/#payment");
    checkoutWizardPage
      .getPaymentMethodTitle()
      .should("contain", "Payment Method");
    checkoutWizardPage.getPlaceOrderButton().click();
    cy.url().should("include", "/checkout/onepage/success/");
    checkoutWizardPage
      .getOrderSuccessPageTitle()
      .should("contain", "Thank you for your purchase!");
  });
});
