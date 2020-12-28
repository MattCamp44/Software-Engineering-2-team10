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


function getTodayPlusMinutesString(n){

  var today = new Date();
  var newDateObj = moment(today).add(60 + n, 'm').toDate();
  // today.setTime(today.getTime() + n*36000);
  
  
  return newDateObj.toISOString().slice(0,10) + " " + newDateObj.toISOString().slice(11,16);



}



//Stories
// 1 OK
// 2 OK
// 3 OK
// 4  (how? Email?)
// 5 OK
// 6 OK
// 7 OK (check button is disabled??)
// 8  (how? Email?)
// 9  
// 10
// 11
// 12
// 13 OK
// 14 OK
// 15
// 16
// 17 OK
// 18
// 19








describe('[LSBT1-1]As a student I want to book a seat for one of my lectures so that I can attend it', () =>{

  
    it('Student books a lecture', () => {
      
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
    })

    it('Student cannot book a lecture scheduled in more than 2 weeks', () => {
      
      clearDatabase();
      
      const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];

      addCourse(courseData);
      
      const studentcourseData = [1,1,1];

      addStudentCourse(studentcourseData);
      
      
      
      
      const schedulestring = getTodayPlusNString(20);

      const deadlinestring =  getTodayPlusNString(20);
      


        
      const lectureData = [1,schedulestring, deadlinestring, deadlinestring, schedulestring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
         
      addLecture(lectureData);
      
      cy.visit("http://localhost:3000/");
      studentLogin(1);
      cy.contains(courseData[2]).click();
      cy.contains(courseData[5]); //click();
      cy.get('td').should('have.text','No lecture available, please select one course.');
    })

    
})




describe('[LSBT1-2]As a teacher I want to get notified of the number of students attending my next lecture so that I am informed' , () => {

  it('Student books a lecture then teacher receives notification', () => {
      
    clearDatabase();
    
    const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];

    addCourse(courseData);
    
    const studentcourseData = [1,1,1];

    addStudentCourse(studentcourseData);




    
    // const tomorrowstring = tomorrow.toISOString().slice(0,2);
    const tomorrowstring = getTomorrowString();
    const todaystring = getTodayString();
    
    

    // const deadlinestring = deadline.toISOString().slice(0,16);
    const deadlinestring = getTodayPlusNString(1);
    const nowstring =getTodayString();


    // (CourseId, Schedule, BookingDeadline, NotificationDeadline, EndTime, Bookable, Canceled, TeacherId, NotificationAdded, Room ,Seats, Day, Time)
    
    const lectureData = [1,todaystring, deadlinestring, nowstring, todaystring , 1, 0, 2, 0, 1, 120, "Mon",  "8:30-11:30"];
       
    addLecture(lectureData);
    
    cy.visit("http://localhost:3000/");
    studentLogin(1);
    cy.contains(courseData[2]).click();
    cy.contains(courseData[5]); //click();
    cy.get('Button').contains('Book').click();
    cy.get('Button').contains('Yes').click();
    cy.get('Button').contains('Ok').click();
    cy.get('#collasible-nav-dropdown > span').click();
    cy.get('.dropdown-item').click();

    professorLogin();
    cy.get('[href="/notification"] > .svg-inline--fa').click();
    cy.get('tbody > .text-center > :nth-child(1)').should('have.text', courseData[1]);
    cy.get('tbody > .text-center > :nth-child(3)').should('have.text', '1');
  })




})


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

describe('[LSBT1-4]As a student I want to get an email confirmation of my booking so that I am informed' , () => {

  



})

