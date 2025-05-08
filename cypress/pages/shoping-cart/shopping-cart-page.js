class ShoppingCartPage {
  visitCartPage() {
    cy.visit(`/checkout/cart/`);
  }

  getPageTitle() {
    return cy.get('span.base[data-ui-id="page-title-wrapper"]');
  }
  getCartIcon() {
    return cy.get(".showcart");
  }

  getCartDialogBox() {
    return cy.get(".block.block-minicart.ui-dialog-content.ui-widget-content");
  }

  getCartItemCount() {
    return cy.get("span.counter-number", {
      timeout: Cypress.config().largeTimeout,
    });
  }

  getDeleteConfirmationButton() {
    return cy.get("button.action-primary.action-accept");
  }

  getDeleteButton() {
    return cy.get("a.action.delete");
  }

  getEmptyCartMessage() {
    return cy.get("div.cart-empty p").first();
  }

  getDeleteIcon() {
    return cy.get('a.action.action-delete[title="Remove item"]', {
      timeout: Cypress.config().largeTimeout,
    });
  }

  getEditIcon() {
    return cy.get('a.action.action-edit[title="Edit item parameters"]');
  }

  getCartItemQuantityInput() {
    return cy.get('input.input-text.qty[data-role="cart-item-qty"]');
  }

  getUpdateShoppingCartButton() {
    return cy.get('button[title="Update Shopping Cart"]');
  }

  getSingleProductPrice() {
    return cy.get("td.col.price span.cart-price > span.price");
  }

  getCartSubtotal() {
    return cy.get("td.col.subtotal span.cart-price > span.price");
  }

  getOrderTotal() {
    return cy.get("tr.grand.totals");
  }

  getProceedToCheckoutButton() {
    return cy.get('button[data-role="proceed-to-checkout"]');
  }

  getItemSize() {
    return cy.get("td.col.item dd").first();
  }
}
export default ShoppingCartPage;
