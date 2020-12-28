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


function getTodayPlusMinutesString(n){

  var today = new Date();
  var newDateObj = moment(today).add(60 + n, 'm').toDate();
  // today.setTime(today.getTime() + n*36000);
  
  
  return newDateObj.toISOString().slice(0,10) + " " + newDateObj.toISOString().slice(11,16);



}





describe('[LSBT1-3]As a teacher I want to access the list of students booked for my lectures so that I am informed' , () => {
  
  it("Professor cannot cancel a lecture scheduled for earlier than 1h" , () => {
    clearDatabase();
    //(CourseId,Name,Description,Year,Semester,Teacher)
    const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];
  
    addCourse(courseData);
    
    //(StudentCourseId,CourseId,StudentId)
    var studentcourseData = [1,1,1];
  
    addStudentCourse(studentcourseData);
  
    studentcourseData = [2,1,3];
    addStudentCourse(studentcourseData);
    
    
    const tomorrowstring = getTomorrowString();
    const todaystring = getTodayString();
    
    
    // const deadlinestring = deadline.toISOString().slice(0,16);
    const deadlinestring = getTodayPlusNString(5);
    
    // In more than one hour
    const todayplusminutesstring = getTodayPlusMinutesString(55);
  
  
   
    const lectureData = [1,todayplusminutesstring, todaystring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
  
    addLecture(lectureData);
  
    professorLogin();
  
    cy.get('.btn > .svg-inline--fa').click();

    cy.get('#bg-nested-dropdown').click();

    cy.get('.dropdown-menu > :nth-child(2)').should('have.attr', 'disabled');

    

    })
  

})

