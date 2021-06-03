import HeaderPage from '../../../page-objects/HeaderPage'
import ContactFormPage from '../../../page-objects/ContactFormPage'

const headerPage = new HeaderPage()
const contactFormPage = new ContactFormPage()

describe('Contact Form', () => {
  const msg = 'Complaint about order R108'
  const ref = 'R108'
  const email = 'test@toptal.com'
  const img = 'human-patch.png'

  context('Contact Form Submission', () => {
    it('Successfully submits a contact form with an image and all fields filled out', () => {
      cy.visit('http://automationpractice.com')

      headerPage.clickContactUs()

      contactFormPage
        .chooseWebmasterHeader()
        .enterEmailAddress(email)
        .enterOrderReference(ref)
        .enterMessage(msg)
        .uploadImage(img)
        .submitContactForm()
        .getSuccessMessage()
        .should('be.visible')
    })
  })
})
