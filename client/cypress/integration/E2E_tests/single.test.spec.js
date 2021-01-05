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




describe('[LSBT1-11]As a booking manager I want to monitor usage (booking, cancellations, attendance) of the system', () => {

  it('Booking Check', () => {
    clearDatabase()
    const courseData = [1, "data science", "We study a lot of data science", "2020", 1, "John Smith"]
    addCourse(courseData)
    const studentcourseData = [1, 1, 1]
    addStudentCourse(studentcourseData)
    const todaystring = getTodayString()
    const tomorrowstring = getTomorrowString()
    const deadlinestring = getTodayPlusNString(5)
    const lectureData = [1, todaystring, deadlinestring, deadlinestring, todaystring, 1, 0, 2, 0, 1, 120, "Mon", "8:30-11:30"]

    addLecture(lectureData)

    cy.visit("http://localhost:3000/")
    studentLogin(1);
    cy.contains(courseData[2]).click()
    cy.contains(courseData[5])
    cy.get('Button').contains('Book').click()
    cy.get('Button').contains('Yes').click()
    cy.get('Button').contains('Ok').click()
    logout()
    bookingManagerLogin();
    cy.get('select')
      .should('have.value', 'Monthly')
    cy.get('select').select('Weekly')
    cy.get('table').contains('th', 'Weekly').should('be.visible')
    cy.get('table').contains('th', 'Average').should('be.visible')

    cy.get('select').select('Monthly')
    cy.get('table').contains('th', 'Monthly').should('be.visible')
    cy.get('table').contains('th', 'Average').should('be.visible')

    cy.get('select').select('Daily')
    cy.get('table').contains('th', 'Daily').should('be.visible')
    cy.get('table').contains('th', 'Count').should('be.visible')

    cy.get('Button').contains('Booking').click()
    cy.get('table').find('tr').find('td').contains("1")
    cy.get('table').find('tr').should('have.length', 2)
    cy.get('Button').contains('Cancelletion').click()
    cy.get('table').find('tr').should('have.length', 1)
    cy.get('Button').contains('Attendance').click()
    cy.get('table').find('tr').find('td').contains("0")
    cy.get('table').find('tr').should('have.length', 2)
  })
  it('Cancelletion Check', () => {
    logout()

    cy.visit("http://localhost:3000/");
    studentLogin(1);
    cy.get('[href="/BookingHistory"]').click();
    cy.get('input').click();
    cy.get('.react-confirm-alert-body').should('have.text', "WarningDo you want to cancel the reservation for this lecture?YesNo");
    cy.get('.react-confirm-alert-button-group > :nth-child(1)').click();
    cy.get('.navbar-brand').click();
    cy.get('.card1').click();
    cy.get('.btn').should('have.text', 'Book');
    logout()
    bookingManagerLogin();
    cy.get('select').select('Daily')


    cy.get('Button').contains('Booking').click()
    cy.get('table').find('tr').should('have.length', 1)
    cy.get('Button').contains('Cancelletion').click()
    cy.get('table').find('tr').find('td').contains("1")
    cy.get('table').find('tr').should('have.length', 2)
    cy.get('Button').contains('Attendance').click()
    cy.get('table').find('tr').should('have.length', 1)
  })
})

