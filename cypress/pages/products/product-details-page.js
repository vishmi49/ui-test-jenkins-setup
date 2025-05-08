class ProductDetailsPage {
  visit() {
    cy.visit(`/women/tops-women/jackets-women.html`);
  }

  getWomenTopsPage() {
    cy.visit(`/women/tops-women.html`);
  }

  getHomePageTitle() {
    return cy.get("h1.page-title");
  }
  getPageTitle() {
    return cy.get("#page-title-heading");
  }

  getLogo() {
    return cy.get("a.logo");
  }

  getPriceFilter() {
    return cy.get("div.filter-options-title").contains("Price");
  }

  getPriceRange() {
    return cy
      .contains("div.filter-options-title", "Price")
      .parent()
      .find("div.filter-options-content ol.items > li")
      .first();
  }

  getProductAmount() {
    return cy.get("ol.items > li.item").first().find("span.price");
  }

  getNumberOfProductItems() {
    return cy.get("ol.products.list.items.product-items");
  }

  getProductItem() {
    return cy.get("li.item.product.product-item").first();
  }
  getProductPrice() {
    return cy.get("span.price");
  }

  getProductTitle() {
    return cy
      .get("li.item.product.product-item")
      .first()
      .within(() => {
        cy.get("strong.product.name.product-item-name a.product-item-link")
          .invoke("text")
          .then((productTitle) => {
            cy.log("Product Title:", productTitle.trim());
          });
      });
  }

  getAllProductTitles() {
    return cy.get(
      "li.item.product.product-item strong.product.name.product-item-name a.product-item-link"
    );
  }

  getProductSize() {
    return cy
      .get("li.item.product.product-item")
      .first()
      .find(".swatch-attribute.size .swatch-option")
      .contains("XS");
  }

  getProductColor() {
    return cy
      .get("li.item.product.product-item")
      .first()
      .find(".swatch-attribute.color .swatch-option[option-label='Blue']");
  }

  getAddToCartButton() {
    return cy
      .get("li.item.product.product-item")
      .first()
      .find("button.action.tocart.primary")
      .contains("Add to Cart");
  }

  getSortByDropdown() {
    return cy.get("#sorter");
  }

  getSearchBox() {
    return cy.get("#search");
  }

  getPaginationBar() {
    return cy.get(".pages");
  }

  getCurrentPage() {
    return cy.get("li.item.current");
  }

  getNextPage() {
    return cy.get("li.item a.page");
  }
}

export default ProductDetailsPage;
