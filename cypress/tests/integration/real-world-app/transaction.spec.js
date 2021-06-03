import LoginPage from '../../../page-objects/real-world-app/LoginPage'
import TransactionPage from '../../../page-objects/real-world-app/TransactionPage'

const Chance = require('chance')

const loginPage = new LoginPage()
const transactionPage = new TransactionPage()

describe('Transactions', () => {
  let chance

  beforeEach(() => {
    // although authentication is successul and the auth cookie carries over into the next request,
    // the Real World App still redirects the user to the login page if using loginByJSON
    // cy.loginByJSON()

    cy.task('chanceSeed').then((seed) => {
      chance = new Chance(seed)
    })

    loginPage
      .visitLoginPage()
      .login()
  })

  context('GET /users (contacts) on transaction page', () => {
    it('displays contacts after searching and clearing input', () => {
      transactionPage
        .visitNewTransactionPage()
        .filterUsers(chance.word())
        .clearInput()
        .getResults()
        .should('not.be.empty')
    })
  })
})
