class ProductsMenuPage {
  visit() {
    cy.visit(`/`);
  }

  getProductMenu() {
    return cy.get("#ui-id-2");
  }
  getWomenMenu() {
    return cy.get("#ui-id-2 > li:nth-child(2)");
  }

  getTopsMenu() {
    return cy.get("#ui-id-9");
  }

  getJacketsMenu() {
    return cy
      .get(".level2.nav-2-1-1.category-item.first.ui-menu-item")
      .within(() => {
        cy.get("#ui-id-11");
      });
  }
}

export default ProductsMenuPage;
