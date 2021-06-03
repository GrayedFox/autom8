# autom8

A template repo for web and backend automation using Cypress, Node, ChanceJS, plus some extras.

## goal

The aim of this repository is to provide the scaffolding needed to make it easy to quickly plug into
and test most layers of a web application while adhering to some industry best practices.

Most web applications can be roughly divide into three parts:

- front end (client side applications, SPAs, traditional web apps)
- back end (server side applications, APIs, REST, SOAP, etc)
- database layer (MYSQL, Casandra, MongoDB, etc)

## principles

Nearly all modern web applications use some form of authentication, employ one or more public (and
sometimes private) APIs, and rely on a persistence layer for storing information. There are also a
few principles (best practises) test engineers should adhere to when building automation suites:

- use true end-to-end integration tests **sparingly** and only for critical application paths
- isolate and manage your own **testing database** (don't rely on staging for automated tests!)
- randomised test data should **always generate a repeatable seed in case of failures**
- **unit tests** should always generate a code coverage report of some kind
- **component tests** should be preferred over any sort of UI navigation when and where possible
- specs should separate **page logic** from **business logic** (PageObject pattern)
- specs should be able to be run **in parallel** (if so desired)
- specs should be able to be run **individually** or in **groups/buckets**
- specs should **only assert what they need to** and test for one specific thing per test case
- specs should be able to be run **locally** or as part of a **continuous integration** environment

## methodology

While each product and stack will require it's own unique tests and logic, given the above
principles and conservative assumptions about most modern web application stacks, this repo:

- ships with a MongoDB test database that can be interacted with using `cy.task()`
- writes fixtures that can be used within tests based on the data retrieved/seeded from the test
  database
- ships with examples that employ the [PageObject pattern][1] for writing clean integration tests
- ships with examples of [Cypress custom commands][2]
- can be run against a local [Cypress Real World Application][0] app straight out of the box

## usage

- update the `baseURL` inside `cypress.json` to point to your local or hosted application
- update the `apiURL` inside `cypress.json` to point to your API
- update and add any endpoints to `cypress.env.json` (your VCS may want to ignore this file)

## feature list

- [X] Sample integration login test using PageObject pattern (works against Cypress RWA)
- [X] Sample API test for directly testing an API (works against Cypress RWA)
- [ ] Sample component test for testing a React component (works against Cypress RWA)
- [X] ChanceJS used to randomised test data generation with repeatable seeds
- [ ] MongoDB seed task run once per suite run
- [ ] MongoDB teardown task run once per suite run
- [ ] Fixture generation task run once per suite run

## further reading

- [Cypress example recipes][4] -- great resource covering nearly all aspects of Cypress
- [PageObjects in Cypress guide][3] -- a look at using the PageObject pattern alongside Cypress
- [Reproducible Random Tests with ChanceJS and Jest][6] -- excellent guide, thanks [VSBMeza][7]
- [Excellent 4 part series on using statically typed JavaScript][5] -- just because

[0]: https://github.com/cypress-io/cypress-realworld-app
[1]: https://www.martinfowler.com/bliki/PageObject.html
[2]: https://docs.cypress.io/api/cypress-api/custom-commands
[3]: https://learndevtestops.com/2020/05/25/page-objects-in-cypress-quick-look/
[4]: https://github.com/cypress-io/cypress-example-recipes
[5]: https://medium.com/free-code-camp/why-use-static-types-in-javascript-part-1-8382da1e0adb#.gqg3xut8w
[6]: https://hackernoon.com/reproducible-random-tests-with-jest-and-chancejs-1a35edce0805
[7]: https://hackernoon.com/u/vsbmeza
