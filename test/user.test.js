const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const student = {
  id: "62415febcd067d0ae40d8712",
};
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE2Y2UxN2ZhZmQzM2UyOGY5Y2I1MiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0OTM4MDcxOCwiZXhwIjoxNjUwNjc2NzE4fQ.4tZPjOCNq92q7U9vZgTbUflYoQFvxixvfVyfg0WZ2hQ";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE1ZmViY2QwNjdkMGFlNDBkODcxMiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDkzODA3NTAsImV4cCI6MTY1MDY3Njc1MH0.dqnukddWCuE1_d55OJivAWghv7wgz80V486vNfmkmQQ";
const standardToken = "adadadadadad";
const incorrectToken =
  "qweeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE2YzhlN2ZhZmQzM2UyOGY5Y2I0OSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDg2OTIzODAsImV4cCI6MTY0ODc3ODc4MH0.7XvBmjvzpgE5CLOnWXhSxAF7Ip-M6K0BCK4e3RiGIvc";

describe("Get member ", () => {
  // afterAll(async () => {
  //   await mongoose.connection.close();
  // });

  test("should return status 404 when wrong ID", async () => {
    const res = await request(app)
      .get(`/api/user/get-member/qweqweqwe`)
      .set("authorization", adminToken);

    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Id not found");
  });

  test("should return status 200 when studenId true", async () => {
    const res = await request(app)
      .get(`/api/user/get-member/${student.id}`)
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("User found");
  });

  test("should return status 401 when without auth", async () => {
    const res = await request(app).get(`/api/user/get-member/${student.id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });

  test("should return status 403 when not allowed", async () => {
    const res = await request(app)
      .get(`/api/user/get-member/${student.id}`)
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });

  test("should return status 500 when jwt incorrect", async () => {
    const res = await request(app)
      .get(`/api/user/get-member/${student.id}`)
      .set("authorization", incorrectToken);

    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe("invalid token");
  });

  test("should return status 500 when jwt not standard", async () => {
    const res = await request(app)
      .get(`/api/user/get-member/${student.id}`)
      .set("authorization", standardToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });
});

describe("Get all members", () => {
  test("should return status 200", async () => {
    const res = await request(app)
      .get(`/api/user/get-all-member`)
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("Users found");
  });

  test("should return status 401 when without auth", async () => {
    const res = await request(app).get(`/api/user/get-all-member`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });

  test("should return status 403 when not allowed", async () => {
    const res = await request(app)
      .get(`/api/user/get-all-member`)
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });

  test("should return status 500 when jwt incorrect", async () => {
    const res = await request(app)
      .get(`/api/user/get-all-member`)
      .set("authorization", incorrectToken);

    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toBe("invalid token");
  });

  test("should return status 500 when jwt not standard", async () => {
    const res = await request(app)
      .get(`/api/user/get-all-member`)
      .set("authorization", standardToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });
});

describe("Update member", () => {
  test("should return status 401 when without auth ", async () => {
    const res = await request(app).patch(`/api/user/update/${student.id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });
  test("should rerutn status 403 when not allowed", async () => {
    const res = await request(app)
      .patch(`/api/user/update/${student.id}`)
      .send({
        fullname: "thanh le",
        email: "thanhle.devplus@gmail.com",
        password: "123123",
      })
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });

  test("should return status 400 when do not enter data", async () => {
    const res = await request(app)
      .patch(`/api/user/update/${student.id}`)
      .send({
        fullname: "",
        email: "",
        password: "",
      })
      .set("authorization", adminToken);
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Please fill all fields");
  });

  test("should return status 400 when invalid email", async () => {
    const res = await request(app)
      .patch(`/api/user/update/${student.id}`)
      .send({
        fullname: "thanh le",
        email: "thanhle1.devplus",
        password: "1231",
      })
      .set("authorization", adminToken);
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Please enter a valid email");
  });

  test("should return status 400 when password less than 6 characters", async () => {
    const res = await request(app)
      .patch(`/api/user/update/${student.id}`)
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

describe("isAdmin", () => {
  test("should return status 401 when without auth ", async () => {
    const res = await request(app).post(`/api/user/is-admin/${student.id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });
  test("should rerutn status 403 when not allowed", async () => {
    const res = await request(app)
      .post(`/api/user/is-admin/${student.id}`)
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });
  test("should rerutn status 400 when user is admin", async () => {
    const res = await request(app)
      .post(`/api/user/is-admin/62416ce17fafd33e28f9cb52`)
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("User is already admin");
  });
});

describe("isAdmin", () => {
  test("should return status 401 when without auth ", async () => {
    const res = await request(app).post(
      `/api/user/member/62415febcd067d0ae40d8712`
    );

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });
  test("should rerutn status 403 when not allowed", async () => {
    const res = await request(app)
      .post(`/api/user/member/62415febcd067d0ae40d8712`)
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });
  test("should rerutn status 400 when user is member", async () => {
    const res = await request(app)
      .post(`/api/user/member/6242b3ce86b22e3dadc7692c`)
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("User is already member");
  });
});

describe("Remove Member", () => {
  test("should return status 401 when without auth ", async () => {
    const res = await request(app).delete(`/api/user/62456c91794068863f3cce2d`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });

  test("should rerutn status 403 when not allowed", async () => {
    const res = await request(app)
      .delete(`/api/user/624bbd66c1a62205e099d854`)
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });

  test("should return status 404 when id not found", async () => {
    const res = await request(app)
      .delete(`/api/user/weqweqweqwqweqw`)
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Id not found");
  });
});
