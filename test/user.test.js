const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const student = {
  id: "62415febcd067d0ae40d8712",
};
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE1ZmViY2QwNjdkMGFlNDBkODcxMiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0ODYyNDIzMywiZXhwIjoxNjQ4NzEwNjMzfQ.C955pGNQgZQudtXh-gbwUuu-I9a9bpzBECMk9hNHsDk";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDJiNDIxOWU1NGE4OWMwMzU3MjJjZCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDg2MjQ5MzMsImV4cCI6MTY0ODcxMTMzM30.zQcgcARpRLNRqKUwMkSq_ZmNCKC4HZrlpS3UQ0-ByyA";
const standardToken = "adadadadadad";
const incorrectToken =
  "qweqbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE2Y2UxN2ZhZmQzM2UyOGY5Y2I1MiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0ODQ2MjQyOSwiZXhwIjoxNjUxMDU0NDI5fQ.ZfN4t3FTkvfjuAKOfNLI6DS1cE6jm_HTlj4qtoleJdE";

describe("Get member ", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should return status 200 when studenId true", async () => {
    const res = await request(app)
      .get(`/api/auth/get-member/${student.id}`)
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("User found");
  });

  test("should return status 401 when without auth", async () => {
    const res = await request(app).get(`/api/auth/get-member/${student.id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });

  test("should return status 403 when not allowed", async () => {
    const res = await request(app)
      .get(`/api/auth/get-member/${student.id}`)
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });

  test("should return status 500 when jwt incorrect", async () => {
    const res = await request(app)
      .get(`/api/auth/get-member/${student.id}`)
      .set("authorization", incorrectToken);

    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe("invalid token");
  });

  test("should return status 500 when jwt not standard", async () => {
    const res = await request(app)
      .get(`/api/auth/get-member/${student.id}`)
      .set("authorization", standardToken);

    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe("jwt malformed");
  });
});
