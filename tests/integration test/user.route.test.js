const supertest = require('supertest');
const {  MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { connectToMongoDB } = require('../../src/config/db');
jest.setTimeout(60000);


//mock db connection so it dosent connect to production DB
jest.mock('../../src/config/db', () =>({
    connectToMongoDB: jest.fn()
}));

//mock passport authentication for testing restricted endpoints
//and allows us to by-pass the unauthorize gate by passport 
jest.mock('passport', () =>{
    const passport = jest.requireActual('passport'); //we needed to import the real passport because of the passport.use which uses the local strategy as defined in the middleware
    passport.authenticate = () => (req,res,next) => {
        req.user = { _id: '68d109001234567890abcdef' };
        next();
    }
    return passport;
});

let mongoServer;

//import app after mocks
const app = require('../../app');
const User = require('../../src/models/users');



//to handle the async hooks
beforeAll(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    // jest.spyOn(console, 'error').mockImplementation(() => {})
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri()
    await mongoose.connect(uri);
    server = app.listen(0);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();

    if(mongoServer){
        await mongoServer.stop();
    }
    mongoose.connection.removeAllListeners();
    console.log.mockRestore();
    await new Promise((resolve) => server.close(resolve))

    // console.error.mockRestore();
    
})

afterEach(async () => {
    await User.deleteMany({});
});


describe('User API EndPoint Tests', () => {
    describe('GET /user', () => {
        it('should return 200 and list of users', async() => {
            await User.create({
                email:'test@gmail.com',
                first_name:  'victor',
                last_name: 'otunuga',
                username: 'san_Timi',
                password: '1234567',
            });

            const response = await  supertest(app)
                .get('/user')
                .expect(200);
            // expect(response.body.success).toBe(true)
            expect(response.body.users[0].first_name).toBe("victor")
        })
    });
    describe('GET /user/username/:username', () => {
        it('should return 200 and the user that matches the username', async () =>{
            const user = await User.create({
                email:'test@gmail.com',
                first_name:  'victor',
                last_name: 'otunuga',
                username: 'san_Timi',
                password: '1234567',
            });
            const response = await supertest(app)
                .get(`/user/username/${user.username}`)
                .expect(200)
            // expect(response.body.success).toBe(true)
            expect(response.body.data.username).toBe('san_timi')
        })
    });
    describe('GET /user/:id', () => {
        it('should return 200 and the details of the user', async()=>{
            const user = await User.create({
                email:'test@gmail.com',
                first_name:  'victor',
                last_name: 'otunuga',
                username: 'san_Timi',
                password: '1234567',
            })
            const response = await supertest(app)
                .get(`/user/${user._id}`)
                .expect(200)
            expect(response.body.data.email).toBe('test@gmail.com')
        })
    });
    describe('PUT /user/:id', () => {
        it('should return 200 and the updated value', async() =>{
            const user = await User.create({
                email:'test@gmail.com',
                first_name:  'victor',
                last_name: 'otunuga',
                username: 'san_Timi',
                password: '1234567',
            })
            const response = await supertest(app)
                .put(`/user/${user._id}`)
                .send({first_name: 'victor updated'})
                .expect(200)
            expect(response.body.data.first_name).toBe('victor updated')
        })
    });
    describe('DELETE /user/:id', () =>{
        it('should return 200 and message', async()=>{
            const user = await User.create({
                email:'test@gmail.com',
                first_name:  'victor',
                last_name: 'otunuga',
                username: 'san_Timi',
                password: '1234567',
            })
            const response = await supertest(app)
                .delete(`/user/${user._id}`)
                .expect(200)
            expect(response.body.message).toBe('User successfully deleted')
        })
    })
})



