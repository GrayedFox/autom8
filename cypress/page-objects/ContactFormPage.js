const selectors = {
  subjectHeading: '#id_contact',
  email: '#email',
  orderRef: '#id_order',
  messageTextArea: '#message',
  fileUploadInput: '#uniform-fileUpload input',
  fileUploadSpan: '#uniform-fileUpload .action',
  sendBtn: '#submitMessage',
  successMsg: '.alert-success'
}

const content = {
  webmaster: 'Webmaster'
}

const urls = {
  contact: 'http://automationpractice.com/index.php?controller=contact'
}

class ContactFormPage {
  /* PageObject methods return the PageObject instance (NOT the Cypress instnace) */

  visitContactFormPage() {
    cy.visit(urls.contact)

    return this
  }

  chooseWebmasterHeader() {
    cy.get(selectors.subjectHeading).select(content.webmaster)

    return this
  }

  enterEmailAddress(email) {
    cy.get(selectors.email).type(email)

    return this
  }

  enterOrderReference(orderRef) {
    cy.get(selectors.orderRef).type(orderRef)

    return this
  }

  enterMessage(message) {
    cy.get(selectors.messageTextArea).type(message)

    return this
  }

  uploadImage(imageName) {
    cy.uploadPngImage(imageName, selectors.fileUploadInput)

    return this
  }

  submitContactForm() {
    cy.get(selectors.sendBtn).as('send')

    cy.intercept('POST', urls.contact).as('submitForm')

    cy.get('@send').click().wait('@submitForm')

    return this
  }

  /* Getters return the Cypress instance (NOT the PageObject instance) */

  getSuccessMessage() {
    return cy.get(selectors.successMsg)
  }
}

export default ContactFormPage
