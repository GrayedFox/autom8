// This is where you want to perform one of tasks that don't require any interaction with the
// Cypress test runner but may require access to the file system or OS. Tasks are run in the local
// Node environment and can be called form within tests using cy.task()
// See: https://docs.cypress.io/guides/tooling/plugins-guide#Use-Cases
const chance = require('chance').Chance()

const {
  checkMongoDbReady,
  connect,
  disconnect,
  isHostAcceptingConnections,
  generateFixtures,
  getDocsTotal,
  seed,
  setup,
  teardown,
} = require('../../database/tasks/db')

/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
module.exports = async (on, config) => {
  // common tasks executed before every suite run
  on('before:run', async () => {
    console.log('BEFORE:RUN HOOK')

    // this is either set manually or should already be present if Cypress retries a failed test
    if (!process.env.CYPRESS_CHANCE_SEED) {
      process.env.CYPRESS_CHANCE_SEED = chance.hash()
    }

    console.log(`CYPRESS_CHANCE_SEED: ${process.env.CYPRESS_CHANCE_SEED}`)

    await setup()
    const portAcceptingConnections = await isHostAcceptingConnections(15)

    // Sometimes the mongo docker image is up but not accepting connections
    // we fail the run if this is the case
    if (portAcceptingConnections === false) {
      console.log('Mongo host not accepting connections, stopping and removing docker images...')
      await teardown()
      throw new Error('Please retry the test suite')
    }

    // we attempt to connect to Mongo every M milliseconds a total of T times
    await checkMongoDbReady(1000, 10)
    await connect()
  })

  // common tasks executed after every suite run
  on('after:run', async () => {
    console.log('AFTER:RUN HOOK')

    await disconnect()
    await teardown()
  })

  // cypress tasks must return either null or a Promise
  on('task', {
    'db:generateFixtures': async () => generateFixtures(),

    'db:logTotal': async () => {
      const result = await getDocsTotal()
      console.log(`Total docs: ${result}`)
      return null
    },

    'db:seed': async (data) => seed(data),

    'chance:seed': () => process.env.CYPRESS_CHANCE_SEED
  })
}
