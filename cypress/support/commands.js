// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import UserLoginPage from "../pages/user-registration/user-login-page";
import UserRegistrationPage from "../pages/user-registration/user-registration-page";
import UserAccountPage from "../pages/user-registration/user-account-page";
import ProductDetailsPage from "../pages/products/product-details-page";
import ShoppingCartPage from "../pages/shoping-cart/shopping-cart-page";
import CheckoutWizardPage from "../pages/checkout-wizard/checkout-wizard-page";
import Utils from "./utils";

const userLoginPage = new UserLoginPage();
const userAccountPage = new UserAccountPage();
const productDetailsPage = new ProductDetailsPage();
const shoppingCartPage = new ShoppingCartPage();
const userRegistrationPage = new UserRegistrationPage();
const checkoutWizardPage = new CheckoutWizardPage();

Cypress.Commands.add("login", (email, password, fullName) => {
  userLoginPage.visit();
  cy.url().should("include", "/customer/account/login/");

  userLoginPage.getEmailField().type(email);
  userLoginPage.getPasswordField().type(password);
  cy.intercept("GET", "/customer/account").as("getAccount");
  userLoginPage.getSignInButton().click();

  cy.wait("@getAccount");

  cy.url().should("include", "/customer/account/");
  userAccountPage
    .getWelcomeMessage()
    .should("contain", `Welcome, ${fullName}!`);
});

Cypress.Commands.add("userRegister", () => {
  const generatedFirstName = Utils.getRandomFirstName();
  const generatedLastName = Utils.getRandomLastName();
  const generatedEmail = Utils.generateEmail();
  const password = "User123@+";

  const userAccountPage = new UserAccountPage();

  userRegistrationPage.visit();
  cy.url().should("include", "/customer/account/create/");

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

  userAccountPage.getWelcomeMessage().should("exist");
  userAccountPage
    .getWelcomeMessage()
    .should("contain", `Welcome, ${generatedFirstName} ${generatedLastName}!`);
});

Cypress.Commands.add("addProductToCart", () => {
  productDetailsPage.visit();
  productDetailsPage.getPageTitle().should("contain", "Jackets");

  productDetailsPage.getProductItem().first().trigger("mouseover");
  productDetailsPage
    .getProductTitle()
    .should("contain", "Olivia 1/4 Zip Light Jacket");

  productDetailsPage
    .getProductSize()
    .trigger("mouseover")
    .click()
    .should("have.attr", "aria-checked", "true");
  productDetailsPage
    .getProductColor()
    .click()
    .should("have.attr", "aria-checked", "true");
  productDetailsPage.getAddToCartButton().click({ force: true });
  shoppingCartPage.getCartItemCount().should("have.text", "1");
});

Cypress.Commands.add("clearCart", () => {
  shoppingCartPage.visitCartPage();
  cy.url().should("include", "/checkout/cart/");
  shoppingCartPage.getPageTitle().should("contain", "Shopping Cart");
  cy.wait(5000);
  shoppingCartPage.getDeleteIcon().should("exist").trigger("click");

  shoppingCartPage
    .getEmptyCartMessage()
    .should("be.visible")
    .and("contain", "You have no items in your shopping cart.");
});

Cypress.Commands.add("logout", () => {
  userLoginPage
    .getCustomerMenuToggle()
    .filter(":visible")
    .click({ force: true });
  userLoginPage.getSignOutButton().click({ force: true });
  userLoginPage.getSignedOutTitle().should("have.text", "You are signed out");
});

Cypress.Commands.add("selectProduct", () => {
  productDetailsPage.visit();
  productDetailsPage.getPageTitle().should("contain", "Jackets");
  productDetailsPage.getProductItem().first().trigger("mouseover");
  productDetailsPage
    .getProductTitle()
    .should("contain", "Olivia 1/4 Zip Light Jacket");
  productDetailsPage.getProductItem().first().click();
  cy.url().should("include", "/olivia-1-4-zip-light-jacket");
});

Cypress.Commands.add("placeOrder", () => {
  const streetAddress = "1st Lane, Colombo";
  const city = "Colombo";
  const country = "Sri Lanka";
  const zipCode = "10100";
  const phoneNumber = "0771234567";

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
