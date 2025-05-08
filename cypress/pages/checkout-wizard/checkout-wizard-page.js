class CheckoutWizardPage {
  getShippingPageTitle() {
    return cy.get(".step-title");
  }
  getFirstNameInput() {
    return cy.get('input[name="firstname"] ');
  }
  getLastNameInput() {
    return cy.get('input[name="lastname"]');
  }

  getStreetAddressInput() {
    return cy.get('input[name="street[0]"]');
  }

  getCityInput() {
    return cy.get('input[name="city"]');
  }

  getPostcodeInput() {
    return cy.get('input[name="postcode"]');
  }

  getCountrySelect() {
    return cy.get('select[name="country_id"]');
  }

  getPhoneNumberInput() {
    return cy.get('input[name="telephone"]');
  }

  getNextButton() {
    return cy.get('button[data-role="opc-continue"]');
  }

  getPaymentMethodTitle() {
    return cy.get('div.step-title[data-role="title"]');
  }

  getPaymentMethod() {
    return cy.get('td.col.col-method input[type="radio"]');
  }

  getPlaceOrderButton() {
    return cy.get(
      'button.action.primary.checkout[type="submit"][title="Place Order"]'
    );
  }

  getShippingAddressBox() {
    return cy.get(".shipping-address-item.selected-item");
  }

  getOrderSuccessPageTitle() {
    return cy.get("h1.page-title");
  }

  getOrderNumber() {
    return cy.get(".order-number");
  }
}

export default CheckoutWizardPage;
