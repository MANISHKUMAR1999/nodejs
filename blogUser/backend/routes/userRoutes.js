
const express = require('express');

const {createUser,getAllUser,getUserById,updateUser,deleteUser, login,verifyEmail,googleAuth} = require('../controllers/userController');

const routes = express.Router();


routes.post('/signup',createUser)

routes.post('/signin',login)

routes.get('/users',getAllUser)


routes.get('/users/:id',getUserById)

routes.patch('/users/:id',updateUser)

routes.delete('/users/:id',deleteUser)

// verify email/token

routes.get("/verify-email/:verificationToken",verifyEmail)

// google Auth route

routes.post("/google-auth",googleAuth)
module.exports = routes