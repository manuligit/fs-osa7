const commentsRouter = require('express').Router()
const Comment = require('../models/comment')

commentsRouter.get('/', async (request, response) => {
  const comment = await Comment.find({})

  response.json((comment.map(Comment.format)))
})

commentsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('post')
  try {
    const comment = new Comment({
      content: body.content
    })
    const savedComment = await comment.save()
    response.json(Comment.format(savedComment))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Something went wrong' })
  }
})


module.exports = commentsRouter