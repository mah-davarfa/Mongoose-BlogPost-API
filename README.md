## Blog Post API – Mongoose Project
A RESTful Blog Post API built with Node.js, Express, MongoDB, and Mongoose, demonstrating schema design, data relationships, population, validation, and full CRUD operations using an MVC architecture.
This project was built to satisfy the Mongoose assessment requirements and showcase best practices for database-backed APIs.

## Features
Users, Posts, and Comments models
One-to-many relationships
Users → Posts
Posts → Comments
Users → Comments
Virtual populate for post comments
Full CRUD operations
Input validation and sanitization
Centralized error handling
Environment-based configuration
Clean MVC architecture

## Tech Stack
Node.js
Express
MongoDB
Mongoose
dotenv
sanitize-html

## Project Structure
mongoose-posts-comments-api/
├── config/
│   └── database.js
├── controllers/
│   ├── usersController.js
│   ├── postsController.js
│   └── commentsController.js
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── routes/
│   ├── users.js
│   ├── posts.js
│   └── comments.js
├── middleware/
│   └── errorHandler.js
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

## Database Connection
The database connection is isolated in config/database.js and uses environment variables via otenv.
Connection events are handled:
Successful connection
Connection errors
Graceful process termination on failure

## Data Models
User
{
  name: String (required, min 2 chars),
  email: String (required, unique),
  role: admin | author | reader (default: author),
  createdAt,
  updatedAt
}

Post
{
  title: String (required, min 3 chars),
  content: String (required, sanitized),
  author: ObjectId → User,
  published: Boolean (default: false),
  createdAt,
  updatedAt
}

Comment
{
  content: String (required, sanitized),
  author: ObjectId → User,
  post: ObjectId → Post,
  createdAt,
  updatedAt
}
## Relationships & Population
Posts reference Users via author
Comments reference both Users and Posts
Virtual populate is used on Posts to retrieve comments dynamically

Example:
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});
This avoids storing comment IDs directly on posts and keeps the schema normalized.

## API Endpoints
Health Check
GET /health

Users
GET    /api/users
GET    /api/users/:id
GET    /api/users/:id/posts
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

Posts
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id

Comments
GET    /api/comments/:userId
POST   /api/comments/:postId

## Error Handling
Centralized error handler middleware
Validation errors return 400
Invalid ObjectId format handled
Resource not found returns 404
Development mode includes stack traces

## Environment Variables
Create a .env file using this template:

MONGODB_URI=mongodb:<uri >/blogdb or ATLAS <username,password>
PORT=3010
NODE_ENV=development
.env is excluded from version control via .gitignore

## Getting Started
Install dependencies
npm install

Start the server
node server.js

Test API
Use Postman or any REST client.

## Testing Notes
All endpoints were manually tested:
CRUD operations
Validation failures
Relationship population
Error scenarios
MongoDB Compass was used to verify stored data and relationships.

## Design Decisions
Virtual populate was chosen over embedding comment IDs to reduce data duplication.
sanitize-html is used to prevent script injection.
Controllers contain business logic; routes only map endpoints.
Validation occurs both at schema and controller level for safety.

## Possible Improvements
Add a seed script (seed.js)
Pagination and filtering
Authentication & authorization
Soft delete
Aggregation pipelines

## License
This project is for educational purposes.