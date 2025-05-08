class SingleProductDetailsPage {
  getProductTitle() {
    return cy.get('span.base[data-ui-id="page-title-wrapper"]');
  }

  getProductPrice() {
    return cy.get(".product-price");
  }

  getProductSize() {
    return cy
      .get("div.swatch-attribute.size .swatch-option.text")
      .contains("S");
  }

  getProductColor() {
    return cy.get(
      "div.swatch-attribute.color .swatch-option[option-label='Blue']"
    );
  }

  getProductQuantity() {
    return cy.get("#qty");
  }

  getAddToCartButton() {
    return cy.get("button#product-addtocart-button");
  }

  getColorRequiredErrorMessage() {
    return cy.get("div#super_attribute\\[93\\]-error.mage-error");
  }
  getSizeRequiredErrorMessage() {
    return cy.get("div#super_attribute\\[143\\]-error.mage-error");
  }
}

export default SingleProductDetailsPage;