describe('[LSBT1-5]As a student I want to cancel my booking so that I am free' , () => {

  it('Students books lecture then cancels his booking' , () => {
    clearDatabase();
          
          //(CourseId,Name,Description,Year,Semester,Teacher)
          const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];
    
          addCourse(courseData);
          
          //(StudentCourseId,CourseId,StudentId)
          var studentcourseData = [1,1,1];
    
          addStudentCourse(studentcourseData);
    
          studentcourseData = [2,1,3];
          addStudentCourse(studentcourseData);
          
         
          // const tomorrowstring = tomorrow.toISOString().slice(0,2);
          const tomorrowstring = getTomorrowString();
          
      
          // const deadlinestring = deadline.toISOString().slice(0,16);
          const deadlinestring = getTodayPlusNString(5);
          
          const todaystring = getTodayString();
      

            
          const lectureData = [1,todaystring, deadlinestring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
    
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

describe('[LSBT1-6]As a student I want to access a calendar with all my bookings for the upcoming weeks' , () => {

  it("Student books lecture and checks calendar", () => {

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
      
  
  
  
     
      const lectureData = [1,todaystring, deadlinestring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];

      addLecture(lectureData);

      cy.visit("http://localhost:3000/");
      studentLogin(1);
      cy.contains(courseData[2]).click();
      cy.contains(courseData[5]); //click();
      cy.get('.btn').should('have.text', 'Book').click();
      cy.get('Button').contains('Yes').click();
      cy.get('Button').contains('Ok').click();
      cy.get('[href="/BookingHistory"]').click();
      cy.get('.fc-event-title').should('have.text', courseData[1]);


  })




})

describe('[LSBT1-7]As a teacher I want to cancel a lecture up to 1h before its scheduled time' , () => {


  it("Professor cancels a lecture scheduled for later than 1h" , () => {
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
    const todayplusminutesstring = getTodayPlusMinutesString(65);
  
  
   
    const lectureData = [1,todayplusminutesstring, todaystring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
  
    addLecture(lectureData);
  
    professorLogin();
  
    cy.get('.btn > .svg-inline--fa').click();

    cy.get('#bg-nested-dropdown').click();

    cy.get('.dropdown-menu > :nth-child(2)').click();

    cy.get('.react-confirm-alert-body').should('have.text', `WarningAre you sure you want to cancel lecture scheduled on ${todayplusminutesstring}?YesNo`);

    cy.get('.react-confirm-alert-button-group > :nth-child(1)').click();


    //cannot click here I guess??
    // cy.get(':nth-child(3) > .form-control').select(':nth-child(3) > .form-control');

    })


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


    //I should check that it is greyed out
    cy.get('.dropdown-menu > :nth-child(2)');

   

    })


})

describe('[LSBT1-8]As a student I want to get notified when a lecture is cancelled' , () => {
})

describe('[LSBT1-9]As a teacher I want to turn a presence lecture into a distance one up to 30 mins before its scheduled time' , () => {

  it("Professor turns a lecture scheduled for later than 30 minutes online" , () => {
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
    const todayplusminutesstring = getTodayPlusMinutesString(35);
  
  
   
    const lectureData = [1,todayplusminutesstring, todaystring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
  
    addLecture(lectureData);
  
    professorLogin();
  
    cy.get('.btn > .svg-inline--fa').click();

    cy.get('#bg-nested-dropdown').click();

    cy.get('.dropdown-menu > :nth-child(1)').click();

    cy.get('.react-confirm-alert-body').should('have.text', `WarningAre you sure you want to make lecture scheduled on ${todayplusminutesstring} online?YesNo`);
    cy.get('.react-confirm-alert-button-group > :nth-child(1)').click();
    cy.get('tbody > tr > :nth-child(4)').should('have.text', 'No');
    //cannot click here I guess??
    // cy.get(':nth-child(3) > .form-control').select(':nth-child(3) > .form-control');

    })


  it("Professor cannot turn a lecture scheduled for earlier than 30 minutes online" , () => {
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
    const todayplusminutesstring = getTodayPlusMinutesString(25);
  
  
   
    const lectureData = [1,todayplusminutesstring, todaystring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];
  
    addLecture(lectureData);
  
    professorLogin();
  
    cy.get('.btn > .svg-inline--fa').click();

    cy.get('#bg-nested-dropdown').click();
    cy.get('thead > tr > :nth-child(4)').click();
    cy.get('tbody > tr > :nth-child(4)').should('have.text', 'Yes');
   

    })



})

describe('[LSBT1-10]As a teacher I want to access the historical data about bookings so that I can plan better' , () => {
})

describe('[LSBT1-11]As a booking manager I want to monitor usage (booking, cancellations, attendance) of the system' , () => {
})

describe('[LSBT1-12]As a support officer I want to upload the list of students, courses, teachers, lectures, and classes to setup the system' , () => {








})

describe('[LSBT1-13]As a student I want to be put in a waiting list when no seats are available in the required lecture' , () => {

  it('Student gets reservation', () =>
{  
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
      
  
  
  
     
      const lectureData = [1,todaystring, deadlinestring, deadlinestring, todaystring , 1, 0, 2, 0, 1, 1, "Mon",  "8:30-11:30"];

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



      cy.get('.btn').should('have.text','Waiting list');
}

 )}
)

describe('[LSBT1-14]As a student in the waiting list I want to be added to the list of students booked when someone cancels their booking so that I can attend the lecture' , () => {

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

describe('[LSBT1-15]As a student I want to get notified when I am taken from the waiting list so that I can attend the lecture' , () => {
})

describe('[LSBT1-16]As a booking manager I want to generate a contact tracing report starting with a positive student so that we comply with safety regulations' , () => {
})

describe('[LSBT1-17]As a support officer I want to update the list of bookable lectures' , () => {

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
describe('[LSBT1-18]As a teacher I want to record the students present at my lecture among those booked so that I can keep track of actual attendance' , () => {
})
describe('[LSBT1-19]As a teacher I want to access the historical data about presence so that I can assess the course' , () => {
})
