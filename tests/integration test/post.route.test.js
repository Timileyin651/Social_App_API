const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("../../src/config/db");

//mock the db connection
jest.mock("../../src/config/db", () => ({
  connectToMongoDB: jest.fn(),
}));

//mock passport authentication
jest.mock("passport", () => {
  const passport = jest.requireActual("passport");
  passport.authenticate = () => (req, res, next) => {
    req.user = { _id: "68d109001234567890abcdef" };
    next();
  };
  return passport;
});

//mock passport
let mongoServer;

//import app after mocks
const app = require("../../app");
const User = require("../../src/models/users");
const Post = require("../../src/models/posts");

//to handle the async hooks
beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  server = app.listen(0);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
  mongoose.connection.removeAllListeners();
  console.log.mockRestore();
  await new Promise((resolve) => server.close(resolve));
});


afterEach(async () => {
  await User.deleteMany({});
});

describe("Post API EndPoint Tests", () => {
  describe("GET /", () => {
    it("should return 201 and should create post", async () => {
      const user = await User.create({
        email: "test@gmail.com",
        first_name: "victor",
        last_name: "otunuga",
        username: "san_Timi",
        password: "1234567",
      });
      await Post.create({
        title: "testing the post api",
        content: "testing the post api",
        author: user._id,
        tags: [],
        state: "published",
        like_count: 0,
        comment_count: 0,
        published_at: null,
      });
      const response = await supertest(app).get("/").expect(200);
      expect(response.body.posts[0].title).toBe("testing the post api");
    });
    it("should return 200 and the list of posts", async () => {
      const user = await User.create({
        email: "test@gmail.com",
        first_name: "victor",
        last_name: "otunuga",
        username: "san_Timi",
        password: "1234567",
      });
      await Post.create({
        title: "testing the post api",
        content: "testing the post api",
        author: user._id,
        tags: [],
        state: "published",
        like_count: 0,
        comment_count: 0,
        published_at: null,
      });
      const response = await supertest(app).get("/").expect(200);
      expect(response.body.posts[0].title).toBe("testing the post api");
    });
    describe("PUT /:id", () => {
      it("should return 200 and the updated value", async () => {
        const user = await User.create({
          _id: "68d109001234567890abcdef",
          email: "test@gmail.com",
          first_name: "victor",
          last_name: "otunuga",
          username: "san_Timi",
          password: "1234567",
        });
        const post = await Post.create({
          title: "testing the post api",
          content: "testing the post api",
          author: user._id,
          tags: [],
          state: "published",
          like_count: 0,
          comment_count: 0,
          published_at: null,
        });
        const response = await supertest(app)
          .put(`/${post._id}`)
          .send({ title: "test updated" })
          .expect(200);
        expect(response.body.success).toBe(true);
      });
    });
    describe("PUT /:id/publish", () => {
      it("should return 200 and publish post", async () => {
        const user = await User.create({
          _id: "68d109001234567890abcdef",
          email: "test@gmail.com",
          first_name: "victor",
          last_name: "otunuga",
          username: "san_Timi",
          password: "1234567",
        });
        const post = await Post.create({
          title: "testing the post api",
          content: "testing the post api",
          author: user._id,
          tags: [],
          state: "draft",
          like_count: 0,
          comment_count: 0,
          published_at: null,
        });
        const response = await supertest(app)
          .put(`/${post._id}/publish`)
          .send({ state: "published" })
          .expect(200);
        expect(response.body.data.state).toBe("published");
      });
    });
    describe("DELETE /:id", () => {
        it("it should return 200 and remove post", async() => {
            const user = await User.create({
          _id: "68d109001234567890abcdef",
          email: "test@gmail.com",
          first_name: "victor",
          last_name: "otunuga",
          username: "san_Timi",
          password: "1234567",
        });
        const post = await Post.create({
          title: "testing the post api",
          content: "testing the post api",
          author: user._id,
          tags: [],
          state: "published",
          like_count: 0,
          comment_count: 0,
          published_at: null,
        });
        const response = await  supertest(app)
            .delete(`/${post._id}`)
            .expect(204);
        const deleted = await Post.findById(post._id)
        expect(deleted).toBeNull();
        })
    })
  });
});
