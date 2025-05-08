class EditShoppingCartPage {
  getProductSizeMedium() {
    return cy
      .get("div.swatch-attribute.size .swatch-option.text")
      .contains("M");
  }

  getUpdateCartButton() {
    return cy.get("#product-updatecart-button");
  }
}
export default EditShoppingCartPage;
