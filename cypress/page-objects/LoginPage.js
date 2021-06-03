import BasePage from './BasePage'

import auth from '../fixtures/auth.json'

const selectors = {
  username: '#username',
  password: '#password',
  signinBtn: 'button[data-test="signin-submit"]'
}

const urls = {
  base: '/signin',
  login: '/login'
}

class LoginPage extends BasePage {
  /* PageObject methods return the PageObject instance (NOT the Cypress instnace) */

  visitLoginPage() {
    // navigate using a derived method from BasePage (to show inheritance example)
    this.launchApplication()

    return this
  }

  login(username, password) {
    // allow individual tests to pass in a username and password if needed, otherwise default to
    // generated fixtures
    username = username || auth.user.username
    password = password || auth.user.password

    // alias all elements on the page we will interact with
    cy.get(selectors.username).as('user')
    cy.get(selectors.password).as('pass')
    cy.get(selectors.signinBtn).as('signin')

    // intercept any requests we need to wait on
    cy.intercept(urls.login).as('login')

    // interact with the page
    cy.get('@user').type(username)
    cy.get('@pass').type(password)
    cy.get('@signin').click().wait('@login')

    return this
  }

  /* Getters return the Cypress instance (NOT the PageObject instance) */

  getUsername() { return cy.get(selectors.username) }

  getPassword() { return cy.get(selectors.password) }

  getSigninButton() { return cy.get(selectors.signinBtn) }
}

export default LoginPage
