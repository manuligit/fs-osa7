import React from 'react'
import blogService from './../services/blogs'

class Comment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: [],
      content: ''
    }
  }

  handleFormFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  async componentDidMount() {
    //this.setState({ blog: this.props.blog })
    const comments = await blogService.getAllComments(this.props.blog.id)
    //console.log('componentdidmount comments', comments)
    this.setState({ comments: comments })
  }

  comment = async (event) => {
    event.preventDefault()
    console.log('pushed button')
    let newComment = {
      content: this.state.content
    }
    try {
      if (newComment.content.length > 0) {
        let response = await blogService.createComment(this.props.blog.id, newComment)
        console.log(response)
        const comments = await blogService.getAllComments(this.props.blog.id)
        this.setState({ content: '', comments: comments })
        this.props.notify(`${newComment.content} created successfully`) 
        
      } else {
        console.log(newComment)
      }
    }
    catch (error) {
      console.log('components createcomment error:')
      console.log(error.name)
    }
  }

  render () {
    //console.log(this.props.blog)
    const addCommentForm = (
      <div>
        <form onSubmit={this.comment}>
            <input 
              type="text" 
              name="content"
              onChange={this.handleFormFieldChange}
            />
          <button type="submit">Add comment</button>
        </form>
      </div>
    )

    const commentList = (
      <ul>
        {this.state.comments.map(comment => <li key={comment.id}>{comment.content}</li>)}
      </ul>
    )

    return (
      <div>
      <h3> Comments </h3>
      {this.state.comments === 0 && <div>No comments.</div>}

      {this.state.comments && commentList}

      {addCommentForm}
      </div>
    )
  }
}

export default Comment