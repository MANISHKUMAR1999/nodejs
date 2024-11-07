
const express = require('express');

const {createUser,getAllUser,getUserById,updateUser,deleteUser, login} = require('../controllers/userController');

const routes = express.Router();


routes.post('/signup',createUser)

routes.post('/signin',login)

routes.get('/users',getAllUser)


routes.get('/users/:id',getUserById)

routes.patch('/users/:id',updateUser)

routes.delete('/users/:id',deleteUser)

module.exports = routes