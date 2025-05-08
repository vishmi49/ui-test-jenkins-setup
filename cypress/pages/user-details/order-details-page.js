class OrderDetailsPage {
  visitOrderDetailsPage() {
    cy.visit(`/sales/order/history/`);
  }
  getPageTitle() {
    return cy.get('span.base[data-ui-id="page-title-wrapper"]');
  }

  getOrderId() {
    return cy.get("td.col.id");
  }
}
export default OrderDetailsPage;
