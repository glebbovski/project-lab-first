describe('E2E tests', () => {
  it('open login page and make a screenshot to confirm that it works', () => {
    cy.visit('http://127.0.0.1:8080/login');
	cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
	cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
	Cypress.Screenshot.defaults({ capture: 'fullPage' });
	cy.screenshot('page-screen')
  });
  
  it('simple login and logout', () => {
	  cy.visit('http://127.0.0.1:8080/login');
	  cy.url().should('eq', 'http://127.0.0.1:8080/login')
	  cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
	  cy.get('#email').type('qqq@gmail.com');
	  cy.get('#password').type('qwertyqwerty26');
	  cy.get('#loginButton').click();
	  cy.contains('button', 'OK').click()
	  cy.url().should('eq', 'http://127.0.0.1:8080/')
	  cy.get('#logoutButton', { timeout: 5000 }).should('be.visible');
	  
	  cy.window().then((win) => {
		 const sessionStorage = win.sessionStorage;
		 const itemValue = JSON.parse(sessionStorage.getItem('vue-session-key'));
		 cy.expect(itemValue['username']).to.equal('glebovski');
	  });


	  cy.wait(400);
	  cy.get('#logoutButton').click()
	  cy.contains('button', 'OK').click()
	  cy.url().should('eq', 'http://127.0.0.1:8080/login')
	  cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
	  
  });

  it('send something via websocket chat', () => {
	  cy.visit('http://127.0.0.1:8080/login');
	  cy.url().should('eq', 'http://127.0.0.1:8080/login')
	  cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
	  cy.get('#email').type('qqq@gmail.com');
	  cy.get('#password').type('qwertyqwerty26');
	  cy.get('#loginButton').click();
	  cy.contains('button', 'OK').click()
	  cy.url().should('eq', 'http://127.0.0.1:8080/')
	  cy.get('#logoutButton', { timeout: 5000 }).should('be.visible');
	  
	  cy.window().then((win) => {
		 const sessionStorage = win.sessionStorage;
		 const itemValue = JSON.parse(sessionStorage.getItem('vue-session-key'));
		 cy.expect(itemValue['username']).to.equal('glebovski');
	  });

	  cy.get('#chatButton').click()
	  cy.url().should('eq', 'http://127.0.0.1:8080/websocket-chat')
	  cy.xpath('//*[contains(text(),"Your username: ")]/b').should('be.visible');

	  cy.wait(1500);

	  let msg;
	  cy.xpath('//*[contains(text(),"[2024")]').last().then(($elem) => {
		const text = $elem.text()
		const myArray = text.split("glebovski:");
		msg = myArray[1].trim()
		msg = msg + "t"
		cy.xpath('//input').type(msg);
		cy.get('#submitButton').click()
	  })

	  cy.wait(1500);

	  cy.xpath('//*[contains(text(),"[2024")]').last().then(($elem) => {
		const text = $elem.text()
		expect(text).to.include(msg)
	  })
	 
	  cy.get('#backButton').click()
	  cy.url().should('eq', 'http://127.0.0.1:8080/')

	//   Logout
		cy.wait(400);
	  cy.get('#logoutButton').click()
	  cy.contains('button', 'OK').click()
	  cy.url().should('eq', 'http://127.0.0.1:8080/login')
	  cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
  });


	it('go to about page and check it', () => {
		cy.visit('http://127.0.0.1:8080/login');
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
		cy.get('#email').type('qqq@gmail.com');
		cy.get('#password').type('qwertyqwerty26');
		cy.get('#loginButton').click();
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/')
		cy.get('#logoutButton', { timeout: 5000 }).should('be.visible');
		
		cy.window().then((win) => {
		const sessionStorage = win.sessionStorage;
		const itemValue = JSON.parse(sessionStorage.getItem('vue-session-key'));
		cy.expect(itemValue['username']).to.equal('glebovski');
		});

		cy.get('#aboutButton').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/about')
		cy.wait(1500);
		cy.xpath('//v-text[contains(text(), "Krasnodon")]').should('be.visible');
		cy.xpath('//v-text[contains(text(), "This is a project for laboratory works for my 5th grade of KPI learning")]').should('be.visible');
		cy.xpath('//v-text[contains(text(), "qqq@gmail.com")]').should('be.visible');

		cy.get('#backButton').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/')

	//   Logout
		cy.wait(400);
		cy.get('#logoutButton').click()
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
	});


	it('check profile attributes and change first name', () => {
		cy.visit('http://127.0.0.1:8080/login');
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
		cy.get('#email').type('qqq@gmail.com');
		cy.get('#password').type('qwertyqwerty26');
		cy.get('#loginButton').click();
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/')
		cy.get('#logoutButton', { timeout: 5000 }).should('be.visible');
		
		cy.window().then((win) => {
			const sessionStorage = win.sessionStorage;
			const itemValue = JSON.parse(sessionStorage.getItem('vue-session-key'));
			cy.expect(itemValue['username']).to.equal('glebovski');
		});


		cy.get('#firstName').should('not.be.visible');
		cy.get('#lastName').should('not.be.visible');
		cy.get('#emailAddress').should('not.be.visible');
		cy.get('#datePicker').should('not.be.visible');
		cy.get('#sexSelection').should('not.be.visible');
		cy.get('#saveChangesButton').should('not.be.visible');

		cy.get('#profileButton').click();
		cy.wait(400);
		cy.get('#firstName').should('be.visible');
		cy.get('#lastName').should('be.visible');
		cy.get('#emailAddress').should('be.visible');
		cy.get('#datePicker').should('be.visible');
		cy.get('#sexSelection').should('be.visible');
		cy.get('#saveChangesButton').should('be.visible');

		cy.get('#firstName').should('have.value', 'glepka')

		cy.get('#firstName').clear().type('glepka_cypress');
		cy.get('#saveChangesButton').click()
		cy.wait(400);
		cy.xpath('//*[contains(text(), "You successfully changed your profile attributes!")]').should('be.visible');
		cy.contains('button', 'OK').click();
		cy.get('#firstName').should('have.value', 'glepka_cypress')
		cy.get('#firstName').clear().type('glepka');
		cy.get('#saveChangesButton').click()
		cy.wait(400);
		cy.xpath('//*[contains(text(), "You successfully changed your profile attributes!")]').should('be.visible');
		cy.contains('button', 'OK').click();
		cy.get('#firstName').should('have.value', 'glepka')

	//   Logout
		cy.wait(400);
		cy.get('#logoutButton').click();
		cy.contains('button', 'OK').click();
		cy.url().should('eq', 'http://127.0.0.1:8080/login');
		cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
	});


	it('check all courses page', () => {
		cy.visit('http://127.0.0.1:8080/login');
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
		cy.get('#email').type('qqq@gmail.com');
		cy.get('#password').type('qwertyqwerty26');
		cy.get('#loginButton').click();
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/')
		cy.get('#logoutButton', { timeout: 5000 }).should('be.visible');
		
		cy.window().then((win) => {
			const sessionStorage = win.sessionStorage;
			const itemValue = JSON.parse(sessionStorage.getItem('vue-session-key'));
			cy.expect(itemValue['username']).to.equal('glebovski');
		});

		cy.get('#course-1').should('not.be.visible')
		cy.get('#coursesButton').click()
		cy.get('#course-1').should('be.visible')


		cy.wait(400);
		cy.get('#logoutButton').click()
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
	});


	it('check chemistry course page', () => {
		cy.visit('http://127.0.0.1:8080/login');
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#registerButton', { timeout: 5000 }).should('be.visible');
		cy.get('#email').type('qqq@gmail.com');
		cy.get('#password').type('qwertyqwerty26');
		cy.get('#loginButton').click();
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/')
		cy.get('#logoutButton', { timeout: 5000 }).should('be.visible');
		
		cy.window().then((win) => {
			const sessionStorage = win.sessionStorage;
			const itemValue = JSON.parse(sessionStorage.getItem('vue-session-key'));
			cy.expect(itemValue['username']).to.equal('glebovski');
		});

		cy.get('#course-1').should('not.be.visible')
		cy.get('#coursesButton').click()
		cy.get('#course-1').should('be.visible')

		cy.wait(500);
		cy.xpath('//*[@Id="course-1"]//button').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/chemistry')
		cy.wait(500);


		cy.get('#submitButton').should('be.disabled')
		cy.xpath("//input[@role='radio']/../following-sibling::label[contains(text(), 'Hlib')]/..//input/following-sibling::div").click()
		cy.get('#retryButton').should('be.disabled')
		cy.get('#submitButton').should('not.be.disabled').click()
		cy.wait(200)
		cy.xpath("//*[contains(@class, 'theme--light green--text')]").should('be.visible')
		cy.get('#retryButton').should('not.be.disabled')
		cy.get('#submitButton').should('be.disabled')
		cy.get('#retryButton').click()
		cy.get('#submitButton').should('be.disabled')
		cy.xpath("//input[@role='radio']/../following-sibling::label[contains(text(), 'Deniz')]/..//input/following-sibling::div").click()
		cy.get('#retryButton').should('be.disabled')
		cy.get('#submitButton').should('not.be.disabled').click()
		cy.wait(200)
		cy.xpath("//*[contains(@class, 'theme--light red--text')]").should('be.visible')
		cy.get('#retryButton').should('not.be.disabled')
		cy.get('#submitButton').should('be.disabled')
		cy.get('#retryButton').click()


		cy.get('#backButton').should('be.visible').click()
		cy.wait(500);

		cy.get('#logoutButton').click()
		cy.contains('button', 'OK').click()
		cy.url().should('eq', 'http://127.0.0.1:8080/login')
		cy.get('#loginButton', { timeout: 5000 }).should('be.visible');
	});


})