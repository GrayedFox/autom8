// This is where you want to perform one of tasks that don't require any interaction with the
// Cypress test runner but may require access to the file system or OS. Tasks are run in the local
// Node environment and can be called form within tests using cy.task()
// See: https://docs.cypress.io/guides/tooling/plugins-guide#Use-Cases
const chance = require('chance').Chance()

const teardown = require('../../database/tasks/teardown')
const seed = require('../../database/tasks/seed')

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('before:run', () => {
    // this is either set manually or should already be present if Cypress retries a failed test
    if (!process.env.CYPRESS_CHANCE_SEED) {
      process.env.CYPRESS_CHANCE_SEED = chance.hash();
    }

    // eslint-disable-next-line no-console
    console.log(`CYPRESS_CHANCE_SEED: ${process.env.CYPRESS_CHANCE_SEED}`)
  })

  on('after:run', () => {
    // delete randomly generated seed if all tests passed?
  })

  on('task', {
    'db:teardown': () => {
      teardown()
    },

    'db:seed': () => {
      seed()
    },

    // return the chance seed in use for this run
    chanceSeed: () => process.env.CYPRESS_CHANCE_SEED
  })
}
