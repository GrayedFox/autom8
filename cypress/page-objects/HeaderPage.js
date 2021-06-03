const selectors = {
  header: '#header .nav',
  contactLink: '#contact-link',
}

const urls = {
  base: '/index.php',
  contact: 'http://automationpractice.com/index.php?controller=contact'
}

class HeaderPage {
  clickContactUs() {
    // alias all elements on the page we will interact with
    cy.get(selectors.contactLink).as('contact')

    // intercept any requests we need to wait on
    cy.intercept(`${urls.contact}*`).as('clickContact')

    // interact with the page
    cy.get('@contact').click().wait('@clickContact')

    return this
  }
}

export default HeaderPage
