const express = require('express');
const router = express.Router();

const {
deleteUser,
updateUser,
createUser,
getUserById,
getAllUsersAndBasedOnrole, 
getUserPosts
// getAllusers
} = require('../controllers/usersController.js');


//GET/api/users?role=authore
router.get('/',getAllUsersAndBasedOnrole);
//GET /api/user/:id/posts
router.get('/:id/posts',getUserPosts);
// GET /api/users/:id
router.get('/:id',getUserById);

// POST /api/users
router.post('/',createUser);

// PUT /api/users/:id
router.put('/:id',updateUser);

//DELETE /api/user/:id
router.delete('/:id',deleteUser);

module.exports= router;