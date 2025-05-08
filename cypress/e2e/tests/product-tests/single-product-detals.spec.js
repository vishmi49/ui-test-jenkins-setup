import ProductDetailsPage from "../../../pages/products/product-details-page";
import SingleProductDetailsPage from "../../../pages/products/single-product-details-page";
import ShoppingCartPage from "../../../pages/shoping-cart/shopping-cart-page";

describe("Single product details test", () => {
  const singleProductDetailsPage = new SingleProductDetailsPage();
  const productDetailsPage = new ProductDetailsPage();
  const shoppingCartPage = new ShoppingCartPage();

  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  const email = "mary.jane@gmail.com";
  const password = "User123@+";
  const fullName = "Mary Jane";

  before(function () {
    cy.login(email, password, fullName);
  });

  it("Should navigate to product details upon clicking on the product", () => {
    productDetailsPage.visit();
    productDetailsPage.getPageTitle().should("contain", "Jackets");
    productDetailsPage.getProductItem().first().trigger("mouseover");
    productDetailsPage
      .getProductTitle()
      .should("contain", "Olivia 1/4 Zip Light Jacket");
    productDetailsPage.getProductItem().first().click();

    singleProductDetailsPage
      .getProductTitle()
      .should("contain", "Olivia 1/4 Zip Light Jacket");
  });

  it("should not be able to add items without selecting size and color", () => {
    cy.selectProduct();
    singleProductDetailsPage.getAddToCartButton().click();
    singleProductDetailsPage
      .getColorRequiredErrorMessage()
      .should("contain", "This is a required field.");
    singleProductDetailsPage
      .getSizeRequiredErrorMessage()
      .should("contain", "This is a required field.");
  });

  it("should be able to update the quantity of the product", () => {
    cy.selectProduct();
    singleProductDetailsPage
      .getProductSize()
      .trigger("mouseover")
      .click()
      .should("have.attr", "aria-checked", "true");
    singleProductDetailsPage
      .getProductColor()
      .trigger("mouseover")
      .click()
      .should("have.attr", "aria-checked", "true");
    singleProductDetailsPage
      .getProductQuantity()
      .clear()
      .type("2")
      .should("have.value", "2");
    singleProductDetailsPage.getAddToCartButton().click();
    shoppingCartPage.getCartItemCount().should("have.text", "2");

    cy.clearCart();
  });
});
