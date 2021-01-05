const { findIconDefinition } = require("@fortawesome/fontawesome-svg-core");
const moment = require("moment");

const APIURL = "api";






const studentLogin = (number) => {
  cy.visit('http://localhost:3000/');
  //cy.url().should('contain' , 'http://localhost:3000/login');
  cy.contains('Username').click().type('student' + number);
  cy.contains('Password').click().type('pass').type('{enter}');
  cy.location('href').should('eq', 'http://localhost:3000/');

}

const professorLogin = () => {
  cy.visit('http://localhost:3000/');
  cy.url().should('contain', 'http://localhost:3000/login');
  cy.contains('Username').click().type('teacher1');
  cy.contains('Password').click().type('pass').type('{enter}');
}

function bookingManagerLogin() {

  cy.visit('http://localhost:3000/');
  cy.url().should('contain', 'http://localhost:3000/login');
  cy.contains('Username').click().type('bmanager');
  cy.contains('Password').click().type('pass').type('{enter}');

}

function addCourse(courseData) {
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addcourse/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: courseData }),


  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
  // .then((resp) => {
  //   window.localStorage.setItem('jwt', resp.body.user.token)
  // })
}

function addBooking(bookingData) {
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addbooking/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: bookingData }),


  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
  // .then((resp) => {
  //   window.localStorage.setItem('jwt', resp.body.user.token)
  // })
}




function addStudentCourse(studentcourseData) {
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addstudentcourse/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: studentcourseData }),


  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
  // .then((resp) => {
  //   window.localStorage.setItem('jwt', resp.body.user.token)
  // })
}


function addLecture(lectureData) {
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addlecture/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: lectureData }),


  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
}

function addUserForTest(userData) {
  cy.request({
    method: 'POST',
    url: "http://localhost:3000/" + APIURL + '/addUserTest/',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: userData }),


  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
}




function clearDatabase() {
  cy.request({
    method: 'DELETE',
    url: "http://localhost:3000/" + APIURL + '/cleardatabase/',

  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
}


function getTodayString() {

  var today = new Date();

  return today.toISOString().slice(0, 10) + " " + today.toISOString().slice(11, 16);

}


function getTomorrowString() {

  var today = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10) + " " + tomorrow.toISOString().slice(11, 16);

}

function getTodayPlusNString(n) {

  var today = new Date();
  var day = new Date(today);
  day.setDate(day.getDate() + n);
  return day.toISOString().slice(0, 10) + " " + day.toISOString().slice(11, 16);


}




function supportOfficerLogin() {

  cy.visit('http://localhost:3000/');
  cy.url().should('contain', 'http://localhost:3000/login');
  cy.contains('Username').click().type('Officer');
  cy.contains('Password').click().type('pass').type('{enter}');


}

function logout() {
  cy.get('#collasible-nav-dropdown > span').click();
  cy.get('.dropdown-item').click();
}


function getTodayPlusMinutesString(n) {

  var today = new Date();
  var newDateObj = moment(today).add(60 + n, 'm').toDate();
  // today.setTime(today.getTime() + n*36000);


  return newDateObj.toISOString().slice(0, 10) + " " + newDateObj.toISOString().slice(11, 16);



}


describe('[LSBT1-16]As a booking manager I want to generate a contact tracing report starting with a positive student so that we comply with safety regulations', () => {
  it('Student cancels lecture booking -> student in waiting list gets the spot', () => {
    clearDatabase()
    bookingManagerLogin()
    cy.get('[href="/tracingreport"]').click();
    cy.get('table').find('tr').should('have.length', 2)
    cy.get('button').contains('Generate Report').click()
    cy.get('.modal-body> p').should('have.text', 'The requested report has been generated');
    cy.get('a.btn.btn-primary').contains('Download CSV')//.click()
    cy.get('button.ml-1.btn.btn-primary').contains('Download PDF')//.click()
    cy.get('button.close').click()
    cy.get('input#sUserID.form-control').click().type('0').type('{enter}');
    cy.get('button').contains('Search').click()
    cy.get('table').find('tr').should('have.length', 1)
    cy.get('input#sUserID.form-control').clear()
    cy.get('button').contains('Search').click()
    cy.get('table').find('tr').should('have.length', 2)

  })
})

