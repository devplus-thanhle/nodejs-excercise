const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE2Y2UxN2ZhZmQzM2UyOGY5Y2I1MiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0OTM4MDcxOCwiZXhwIjoxNjUwNjc2NzE4fQ.4tZPjOCNq92q7U9vZgTbUflYoQFvxixvfVyfg0WZ2hQ";
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE1ZmViY2QwNjdkMGFlNDBkODcxMiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDkzODA3NTAsImV4cCI6MTY1MDY3Njc1MH0.dqnukddWCuE1_d55OJivAWghv7wgz80V486vNfmkmQQ";
const standardToken = "adadadadadad";
const incorrectToken =
  "qweeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDE2YzhlN2ZhZmQzM2UyOGY5Y2I0OSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NDg2OTIzODAsImV4cCI6MTY0ODc3ODc4MH0.7XvBmjvzpgE5CLOnWXhSxAF7Ip-M6K0BCK4e3RiGIvc";

describe("Add Book", () => {
  test("should return 401 when without auth", async () => {
    const res = await request(app).post("/api/book/add-book").send({
      title: "Conan9",
      author: "Thanh Le",
      description: "The Lord of ",
      image: "anh1213123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });

  test("should return status 403 when not allowed", async () => {
    const res = await request(app)
      .post("/api/book/add-book")
      .send({
        title: "Conan9",
        author: "Thanh Le",
        description: "The Lord of ",
        image: "anh1213123",
      })
      .set("authorization", userToken);

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe("You are not allowed to do that");
  });

  test("should return status 400 when enter missing fields", async () => {
    const res = await request(app)
      .post("/api/book/add-book")
      .send({
        title: "",
        author: "",
        description: "The Lord of ",
        image: "anh1213123",
      })
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Please fill all fields");
  });

  test("should return status 200 when add book successfully", async () => {
    const res = await request(app)
      .post("/api/book/add-book")
      .send({
        title: "Conan9",
        author: "Thanh Le",
        description: "The Lord of ",
        image: "anh1213123",
      })
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("Book added successfully");
  });
});

describe("getBooks", () => {
  test("should return 401 when without auth", async () => {
    const res = await request(app).get("/api/book/get-books");

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Invalid Authentication.");
  });

  test("should return status 200 ", async () => {
    const res = await request(app)
      .get("/api/book/books?page=2")
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("Books found");
  });
  test("should return status 200 ", async () => {
    const res = await request(app)
      .get("/api/book/books?page=2")
      .set("authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("Books found");
  });
});
