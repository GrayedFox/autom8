const userData = require('../../../../database/seedData/users.json')

describe('Authentication - API', () => {
  context('Authenticates with a valid JSON payload', () => {
    let loginResponse

    before(() => {
      cy.loginByJSON().then((response) => { loginResponse = response })
      cy.task('db:logTotal')
      cy.task('db:seed', userData.users)
      cy.task('db:logTotal')
      cy.task('db:generateFixtures')
      // cy.task('db:generateFixtures')
    })

    it('Returns a 200 response with a valid JSON payload', () => {
      expect(loginResponse.status).to.eq(200)
    })

    it('Returns a JSON payload that contains a user', () => {
      expect(loginResponse.body.user).to.not.eq('undefined')
    })
  })
})
