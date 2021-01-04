const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const dao = require("../dao.js");
const sqlite = require("sqlite3");
let moment = require("moment");


let session;

const APIURL = "api";

beforeAll((done) => {
  dao.setDb("db/PULSeBS_test.db");

  request
    .post("/api/login")
    .send({ username: "student1", password: "pass" })
    .set("Accept", "application/json")
    .end((err, response) => {
      session = response.headers["set-cookie"];
      done();
    });
});

let db = new sqlite.Database("db/PULSeBS_test.db", (err) => {
  if (err) throw err;
});







describe("server rest APIs", function () {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initCourses();
    return initLectures();
  });
  afterAll(() => {
    clearCourses();
    return clearLectures();
  });

  it("getUser", async () => {
    const response = await request.get("/api/user").set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getStudentCurrentCourses", async () => {
    const response = await request
      .get("/api/getStudentCurrentCourses/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getAvailableLectures", async () => {
    const response = await request
      .get("/api/getAvailableLectures/XY0422")
      .send({ userId: "1" })
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("bookingHistory", async () => {
    const response = await request
      .get("/api/bookingHistory/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("teacher notification", async () => {
    const response = await request
      .get("/api/teacher/7/notification")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherCourses", async () => {
    const response = await request
      .get("/api/getTeacherCourses")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getCourseLectures", async () => {
    const response = await request
      .get("/api/getCourseLectures/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getLectureStudents", async () => {
    const response = await request
      .get("/api/getLectureStudents/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("makelectureonline", async () => {
    const response = await request
      .post("/api/makelectureonline/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherStats #1", async () => {
    const response = await request
      .get("/api/getTeacherStats/M/2/2020-11-01/2020-12-01/4")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherStats #2", async () => {
    const response = await request
      .get("/api/getTeacherStats/W/2/2020-11-01/2020-12-01/4")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
  it("getTeacherStats #3", async () => {
    const response = await request
      .get("/api/getTeacherStats/All/2/2020-11-01/2020-12-01/4")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getTeacherStats #3 no course", async () => {
    const response = await request
      .get("/api/getTeacherStats/All/2/2020-11-01/2020-12-01/null")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getBookingStatistics ", async () => {
    const response = await request
      .get("/api/getBookingStatistics/M/2020-11-01/2020-12-01/")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getCancellationStatistics ", async () => {
    const response = await request
      .get("/api/getCancellationStatistics/M/2020-11-01/2020-12-01/")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getCancellationStatistics ", async () => {
    const response = await request
      .get("/api/getCancellationStatistics/M/2020-11-01/2020-12-01/")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
});

describe("cancelation rest APIs", function () {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initCourses();
    initLectures();
    return initBooking();
  });
  afterAll(() => {
    clearBooking();
    clearLectures();
    return clearCourses();
  });

  it("cancelReservation", async () => {
    const response = await request
      .put("/api/cancelReservation/101/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
});

describe("officer REST API", function () {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initCourses();
    initLectures();
    return initBooking();
  });
  afterAll(() => {
    clearBooking();
    clearLectures();
    return clearCourses();
  });

  it("logout", async () => { });


  it("getAttendanceStatistics", async () => {
    const response = await request.get("/api/getAttendanceStatistics/D/2020-12-01/2020-12-18").set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getContactTracingReport", async () => {
    const response = await request.get("/api/getContactTracingReport/1").set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("getPositiveStudents", async () => {
    const response = await request.get("/api/getPositiveStudents").set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("changeLectureState", async () => {
    const response = await request
      .put("/api/changeLectureState?type=B&year=1&sem=1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

});

describe("student REST API", function () {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initCourses();
    initLectures();
    return initBooking();
  });
  afterAll(() => {
    clearBooking();
    clearLectures();
    return clearCourses();
  });

  it("logout", async () => { });

  it("getAllCourses", async () => {
    const response = await request.get("/api/getAllCourses").set("Cookie", session);
    expect(response.status).toBe(200);
  });

});

describe("teacher REST API", function () {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initCourses();
    initLectures();
    return initBooking();
  });
  afterAll(() => {
    clearBooking();
    clearLectures();
    return clearCourses();
  });

  it("updatenotification", async () => {
    const response = await request
      .put("/api/teacher/2/updatenotification")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("cancelLecture", async () => {
    const response = await request
      .post("/api/cancelLecture/2")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("updatePresence", async () => {
    const response = await request
      .post("/api/updatepresence/101/1")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
});
describe("lecture REST API", function () {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initCourses();
    initLectures();
    return initBooking();
  });
  afterAll(() => {
    clearBooking();
    clearLectures();
    return clearCourses();
  });

  it("bookLecture", async () => {
    const response = await request
      .post("/api/bookLecture")
      .send({ lectureId: "1", userId: "4", scheduleDate: "2020-12-30 15:20" })
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });

  it("bookLecture false", async () => {
    const response = await request
      .post("/api/bookLecture")
      .send({ lectureId: "2", userId: "5", scheduleDate: "2020-12-30 15:20" })
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
});

describe("Server E2E test functions" , () => {
  // beforeAll(() => {
  //   dao.clearDatabase();
    
  // });
  // afterAll(() => {
  //   dao.clearDatabase();
  // });

  it("addCourse", async () => {


    const courseData = ["1","data science","We study a lot of data science","2020",1,"John Smith"];
    
    const response = await request.post("/api/addcourse/")
    .send({data : courseData})
    .expect(200);
    
  })

    
})










///getTeacherStats/:period/:userId/:startDate/:endDate/:courseId

initLectures = () => {
  var day = moment().add(4, "d").format("yyyy-MM-DD") + " 10:00";
  var deadline = moment().add(3, "d").format("yyyy-MM-DD") + " 10:00";

  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Lecture
    (CourseId,
      Schedule,
      Room,
      BookingDeadline,
      NotificationDeadline,
      Bookable,
      LectureId,
      Canceled,
      TeacherId,
      Seats,
      NotificationAdded)
   VALUES ('XY0422','${day}', 1, '${deadline}', date("now"), 1, 1, 0, 2, 120,0),('XY0422','${day}', 1, '${deadline}', date("now"), 1, 2, 0, 2, 0,0)
    `;
    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearLectures = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Lecture
     WHERE CourseId = 'XY0422'
      `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

initBooking = () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Booking
     (BookingId,
     StudentId,
     LectureId,
     BookDate)
     VALUES (
       101,
       1,
       1,
       "2020-11-30 15:20"
      )
     `;
    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearBooking = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Booking
      WHERE BookingId >= 100 or StudentId in (2,4)
      `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

initCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO StudentCourse
   (StudentCourseId,
   CourseId,
   StudentId)
   VALUES (100, 'XY0422', 1),
   (101, 'XY0422', 4),
   (102, 'XY0422', 5);
   `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

clearCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM StudentCourse
   WHERE StudentCourseId in (100,101,102)
    `;

    db.run(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve();
      }
    });
  });
};

describe('POST /api/uploadDataCSV - upload csv data as an Officer', () => {
  const courses = `${__dirname}/testFiles/Courses.csv`;
  const enrollment = `${__dirname}/testFiles/Enrollment.csv`;
  const professors = `${__dirname}/testFiles/Professors.csv`;
  const schedule = `${__dirname}/testFiles/Schedule.csv`;
  const students = `${__dirname}/testFiles/Students.csv`;

  it("uploadDataCSV Courses", async () => {
    const response = await request
      .post("/api/uploadDataCSV")
      .attach('file', courses)
      .field('importType', 'Courses')
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
  it("uploadDataCSV Enrollment", async () => {
    const response = await request
      .post("/api/uploadDataCSV")
      .attach('file', enrollment)
      .field('importType', 'Enrollment')
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
  it("uploadDataCSV Professors", async () => {
    const response = await request
      .post("/api/uploadDataCSV")
      .attach('file', professors)
      .field('importType', 'Professors')
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
  it("uploadDataCSV Schedule", async () => {
    const response = await request
      .post("/api/uploadDataCSV")
      .attach('file', schedule)
      .field('importType', 'Schedule')
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
  it("uploadDataCSV Students", async () => {
    const response = await request
      .post("/api/uploadDataCSV")
      .attach('file', students)
      .field('importType', 'Students')
      .set("Accept", "application/json")
      .set("Cookie", session);
    expect(response.status).toBe(200);
  });
})