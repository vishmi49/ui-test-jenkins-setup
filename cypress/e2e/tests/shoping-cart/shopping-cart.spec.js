import ProductDetailsPage from "../../../pages/products/product-details-page";
import ShoppingCartPage from "../../../pages/shoping-cart/shopping-cart-page";
import SingleProductDetailsPage from "../../../pages/products/single-product-details-page";
import EditShoppingCartPage from "../../../pages/shoping-cart/edit-shopping-cart-page";

describe("Shopping Cart", () => {
  const productDetailsPage = new ProductDetailsPage();
  const shoppingCartPage = new ShoppingCartPage();
  const singleProductDetailsPage = new SingleProductDetailsPage();
  const editShoppingCartPage = new EditShoppingCartPage();

  const email = "mary.jane@gmail.com";
  const password = "User123@+";
  const fullName = "Mary Jane";

  beforeEach(() => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.login(email, password, fullName);
  });

  afterEach(() => {
    cy.clearCart();
    cy.logout();
  });

  it("Should add a product to the cart", () => {
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

  it("Should update the shopping cart successfully", () => {
    cy.addProductToCart();
    shoppingCartPage.visitCartPage();
    shoppingCartPage.getPageTitle().should("contain", "Shopping Cart");
    cy.wait(5000);
    cy.intercept({
      method: "GET",
      url: "**/product_id/**",
    }).as("getProduct");
    shoppingCartPage.getEditIcon().click();
    cy.wait("@getProduct");
    editShoppingCartPage.getProductSizeMedium().click();
    editShoppingCartPage
      .getProductSizeMedium()
      .should("have.attr", "aria-checked", "true");
    cy.intercept({
      method: "GET",
      url: "/checkout/cart/",
    }).as("updateProduct");
    editShoppingCartPage.getUpdateCartButton().click({ force: true });
    cy.wait("@updateProduct");
    shoppingCartPage.getItemSize().should("contain", "M");
  });

  it("should update the total price successfully", () => {
    const quantity = 2;

    cy.addProductToCart();
    shoppingCartPage.visitCartPage();
    shoppingCartPage.getPageTitle().should("contain", "Shopping Cart");
    shoppingCartPage.getCartItemQuantityInput().clear().type("2");
    shoppingCartPage.getCartItemQuantityInput().should("have.value", quantity);
    shoppingCartPage.getUpdateShoppingCartButton().click();

    shoppingCartPage
      .getSingleProductPrice()
      .invoke("text")
      .then((priceText) => {
        const singlePrice = parseFloat(priceText.replace("$", ""));

        const expectedSubtotal = singlePrice * quantity;

        shoppingCartPage
          .getCartSubtotal()
          .invoke("text")
          .then((subtotalText) => {
            const actualSubtotal = parseFloat(subtotalText.replace("$", ""));

            expect(actualSubtotal).to.eq(expectedSubtotal);
          });
      });
  });
});
