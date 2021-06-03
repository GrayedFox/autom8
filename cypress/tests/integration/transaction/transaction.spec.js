import LoginPage from '../../../page-objects/LoginPage'
import TransactionPage from '../../../page-objects/TransactionPage'

const loginPage = new LoginPage()
const transactionPage = new TransactionPage()

describe('Transactions', () => {
  beforeEach(() => {
    // although authentication is successul and the auth cookie carries over into the next request,
    // the Real World App still redirects the user to the login page if using loginByJSON
    // cy.loginByJSON()
    loginPage
      .visitLoginPage()
      .login()
  })

  context('GET /users (contacts) on transaction page', () => {
    it('displays contacts after searching and clearing input', () => {
      transactionPage
        .visitNewTransactionPage()
        .filterUsers('alice')
        .clearInput()
        .getResults()
        .should('not.be.empty')
    })
  })
})
