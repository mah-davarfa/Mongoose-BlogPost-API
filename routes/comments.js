const express = require('express')
const router = express.Router()
const{
    getAllUserComments,
    createComment,
} = require('../controllers/commentsController.js')



// GET /api/comments/:userId
// Example: /api/comments/694959e962935837aec25883
router.get('/:userId', getAllUserComments);

//POST /api/comments/:postId
router.post('/:postId',createComment)

module.exports =router;