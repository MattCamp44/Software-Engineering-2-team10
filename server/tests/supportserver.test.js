const app = require("../server");
const supertest = require("supertest");
const request = supertest(app);
const dao = require("../dao.js");
const sqlite = require("sqlite3");
let moment = require("moment");

let session;



beforeAll((done) => {
    dao.setDb("db/PULSeBS_test_clear.db");
})



let db = new sqlite.Database("db/PULSeBS_test_clear.db", (err) => {
    if (err) throw err;
  });



  describe("Server E2E test functions" , () => {
    beforeAll(() => {
      dao.clearDatabase();
      
    });
    afterAll(() => {
      dao.clearDatabase();
    });
  
    it("addCourse", async () => {
  
  
      const courseData = [5345,"Computer Networks","We study a lot of network","2020",1,"John Smith"];
      const response = await request.post("/api/addcourse/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ data: courseData }),
      })
      expect(response.status).toBe(200);
  
  
    })
  
  
  })

