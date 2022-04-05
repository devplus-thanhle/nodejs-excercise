const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const user = {
  email: "thanhle.devplus@gmail.com",
  password: "123123",
};
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE2Y2UxN2ZhZmQzM2UyOGY5Y2I1MiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0OTA0MDk2MiwiZXhwIjoxNjQ5MTI3MzYyfQ.k7WWhxrC8KednmPZfAxgv6tpNgHoCB6txu9DXc99fXY";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE1ZmViY2QwNjdkMGFlNDBkODcxMiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDkwNDE3NDksImV4cCI6MTY0OTEyODE0OX0.86QQlCjJYSTsiY4sh69BbsdrO_4EP4v3QULUMSr7X3I";
const invalidToken = "aadadsasd";

describe("Should login for a user", () => {
  // afterAll(async () => {
  //   await mongoose.connection.close();
  // });
  test("should return status 200 when email and password is true", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("Login Successfully");
  });

  test("should return status 404 when email is false", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "abcad@gmai.com",
      password: "123123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Email is not correct");
  });

  test("should return status 400 when password is false", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "thanhle.devplus@gmail.com",
      password: "1231234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Password is not correct");
  });
});

describe("Should add member for admin", () => {
  // afterAll(async () => {
  //   await mongoose.connection.close();
  // });

  test("should rerutn status 401 when invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/add-member")
      .send({
        fullname: "thanh le",
        email: "kentkillboss@gmail.com",
        password: "123123",
      })
      .set("authorization", invalidToken);
    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });
  test("should rerutn status 403 when not allowed", async () => {
    const res = await request(app)
      .post("/api/auth/add-member")
      .send({
        fullname: "thanh le",
        email: "",
        password: "123123",
      })
      .set("authorization", userToken);

    expect(res.body.msg).toBe("You are not allowed to do that");
    expect(res.statusCode).toBe(403);
  });

  test("should return status 400 when do not enter data", async () => {
    const res = await request(app)
      .post("/api/auth/add-member")
      .send({
        fullname: "",
        email: "",
        password: "",
      })
      .set("authorization", adminToken);
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Please fill all fields");
  });

  test("should return status 400 when email exist", async () => {
    const res = await request(app)
      .post("/api/auth/add-member")
      .send({
        fullname: "thanh le",
        email: "thanhle.devplus@gmail.com",
        password: "123123",
      })
      .set("authorization", adminToken);
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Email is already exists");
  });

  test("should return status 400 when password less than 6 characters", async () => {
    const res = await request(app)
      .post("/api/auth/add-member")
      .send({
        fullname: "thanh le",
        email: "thanhle1.devplus@gmail.com",
        password: "1231",
      })
      .set("authorization", adminToken);
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Password must be at least 6 characters");
  });
});
