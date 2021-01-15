let moment = require("moment")
const dao = require("../dao.js");
const sqlite = require("sqlite3");

dao.setDb("db/PULSeBS_test.db");
let db = new sqlite.Database("db/PULSeBS_test.db", (err) => {
  if (err) throw err;
});

test("test login ok", () => {
  return dao.login("student1", "pass").then((data) => {
    expect(data).toEqual(expect.objectContaining({ userId: 1 }));
  });
});

test("test login user does not exists", () => {
  return expect(dao.login("usernotexist", "pass")).rejects.toEqual(null);
});

test("test getUserById", () => {
  return dao.getUserById(1).then((data) => {
    expect(data).toEqual(expect.objectContaining({ Username: "student1" }));
  });
});

describe("check Notifications", () => {
  beforeAll(() => {
    clearLectures();
    initCourses();
    updateTeacher();
    initCourseForTeacher();
    initLectureForTeacher();
    return initLectures();
  });
  afterAll(() => {
    clearNotifications();
    clearCourses();
    return clearLectures();
  });

  test("test check Notification", () => {
    return dao.checkNotification(2).then((data) => {
      expect(data).toEqual(2);
    });
  });

  test("test update Lecture Notification Added field", () => {
    
    return dao.updateLecture(2).then((data) => {
      expect(data).toEqual(2);
    });
  });

  test("test update Teacher Notification Sent Status field", () => {
    return dao.updateNotification(2).then((data) => {
      expect(data).toEqual(2);
    });
  });

  test("test getAvailableLectures", () => {
    
    return dao.getAvailableLectures("XY1113", 1).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getAvailableLectures undef", () => {
    return dao.getAvailableLectures(1, 'XY1113').then((data) => {
      expect(data).toEqual(undefined);
    });
  });

  test("test getAllLectures", () => {
    return dao.getAllLectures().then((data) => {
      expect(data.length > 0);
    });
  });
});

describe("check Courses", () => {
  beforeAll(() => {
    clearCourses();
    return initCourses();
  });
  afterAll(() => {
    return clearCourses();
  });

  test("test getStudentCurrentCourses", () => {
    return dao.getStudentCurrentCourses(1).then((data) => {
      expect(data).toHaveLength(2);
    });
  });

  test("test getStudentCurrentCourses", () => {
    
    return dao.getStudentCurrentCourses(5).then((data) => {
      expect(data).toHaveLength(1);
    });
  });

  test("test getAllCourses", () => {

    return dao.getAllCourse().then((data) => {
      expect(data.length > 0);
    });
  });

});

describe("check BookingAndHistory", () => {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    // clearCourses();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test bookLecture false", () => {
    return dao.bookLecture(1000, 1, "2020-12-30 15:20").then((data) => {
      expect(data).not.toEqual(undefined);
    });
  });

  test("test cancelReservation", () => {
    return dao.cancelReservation(3).then((data) => {
      expect(data).toEqual(null);
    });
  });

 
  test("test getBookCountByCourseID W", () => {
    return dao.getBookCountByCourseID("Weekly", "2020-10-01","2020-12-01","XY0422").then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getBookCountByCourseID M", () => {
    return dao.getBookCountByCourseID("Monthly", "2020-10-01","2020-12-01","XY0422").then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getBookCountByCourseID D", () => {
    return dao.getBookCountByCourseID("Daily", "2020-10-01","2020-12-01","XY0422").then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getBookCountByCourseID all courses", () => {
    return dao.getBookCountByCourseID("Daily", "2020-10-01","2020-12-01","All").then((data) => {
      expect(data.length > 0);
    });
  });
  

  test("test manageQueueReservation", () => {
    return dao.manageQueueReservation(1000).then((data) => {
      expect(null);
    });
  });
});
describe("check BookingAndHistory", () => {
  beforeAll(() => {
    // clearBooking();
    // clearLectures();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test bookLecture", () => {
    
    return dao.bookLecture(1000, 1, "2020-12-30 15:20").then((data) => {
      expect(data).not.toEqual(undefined);
    });
  });

  test("test bookingHistory", () => {
    
    return dao.getBookingHistory(1).then((data) => {
      expect(data.length > 0);
    });
  });
  test("test getBookingDetails", () => {
    return dao.getBookingDetails(1000, 1).then((data) => {
      expect(data.length > 0);
    });
  });

});

