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

    it('Student gets reservation', () =>
    {  clearDatabase();
          
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
          const tomorrowstring = tomorrow.toISOString().slice(0,2);
    
          const deadline = new Date(today);
          deadline.setDate(deadline.getDate() + 5);
    
          const deadlinestring = deadline.toISOString().slice(0,16);
          
    
    
          //(CourseId, Schedule,BookingDeadline, NotificationDeadline, EndTime,Bookable, Canceled, TeacherId, NotificationAdded, Room ,Seats, Day, Time)
          const lectureData = [1,"2020-12-26 08:30", "2020-12-31 08:30", "2020-12-28 11:30", "2020-12-26 11:30"  , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
    
          addLecture(lectureData);
    
          cy.visit("http://localhost:3000/");
          studentLogin(1);
          cy.contains(courseData[2]).click();
          cy.contains(courseData[5]); //click();
          cy.get('.btn').should('have.text', 'Book').click();
          cy.get('Button').contains('Yes').click();
          cy.get('Button').contains('Ok').click();
          //Logout
          cy.get('#collasible-nav-dropdown > span').click();
          cy.get('.dropdown-item').click();
          studentLogin(2);
          cy.get('h3').should('have.text', 'data science').click();
          cy.get('tbody > tr > :nth-child(4)').should('have.text','0');
          cy.get('.btn').should('have.text','Reserve').click();
          cy.get('.react-confirm-alert-body > h1').should('have.text','Warning');
          cy.get('.react-confirm-alert-button-group > :nth-child(1)').should('have.text', 'Yes').click();
          cy.get('.custom-ui-warning > :nth-child(3)').should('have.text','you\'re now in the waiting list.');
          cy.get('.custom-ui-warning > button').should('have.text','Ok').click();
    
    
          //Does not work, maybe has been taken away?
    
          cy.get('.btn').should('have.text','Waiting list');
    })



    
    it('Student cancels lecture booking -> student in waiting list gets the spot', () => {
        //Logout
        cy.get('#collasible-nav-dropdown > span').click();
        cy.get('.dropdown-item').click();
        studentLogin(1);
        cy.get('.card1').click();
        cy.get('[href="/BookingHistory"]').click();
        cy.get(':nth-child(11) > .fc-timegrid-slot-lane');
        cy.scrollTo('top');
        cy.get('.fc-event-title').should('have.text', "data science" );
        cy.get('input').click();
        cy.get('.react-confirm-alert-body').should('have.text', "WarningDo you want to cancel the reservation for this lecture?YesNo");
        cy.get('.react-confirm-alert-button-group > :nth-child(1)').click();
        cy.get('#collasible-nav-dropdown > span').click();
        cy.get('.dropdown-item').click();
        studentLogin(2);
        cy.get('[href="/BookingHistory"]').click();
        cy.get(':nth-child(11) > .fc-timegrid-slot-lane');
        cy.scrollTo('top');
        cy.get('.fc-event-title').should('have.text', "data science" );
    })
  
  
  
  
  })