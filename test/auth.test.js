const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const user = {
  email: "thanhle.devplus@gmail.com",
  password: "123123",
};

describe("Should login for a user", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });
  test("should return status 200 when email and password is true", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("Login successful");
  });

  test("should return status 404 when email is false", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "abcad@gmai.com",
      password: "123123",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Email not found");
  });

  test("should return status 404 when password is false", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "thanhle.devplus@gmail.com",
      password: "1231234",
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Invalid password");
  });
});

describe("Should add member for admin", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });
  //code here
});