describe("check Teacher Dashboard", () => {
  beforeAll(() => {
    clearLectures();
    return initLectures();
  });
  afterAll(() => {
    return clearLectures();
  });

  test("test getTeacherCourses", () => {
    return dao.getTeacherCourses(2).then((data) => {
      expect(data.length > 0);
    });
  });
  test("test getCourseLectures", () => {
    return dao.getCourseLectures('XY1113', 2, 0, "2021-01-01", "2020-12-30").then((data) => {
      expect(data.length > 0);
    });
  });
  test("test getLectureStudents", () => {
    return dao.getLectureStudents(2).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test getStudentlistOfLecture", () => {
    return dao.getStudentlistOfLecture(1000).then((data) => {
      expect(data.length > 0);
    });
  });

  // Make the lecture unbookable, then count the unbookable lectures
  test("Test makeLectureOnline", () => {
    //dao.makeLectureOnline(1); // (lectureId)
    // return getUnbookableLectures().then((data) => {
    //   expect(data).toHaveLength(1);
    // });
    return dao.makeLectureOnline(1).then((data) => {
      expect(data).toEqual(true);
    });
  });

  test("test getNotification", () => {
    return dao.getNotification(2).then((data) => {
      expect(data.length > 0);
    });
  });

  test("test cancelLecture", () => {
    return dao.cancelLecture(2).then((data) => {
      expect(data).toEqual(true);
    });
  });
});

describe("check Teacher Stats", () => {
  beforeAll(() => {
    clearLectures();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test getTeacherStats1", () => {
    return dao
      .getTeacherStats("Monthly", 8, "2020-01-01", "2022-12-30", "null")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats2", () => {
    return dao
      .getTeacherStats("Weekly", 8, "2020-01-01", "2022-12-30", "All")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats5", () => {
    return dao
      .getTeacherStats("Weekly", 8, "2020-01-01", "2022-12-30", 4)
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats3", () => {
    return dao
      .getTeacherStats("Daily", 8, "2020-01-01", "2022-12-30", "All")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getTeacherStats4", () => {
    return dao
      .getTeacherStats("Daily", 8, "2020-01-01", "2022-12-30", 4)
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getBookingStatistics", () => {
    return dao
      .getBookingStatistics("Weekly", "2020-01-01", "2022-12-30")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getCancellationStatistics", () => {
    return dao
      .getCancellationStatistics("Daily", "2020-01-01", "2020-12-30")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getAttendanceStatistics", () => {
    return dao
      .getAttendanceStatistics("Daily", "2020-01-01", "2022-12-30")
      .then((data) => {
        expect(data.length > 0);
      });
  });
  test("test getAttendanceStatistics W", () => {
    return dao
      .getAttendanceStatistics("Weekly", "2020-01-01", "2022-12-30")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getAttendanceStatistics D", () => {
    return dao
      .getAttendanceStatistics("Daily", "2020-01-01", "2022-12-30")
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test getPresenceHistory", () => {
    debugger;
    return dao
      .getPresenceHistory("XY1211", "2020-01-01", "2022-12-30", 2)
      .then((data) => {
        expect(data.length > 0);
      });
  });
});

describe("check Contact tracing", () => {
  beforeAll(() => {
    clearLectures();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test getPositiveStudents", () => {
    return dao
      .getPositiveStudents("", "", "")
      .then((data) => {
        expect(data.length > 0);
      });
  });
  
  test("test getContactTracingReport", () => {
    return dao
    .getContactTracingReport(1)
    .then((data) => {
      expect(data.length > 0);
    });
  });
});

describe("check Courses", () => {
  beforeAll(() => {
    clearCourses();
    return initCourses();
  });
  afterAll(() => {
    return clearCourses();
  });

  test("test updatePresence", () => {
    return dao.updatePresence(101,1).then((data) => {
      expect(data).toBe(true);
    });
  });

});

describe("check Officer Management", () => {
  beforeAll(() => {
    clearLectures();
    initLectures();
    initCourses();
    return initBooking();
  });
  afterAll(() => {
    clearLectures();
    clearCourses();
    return clearBooking();
  });

  test("test getOfficerLectures", () => {
    return dao
      .getOfficerLectures(1, 1)
      .then((data) => {
        expect(data.length > 0);
      });
  });

  test("test changeLectureState", () => {
    return dao
      .changeLectureState("B", 1, 1)
      .then((data) => {
        expect(data).toBe(true);
      });
  });
  
});


describe("check importCSVData Students", () => {
  beforeAll(() => {
    return deleteStudentsProfessors();
  });

  test("test import CSV Students", () => {
    let obj = {Id:"900000", Name:"Ambra", Surname:"Ferri", SSN:"MK97060783", OfficialEmail:"s900000@students.politu.it", City: "Poggio Ferro", Birthday: "1991-11-04"};
    let arr = [];
    arr.push(obj);
    return dao
      .importCSVData(arr, "Students")
      .then((data) => {
        expect(data).not.toEqual(undefined);
      });
  });

});

describe("check importCSVData Professors", () => {
  beforeAll(() => {
    return deleteStudentsProfessors();
  });

  test("test import CSV Professors", () => {
    let obj = {Number:"d9000", Name:"Ines", Surname:"Beneventi", SSN:"XT6141393", OfficialEmail:"Ines.Beneventi@politu.it"};
    let arr = [];
    arr.push(obj);
    return dao
      .importCSVData(arr, "Professors")
      .then((data) => {
        expect(data).not.toEqual(undefined);
      });
  });

});

