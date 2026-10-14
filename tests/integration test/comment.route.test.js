const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("../../src/config/db");

//mock the db
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
const Comment = require("../../src/models/comments");

//to handle the async hooks
beforeAll(async () => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  server = app.listen(0);
}, 15000);

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
  await  Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
  ]);
});

describe("Comment API Endpoint Tests", () => {
  describe("POST /comment", () => {
    it("it should return 201 and create a comment for a post", async () => {
      const user = await User.create({
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
        .post(`/comment/post/${post._id}`)
        .send({
          user: user._id,
          post:post._id,
          content: "i totally agree",
          parent: null
        })
        .expect(201);
      expect(response.body.data.content).toBe("i totally agree");
    });
    describe("DELETE /comment/:id", () => {
      it("it should return 204 and the comment removed", async () => {
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
        const comment = await Comment.create({
          post: post._id,
          user: user._id,
          parent: null,
          content: "i totally agree",
        });
        const response = await supertest(app)
            .delete(`/comment/${comment._id}`)
            .expect(204);
        const deleted = await Comment.findById(comment._id)
        expect(deleted).toBeNull();
      });
    });
  });
});
