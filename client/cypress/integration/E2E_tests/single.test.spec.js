const { findIconDefinition } = require("@fortawesome/fontawesome-svg-core");
const moment = require("moment");

const APIURL = "api";






const studentLogin = (number) => {
    cy.visit('http://localhost:3000/');
    //cy.url().should('contain' , 'http://localhost:3000/login');
    cy.contains('Username').click().type('student'+number);
    cy.contains('Password').click().type('pass').type('{enter}');
    cy.location('href').should('eq','http://localhost:3000/');
    
}

const professorLogin = () => {
  cy.visit('http://localhost:3000/');
  cy.url().should('contain' , 'http://localhost:3000/login');
  cy.contains('Username').click().type('teacher1');
  cy.contains('Password').click().type('pass').type('{enter}');
  
}



function addCourse(courseData){
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

function addBooking(bookingData){
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




function addStudentCourse(studentcourseData){
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


function addLecture(lectureData){
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




function clearDatabase(){
  cy.request({
    method: 'DELETE',
    url:"http://localhost:3000/" + APIURL + '/cleardatabase/',
    
  }).then(
    (response) => {
      expect(response.status).to.eq(200);
      console.log(response);
    }
  )
}


function getTodayString(){
  
  var today = new Date();

  return today.toISOString().slice(0,10) + " " + today.toISOString().slice(11,16);

}


function getTomorrowString(){

  var today = new Date();
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate()+1);
  return tomorrow.toISOString().slice(0,10) + " " + tomorrow.toISOString().slice(11,16);

}

function getTodayPlusNString(n){

  var today = new Date();
  var day = new Date(today);
  day.setDate(day.getDate()+n);
  return day.toISOString().slice(0,10) + " " + day.toISOString().slice(11,16);


}




function supportOfficerLogin(){

  cy.visit('http://localhost:3000/');
  cy.url().should('contain' , 'http://localhost:3000/login');
  cy.contains('Username').click().type('Officer');
  cy.contains('Password').click().type('pass').type('{enter}');


}

function logout(){
  cy.get('#collasible-nav-dropdown > span').click();
  cy.get('.dropdown-item').click();
}








describe('[LSBT1-3]As a teacher I want to access the list of students booked for my lectures so that I am informed' , () => {
  
  it("Support officer updates bookable lectures", () => {

    clearDatabase();
      
    //(CourseId,Name,Description,Year,Semester,Teacher)
    const courseData = [1,"data science","We study a lot of data science",1,1,"John Smith"];
    const tomorrowstring = getTomorrowString();
    const todaystring = getTodayString();
      
      
      // const deadlinestring = deadline.toISOString().slice(0,16);
    const deadlinestring = getTodayPlusNString(5);
      
  
  
  
     
    const lectureData = [1,todaystring, deadlinestring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];

    addLecture(lectureData);
    addCourse(courseData);

    var studentcourseData = [1,1,1];
    
    addStudentCourse(studentcourseData);

    supportOfficerLogin();
    cy.get('[href="/officer/lectureManagement"]').click();
    cy.get('.btn').click();
    cy.get('.react-confirm-alert-button-group > :nth-child(1)').click();
    logout();
    studentLogin(1);
    cy.get('.card1').click();
    cy.get('td').should('have.text', 'No lecture available, please select one course.');
  })


})

