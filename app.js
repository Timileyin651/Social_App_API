const express = require('express');
const userRoute = require('./src/routes/userRoute');
const postRoute = require('./src/routes/postRoute');
const commentRoute = require('./src/routes/commentRoute');
const likeRoute = require('./src/routes/likeRoute');
const passport = require('passport')
const db = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config()
const app = express();
const authRoute = require('./src/routes/authRoute');

if(process.env.NODE_ENV !== 'test'){
    db.connectToMongoDB();
}



//authentication middleware
require("./src/middleware/auth");

const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0';


app.use(express.json());
app.use(express.urlencoded({ extended:true}))


//routes
app.use('/auth', authRoute)
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
app.use('/', postRoute); //refer to the route as not all are authenticated

//global error middleware
app.use(errorHandler)

app.listen(PORT,HOST,  ()=>
    console.log(`server listening on http://${HOST}:${PORT}`)
);


// module.exports = app;





// WITHOUT VALIDATION MIDDLEWARE






