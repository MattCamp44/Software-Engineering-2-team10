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















describe('[LSBT1-3]As a teacher I want to access the list of students booked for my lectures so that I am informed' , () => {
  
  it('Student 1 books lecture', () => {
      
    clearDatabase();
    
    const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];
    
    addCourse(courseData);
    
    const studentcourseData = [1,1,1];

    addStudentCourse(studentcourseData);

    
    
    const todaystring = getTodayString();
    
    const tomorrowstring = getTomorrowString();
    

    const deadlinestring = getTodayPlusNString(5);
    


    
     
    const lectureData = [1,todaystring, deadlinestring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
       
    addLecture(lectureData);
    
    cy.visit("http://localhost:3000/");
    studentLogin(1);
    cy.contains(courseData[2]).click();
    cy.contains(courseData[5]); //click();
    cy.get('Button').contains('Book').click();
    cy.get('Button').contains('Yes').click();
    cy.get('Button').contains('Ok').click();
    //logout
    cy.get('#collasible-nav-dropdown > span').click();
    cy.get('.dropdown-item').click();
  })
  
  it('Student 2 books lecture', () => {
    
    const courseData = [1,"data science","We study a lot of data science","2020",1,"Joe Simone"];
    
    const studentcourseData = [2,1,3];
    addStudentCourse(studentcourseData);
    
    cy.visit("http://localhost:3000/");
    studentLogin(2);
    cy.contains(courseData[2]).click();
    cy.contains(courseData[5]); //click();
    cy.get('Button').contains('Book').click();
    cy.get('Button').contains('Yes').click();
    cy.get('Button').contains('Ok').click();
  })


  it('Professor checks list of students', ()=>{

    professorLogin();
    cy.get('.btn > .svg-inline--fa > path').click();
    cy.get('.d-inline-flex > :nth-child(2)').click();
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'Alex Sandro');
    cy.get('tbody > :nth-child(2) > :nth-child(1)').should('have.text', 'John Smith');

  })


})