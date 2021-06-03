// Listen for tasks and alter configuration variables as well as directly access the OS and file
// system: https://docs.cypress.io/guides/tooling/plugins-guide#Use-Cases

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    'db:teardown': () => {
      const teardown = require('../../database/teardown.js')
    },
    
    'db:seed': () => {
      const seed = require('../../database/seed.js')
    }
  })
}
