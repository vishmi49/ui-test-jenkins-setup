import { FIRST_NAMES, LAST_NAMES } from "./MockData/names-const";

export default class Utils {
  static getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static getAppOrigin() {
    return Cypress.config().baseUrl;
  }

  static getRandomFirstName() {
    return FIRST_NAMES[Utils.getRandomRange(0, FIRST_NAMES.length)];
  }

  static getRandomLastName() {
    return LAST_NAMES[Utils.getRandomRange(0, LAST_NAMES.length)];
  }

  static generateEmail() {
    const firstName = Utils.getRandomFirstName().toLowerCase();
    const lastName = Utils.getRandomLastName().toLowerCase();
    return `${firstName}.${lastName}@gmail.com`;
  }

  static waitForNextStep() {
    cy.wait(1000);
  }

  static generateString() {
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";

    let result = upperCaseLetters.charAt(
      Math.floor(Math.random() * upperCaseLetters.length)
    );

    for (let i = 0; i < 3; i++) {
      result += lowerCaseLetters.charAt(
        Math.floor(Math.random() * lowerCaseLetters.length)
      );
    }
    return result;
  }
}
