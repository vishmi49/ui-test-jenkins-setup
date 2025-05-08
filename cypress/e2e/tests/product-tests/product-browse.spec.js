import ProductsMenuPage from "../../../pages/products/products-menu-page";
import ProductDetailsPage from "../../../pages/products/product-details-page";
import { should } from "chai";

describe("Product Details Page", () => {
  const productsMenuPage = new ProductsMenuPage();
  const productDetailsPage = new ProductDetailsPage();

  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  it("Should navigate to the home page upon clicking the logo", () => {
    productsMenuPage.visit();
    cy.url().should("include", "/");
    productDetailsPage.getLogo().click();
    productDetailsPage.getHomePageTitle().should("contain", "Home Page");
  });

  it("Should navigate to the sub menu pages", () => {
    productsMenuPage.visit();
    cy.url().should("include", "/");
    productsMenuPage.getWomenMenu().trigger("mouseover");
    productsMenuPage.getTopsMenu().trigger("mouseover");
    productsMenuPage.getJacketsMenu().click();

    productDetailsPage.getPageTitle().should("contain", "Jackets");
  });

  it("Should filter products by price", () => {
    productDetailsPage.visit();
    productDetailsPage.getPageTitle().should("contain", "Jackets");
    productDetailsPage.getPriceFilter();
    productDetailsPage.getPriceRange().click({ force: true });
    cy.url().should("include", "price");

    productDetailsPage.getNumberOfProductItems().then(($productItems) => {
      const productCount = $productItems.length;
      cy.log("Product Count:", productCount);
      expect(productCount).to.equal(1);
    });

    productDetailsPage.getProductAmount().then(($priceElement) => {
      const productPrice = $priceElement.text().trim();
      productDetailsPage.getProductPrice().should("contain", productPrice);
    });
  });

  it("should sort products by product name", () => {
    productDetailsPage.visit();
    productDetailsPage.getPageTitle().should("contain", "Jackets");
    productDetailsPage.getSortByDropdown().select("Product Name");
    cy.wait(10000);

    const titlesArray = [];

    productDetailsPage
      .getAllProductTitles()
      .each(($el, index) => {
        titlesArray[index] = $el.text().trim();
      })
      .then(() => {
        const sortedTitles = [...titlesArray].sort();
        expect(titlesArray).to.deep.equal(sortedTitles);
      });
  });

  it("should filter prodcuts using search bar", () => {
    const productName = "Nadia Elements Shell";
    productDetailsPage.visit();
    productDetailsPage.getPageTitle().should("contain", "Jackets");
    productDetailsPage.getSearchBox().type(`${productName}{enter}`);

    productDetailsPage.getProductItem().should("contain", productName);
  });

  it("should be able to navigate to pages using pagination", () => {
    productDetailsPage.getWomenTopsPage();
    productDetailsPage.getPageTitle().should("contain", "Tops");
    cy.scrollTo("bottom");
    productDetailsPage.getCurrentPage().should("contain", "1");
    productDetailsPage.getNextPage().contains("2").click({ force: true });
    productDetailsPage.getCurrentPage().should("contain", "2");
  });
});