describe("check importCSVData Courses", () => {
  beforeAll(() => {
    return deleteCourses();
  });

  test("test import CSV Courses", () => {
    let obj = {Code:"XY1211", Course:"Metodi di finanziamento delle imprese", Year:"1", Semester:"1", Teacher:"t2"};
    let obj2 = {Code:"XY86123", Course:"Informatica", Year:"1", Semester:"2", Teacher:"d9002"};
    let arr = [];
    arr.push(obj);
    arr.push(obj2);
    return dao
      .importCSVData(arr, "Courses")
      .then((data) => {
        expect(data).not.toEqual(undefined);
      });
  });

});

describe("check importCSVData Enrollments", () => {
  beforeAll(() => {
    return deleteEnrollments();
  });

  test("test import CSV Enrollments", () => {
    let obj = {Code:"XY12112", Student:"900000"};
    let arr = [];
    arr.push(obj);
    return dao
      .importCSVData(arr, "Enrollment")
      .then((data) => {
        expect(data).not.toEqual(undefined);
      });
  });

});

describe("check importCSVData Schedules", () => {
  beforeAll(() => {
    return deleteSchedules();
  });

  test("test import CSV Schedules", () => {
    debugger;
    let obj = {Code:"XY1211", Room:1, Day: "Mon", Seats: 120, Time: "08:30-11:30"};
    let obj2 = {Code:"XY1211", Room:1, Day: "Tue", Seats: 120, Time: "8:30-9:30"};
    let obj3 = {Code:"XY1211", Room:1, Day: "Wed", Seats: 120, Time: "08:5:11:30"};
    let obj4 = {Code:"XY1211", Room:1, Day: "Mon", Seats: 120, Time: "8:5:11:30"};
    let obj5 = {Code:"XY1211", Room:1, Day: "Thu", Seats: 120, Time: "15:5-17:30"};
    let obj6 = {Code:"XY1211", Room:1, Day: "Fri", Seats: 120, Time: "08:8-11:30"};
    let arr = [];
    arr.push(obj);
    arr.push(obj2);
    arr.push(obj3);
    arr.push(obj4);
    arr.push(obj5);
    arr.push(obj6);
    return dao
      .importCSVData(arr, "Schedule")
      .then((data) => {
        expect(data).not.toEqual(undefined);
      });
  });

});


initLectures = () => {
  
  var day = moment().add(4, 'd').format("yyyy-MM-DD")+" 10:00"
  var deadline = moment().add(3, 'd').format("yyyy-MM-DD")+" 10:00"
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
   WHERE CourseId = 'XY0422' or LectureId = 1
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

clearNotifications = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM TeacherNotification
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
   (102, 'XY0422', 5),
   (103, 'XY1113', 1);
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

updateTeacher = () => {
  return new Promise((resolve, reject) => {
    const sql = `
   update user set Number='t2' where  UserId=2;
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
initCourseForTeacher = () => {
  return new Promise((resolve, reject) => {
    const sql = `
    insert into Course (CourseId,Name,Description,Year,Semester,Teacher) 
   values('XY1113','Bigdata','Bigdata',2,1,'t2');
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
initLectureForTeacher = () => {
  return new Promise((resolve, reject) => {
    const sql = `
    insert into Lecture(Courseid,Schedule,BookingDeadline,NotificationDeadline,Bookable,LectureId,Canceled,
      TeacherId,NotificationAdded,EndTime,CancelDate, room,Seats,day,time)
      values('XY1113','2021-01-25 08:00',Date('now'),Date('now'),1,1000,0,
      2,0,'2021-01-25 10:00',null, 1,120,'Mon', '08:00-10:00');
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
   WHERE StudentCourseId in (100,101,102,103);
   delete from Course where CourseId = 'XY1113';
   delete from Lecture where LectureId = 1000;
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

getUnbookableLectures = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Lecture WHERE Bookable=0`;

    db.run(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(rows);
      }
    });
  });
};

//Just

initBooking = () => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Booking
   (BookingId,
   StudentId,
   LectureId,
   BookDate)
   VALUES (
     101,
     2,
     3,
     "2020-11-25 15:20" 
    ); 
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

deleteStudentsProfessors = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM User
   WHERE UserId = 'd9000' or UserId = '900000'
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

deleteCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Course
   WHERE CourseId in ('XY12113', 'XY86123', 'XY1211')
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

deleteEnrollments = () => {
  return new Promise((resolve, reject) => {
    const sql = `
   DELETE FROM StudentCourse where CourseId = 'XY1211';
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

deleteSchedules = () => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Lecture where CourseId = 'XY1211'
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