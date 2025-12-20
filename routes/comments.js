const express = require('express')
const router = express.Router()


//GET / api/ users/:userId/comments  All comments for a user  /// 
router.get('/users/:usersId/comments')

//POST/api/posts/:postsId/comments    comment on post  ///
router.post('/posts/:postId/comments')

//GET /api/posts/:postId/comments → list comments for a post  ////
router.get('/posts/:postId/comments')
//PUT /api/comments/:id → update comment    ///
router.put('/comments/:id')
//DELETE /api/comments/:id → delete comment     ////
router.delete('/comments/:id')

module.exports =router;