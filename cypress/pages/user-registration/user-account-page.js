class userAccountPage {
  getWelcomeMessage() {
    return cy.get(".greet.welcome > span.logged-in");
  }
}
export default userAccountPage;
