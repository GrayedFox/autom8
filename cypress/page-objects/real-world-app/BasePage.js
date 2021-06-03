// Still not sure what effect using static methods will have on the Cypress test runner and in
// particular chained assertions so for now we are playing it safe here, see
// https://eslint.org/docs/rules/class-methods-use-this

class BasePage {
  launchApplication() {
    cy.visit('/')
  }
}

export default BasePage
