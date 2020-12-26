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


















describe('[LSBT1-14]As a student in the waiting list I want to be added to the list of students booked when someone cancels their booking so that I can attend the lecture' , () => {

    it('Students books lecture then cancels reservation',  () => {
        clearDatabase();
          
          //(CourseId,Name,Description,Year,Semester,Teacher)
          const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];
    
          addCourse(courseData);
          
          //(StudentCourseId,CourseId,StudentId)
          var studentcourseData = [1,1,1];
    
          addStudentCourse(studentcourseData);
    
          studentcourseData = [2,1,3];
          addStudentCourse(studentcourseData);
          new Date().toLocaleDateString(
            'en-gb',
            {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            }
          );
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate()+1);
          // const tomorrowstring = tomorrow.toISOString().slice(0,2);
          const tomorrowstring = tomorrow.toISOString().slice(0,10) + " " + tomorrow.toISOString().slice(11,16);
          const todaystring = today.toISOString().slice(0,10) + " " + today.toISOString().slice(11,16);
          
          const deadline = new Date(today);
          deadline.setDate(deadline.getDate() + 5);
      
          // const deadlinestring = deadline.toISOString().slice(0,16);
          const deadlinestring = deadline.toISOString().slice(0,10) + " " + deadline.toISOString().slice(11,16);
          
      
      
      
            console.log(tomorrowstring);
            console.log(deadlinestring);
            console.log(new Date(tomorrowstring));
          const lectureData = [1,tomorrowstring, deadlinestring, deadlinestring, tomorrowstring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
    
          addLecture(lectureData);
    
          cy.visit("http://localhost:3000/");
          studentLogin(1);
          cy.contains(courseData[2]).click();
          cy.contains(courseData[5]); //click();
          cy.get('.btn').should('have.text', 'Book').click();
          cy.get('Button').contains('Yes').click();
          cy.get('Button').contains('Ok').click();
          cy.get('[href="/BookingHistory"]').click();
          cy.get('input').click();
          cy.get('.react-confirm-alert-body').should('have.text', "WarningDo you want to cancel the reservation for this lecture?YesNo");
          cy.get('.react-confirm-alert-button-group > :nth-child(1)').click();
          cy.get('.navbar-brand').click();
          cy.get('.card1').click();
          cy.get('.btn').should('have.text', 'Book');

      })
  
  
  
  
  })