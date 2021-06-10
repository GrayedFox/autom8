/* eslint-disable no-console */

const { exec } = require('child_process')
const { writeFile } = require('fs')
const { MongoClient } = require('mongodb')
const path = require('path')

const cypressEnvValues = require('../../cypress.env.json')

const environment = { env: { NODE_ENV: 'testing' }, }

const {
  username, password, host, port, imageName, collectionName, databaseName
} = cypressEnvValues.mongo

const mongoUri = `mongodb://${username}:${password}@${host}:${port}/`
const client = new MongoClient(mongoUri)

// the collection used throughout the test run, see connect()
let collection

// executeCommand is a wrapper around Node's child_process.exec command, thus
// it has access to the operating system and whatever is available there (Bash, Docker, etc)
// it resolves with output of command and can optionally ignore failed commands
// NOTE: this command swallows error messages if failOnError is set to false
const executeCommand = (command, envObject, resolveMsg, failOnError = true) => new
Promise((resolve, reject) => {
  exec(command, envObject, (err, stdout) => {
    // if error and failOnError is true, reject the promise with the error object
    if (err && failOnError) reject(err)

    // if no error we log the resolve message if one present
    if (!err && resolveMsg) console.log(resolveMsg)

    // resolve promise with err object if it exists, otherwise resolve with command output
    resolve(err || stdout)
  })
})

// connect to the mongo client and set a reference to our test collection
const connect = async () => {
  console.log('Connecting to mongo database...')
  await client.connect()
  collection = client.db(databaseName).collection(collectionName)
  console.log('Connected')
  return Promise.resolve(collection)
}

// disconnect from the mongo client
const disconnect = async () => {
  console.log('Disconnecting from mongo database...')
  await client.close()
  console.log('Disconnected')
  return Promise.resolve(true)
}

// command to wait a given amount of milliseconds
const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

// checks if the mongo instance inside our docker container is ready
const isMongoDbReady = async () => {
  const dockerCommand = `docker exec ${imageName} mongo --eval "db.version()"`
  const result = await executeCommand(dockerCommand, environment, 'Mongo is ready', false)
  return result && !result.code
}

// poll the mongo instance a number of times, waiting for it to be ready
const checkMongoDbReady = async (millisecondsBetweenAttempts, retries = 5) => {
  console.log(`Waiting ${millisecondsBetweenAttempts} milliseconds for Mongo to be ready...`)

  const result = await isMongoDbReady()

  if (result) return Promise.resolve(true)

  if (retries === 0) return Promise.reject(new Error('Mongo not ready after max retries'))

  await sleep(millisecondsBetweenAttempts)
  retries -= 1

  return checkMongoDbReady(millisecondsBetweenAttempts, retries)
}

// runs the pure bash script waitForIt.sh in order to wait for the MongoDB
// inside the docker container to be ready and accepting connections
const isHostAcceptingConnections = async (timeoutInSeconds) => {
  console.log(`Waiting ${timeoutInSeconds} seconds for connections to be accepted...`)
  const waitForItCommand = `bash ./helpers/waitForIt.sh "${host}:${port}" "--timeout=${timeoutInSeconds}"`
  const result = await executeCommand(waitForItCommand, environment, `Port ${port} now accepting connections`, false)
  return result && !result.code
}

// return a Promise with the total amount of docs contained in the collection
const getDocsTotal = async () => {
  const totalDocs = await collection.countDocuments({})
  return Promise.resolve(totalDocs)
}

// generate user fixtures based on data read from the mongodb: at least O(n+m)+1
const generateFixtures = async () => {
  const writePath = `${path.relative(process.cwd(), './cypress/fixtures/')}/data.json`
  const queryOptions = { projection: { _id: 0 } } // exclude the mongo _id from results
  const documents = await collection.find({}, queryOptions).toArray()
  const results = JSON.stringify(documents, null, 2)

  console.log(`writePath: ${writePath}`)
  console.log(results)

  return new Promise((resolve, reject) => {
    writeFile(writePath, results, (error) => {
      if (error) reject(error)
      resolve(results)
    })
  })
}

// seed the database with the given array of data (array of objects)
const seed = async (data) => {
  console.log('Seeding data...')
  console.log(data)

  const totalDocs = await getDocsTotal()

  // drop destroys all data from a collection, handle with care
  if (totalDocs > 0) {
    collection.drop()
    console.log('Dropped existing data (this indicates a dirty run)')
  }

  // inserts user data
  const result = await collection.insertMany(data)

  console.log(`${result.insertedCount} documents inserted`)

  return Promise.resolve(result)
}

// setup the mongo docker image using the mongo environment variables
const setup = async (failOnError = true) => {
  const dockerCommand = `docker run -d --name ${imageName} \
    -p ${port}:${port} \
    -e MONGO_INITDB_ROOT_USERNAME=${username} \
    -e MONGO_INITDB_ROOT_PASSWORD=${password} \
    mongo`

  return executeCommand(dockerCommand, environment, 'Finished database setup', failOnError)
}

// teardown the database by shutting down the MondoDB and using docker stop && docker remove
const teardown = async (failOnError = true) => {
  const dockerCommand = `docker stop ${imageName} && docker rm ${imageName}`
  return executeCommand(dockerCommand, environment, 'Finished database teardown', failOnError)
}

module.exports = {
  checkMongoDbReady,
  connect,
  disconnect,
  generateFixtures,
  getDocsTotal,
  isHostAcceptingConnections,
  seed,
  setup,
  sleep,
  teardown
}
