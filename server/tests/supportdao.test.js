const dao = require("../dao.js");
const sqlite = require("sqlite3");

dao.setDb("db/PULSeBS_test_clear.db");
let db = new sqlite.Database("db/PULSeBS_test_clear.db", (err) => {
  if (err) throw err;
});




describe("dao test functions", () => {
    beforeAll(() => {
      dao.clearDatabase();
      
    });
    afterAll(() => {
    dao.clearDatabase();    
        
    });
    test("test addCourse", () => {
      const courseData = [1,"data science","We study a lot of data science","2020",1,"John Smith"];
  
      dao.addCourse(courseData).then(
        (data) => {
          expect(data === null);
        }
      )
  
    })//test
    
    test("test addCourse with null input", () => {
  
      dao.addCourse(null).then(
        (data) => {
          expect(data === null);
        }
      )
  
    })//test
  
    test("test clearDatabase",() => {
  
      dao.clearDatabase().then(
        (data) => {
          expect(data === null);
        }
      )
  
  
    })
  
    test("test addBooking", () => {
  
      //(BookingId,StudentId,LectureId,Presence,Canceled,Reserved,CancelDate,ReserveDate,BookDate)
  
      const bookingData = [1,1,1,null,0,0,"2020-01-10","2020-01-10","2020-01-10"];
  
      dao.addBooking(bookingData).then(
        (data) => {
          expect(data === null);
        }
      )
  
  
    })
  
  
    test("test addStudentCourse", () => {
  
      const studentCourseData = [1,1,1];
  
      dao.addStudentCourse(studentCourseData).then(
        (data) => {
          expect(data === null);
        }
      )
  
  
    })
    
    test("test addLecture", () => {
  
      const lectureData = [1,"2020-01-10","2020-01-10","2020-01-10","2020-01-10",1,0,1,0,1,1,"Mon","2020-01-10"];
  
      dao.addLecture(lectureData).then(
        (data) => {
          expect(data === null);
        }
      )
  
  
    })
  
  
  
  
  }) //describe



  db.close();