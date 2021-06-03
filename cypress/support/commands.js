// For more comprehensive examples of custom commands please read more here:
// https://on.cypress.io/custom-commands

// Authenticate directly using a JSON POST request
Cypress.Commands.add('loginByJSON', (uri, username, password) => {
  cy.fixture('auth.json').then((authData) => {
    uri = uri || `${Cypress.env('apiUrl')}/login`
    username = username || authData.user.username
    password = password || authData.user.password

    Cypress.log({
      name: 'Login by JSON: ',
      message: `${uri} | ${username} | ${password}`,
    })

    return cy.request('POST', uri, {
      username,
      password
    })
  })
})

// Upload a PNG image file to a the specified form (assumes form upload type is file)
Cypress.Commands.add('uploadPngImage', (imageName, selector) => {
  const imagePath = `images/${imageName}`

  cy.fixture(imagePath).as('pngImage')

  // cannot use an arrow function here since we need the calling function's scope for 'this'
  cy.get(selector).then(function callback(el) {
    // convert the image base64 string to a blob
    const blob = Cypress.Blob.base64StringToBlob(this.pngImage, 'image/png')

    const file = new File([blob], imagePath, { type: 'image/png' })
    const list = new DataTransfer()

    list.items.add(file)

    el[0].files = list.files
    el[0].dispatchEvent(new Event('change', { bubbles: true }))
  })
})
