
const express = require('express');

const {createUser,getAllUser,getUserById,updateUser,deleteUser} = require('../controllers/userController');

const routes = express.Router();


routes.post('/users',createUser)


routes.get('/users',getAllUser)


routes.get('/users/:id',getUserById)

routes.patch('/users/:id',updateUser)

routes.delete('/users/:id',deleteUser)

module.exports = routes