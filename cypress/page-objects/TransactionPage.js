const selectors = {
  searchInput: '#user-list-search-input',
  searchResults: 'ul[data-test="users-list"]'
}

const urls = {
  base: '/transaction/new',
  search: '/users/search*'
}

class TransactionPage {
  /* PageObject methods return the PageObject instance (NOT the Cypress instnace) */

  visitNewTransactionPage() {
    // navigate to the transaction page
    cy.visit(urls.base)

    return this
  }

  filterUsers(query) {
    // alias all elements on the page we will interact with
    cy.get(selectors.searchInput).as('input')

    // intercept any requests we need to wait on
    cy.intercept(urls.search).as('users')

    // interact with the page
    cy.get('@input').type(query).wait('@users')

    return this
  }

  clearInput() {
    // alias all elements on the page we will interact with
    cy.get(selectors.searchInput).as('input')

    // intercept any requests we need to wait on
    cy.intercept(urls.search).as('users')

    // interact with the page
    cy.get('@input').clear().wait('@users')

    return this
  }

  /* Getters return the Cypress instance (NOT the PageObject instance) */

  getInput() { return cy.get(selectors.searchInput) }

  getResults() { return cy.get(selectors.searchResults) }
}

export default TransactionPage
