# API Documentation

## Base URL

When running locally:

```text
http://localhost:8000
```

The server uses port `3000` by default, unless a different `PORT` is provided in the environment variables.

---

## Authentication

The API uses **JWT authentication**.

After logging in, you receive a token:

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

For protected endpoints, send the token in the request header:

```http
Authorization:  YOUR_JWT_TOKEN
```

---

# 1. Authentication

Authentication routes use the `/auth` prefix.

## Sign Up

Creates a new user account.

### Request

```http
POST /auth/signup
```

### Body

Send the required user information as JSON.

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

> The exact signup fields depend on the signup strategy configured in the application.

### Success Response

**Status:** `201 Created`

```json
{
  "message": "Signup Successful",
  "user": {}
}
```

### Failed Signup

**Status:** `409 Conflict`

```json
{
  "success": false,
  "message": "Signup failed"
}
```

---

## Login

Logs an existing user in and returns a JWT token.

### Request

```http
POST /auth/login
```

### Body

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Success Response

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

Use this token when calling protected endpoints.

---

# 2. Users

All user routes require authentication.

The user router is mounted at:

```text
/user
```

Therefore, every user endpoint starts with `/user`.

---

## Get All Users

Returns a list of users.

### Request

```http
GET /user
```

### Authentication

Required.

```http
Authorization:  YOUR_JWT_TOKEN
```

---

## Get User by ID

Returns a specific user.

### Request

```http
GET /user/:id
```

Example:

```http
GET /user/64f123abc456
```

### Authentication

Required.

---

## Get User by Username

Returns a user using their username.

### Request

```http
GET /user/username/:username
```

Example:

```http
GET /user/username/john
```

### Authentication

Required.

---

## Update User

Updates a user's information.

### Request

```http
PUT /user/:id
```

Example:

```http
PUT /user/64f123abc456
```

### Authentication

Required.

### Body

Send the fields you want to update as JSON.

```json
{
  "username": "newusername"
}
```

---

## Follow User

Follows a user.

### Request

```http
POST /user/:id
```

Example:

```http
POST /user/64f123abc456
```

### Authentication

Required.

---

## Delete User

Deletes a user.

### Request

```http
DELETE /user/:id
```

Example:

```http
DELETE /user/64f123abc456
```

### Authentication

Required.

---

# 3. Posts

Posts are available through the root `/` route.

Some post endpoints are public, while others require authentication.

---

## Get All Posts

Returns a list of posts.

### Request

```http
GET /
```

Authentication is not required.

---

## Get a Single Post

Returns a specific post.

### Request

```http
GET /:id
```

Example:

```http
GET /64f123abc456
```

Authentication is not required.

---

## Create a Post

Creates a new post.

### Request

```http
POST /
```

### Authentication

Required.

```http
Authorization:  YOUR_JWT_TOKEN
```

### Body

Send the post information as JSON.

```json
{
  "title": "My first post",
  "content": "Hello world"
}
```

> The exact fields required depend on the post validation schema used by the application.

---

## Update a Post

The current route is:

```http
PUT /id
```

### Authentication

Required.

### Important

The route is currently written as `/id` rather than `/:id`.

This means the route expects the literal path:

```http
PUT /id
```

The router also validates an `id` parameter, so this route may need to be changed to:

```http
PUT /:id
```

if the intention is to update a specific post using its ID.

### Body

Send the fields to update as JSON.

```json
{
  "title": "Updated title",
  "content": "Updated content"
}
```

---

## Publish a Post

Publishes a specific post.

### Request

```http
PUT /:id/publish
```

Example:

```http
PUT /64f123abc456/publish
```

### Authentication

Required.

---

## Delete a Post

Deletes a specific post.

### Request

```http
DELETE /:id
```

Example:

```http
DELETE /64f123abc456
```

### Authentication

Required.

---

# 4. Comments

Comments are nested under a post.

The URL format is:

```text
/:postId/comments
```

All comment routes require authentication.

---

## Create a Comment

Adds a comment to a post.

### Request

```http
POST /:postId/comments
```

Example:

```http
POST /64f123abc456/comments
```

### Authentication

Required.

```http
Authorization:  YOUR_JWT_TOKEN
```

### Body

Send the comment information as JSON.

```json
{
  "content": "This is a great post!"
}
```

> The exact required fields depend on the comment validation schema.

---

## Get Post Comments

Returns comments belonging to a post.

### Request

```http
GET /:postId/comments
```

Example:

```http
GET /64f123abc456/comments
```

### Authentication

Required.

---

## Delete a Comment

Deletes a comment belonging to a post.

### Request

```http
DELETE /:postId/comments/:id
```

Example:

```http
DELETE /64f123abc456/comments/789xyz
```

### Authentication

Required.

---

# 5. Likes

Likes are also nested under a post.

The URL format is:

```text
/:postId/likes
```

All like routes require authentication.

---

## Like a Post

Adds a like to a post.

### Request

```http
POST /:postId/likes
```

Example:

```http
POST /64f123abc456/likes
```

### Authentication

Required.

```http
Authorization:  YOUR_JWT_TOKEN
```

### Body

Send the required like data as JSON according to the API's like validation schema.

---

## Get Post Likes

Returns the likes for a post.

### Request

```http
GET /:postId/likes
```

Example:

```http
GET /64f123abc456/likes
```

### Authentication

Required.

---

## Remove a Like

Removes a specific like.

### Request

```http
DELETE /:postId/likes/:id
```

Example:

```http
DELETE /64f123abc456/likes/789xyz
```

### Authentication

Required.

---

# 6. Quick Endpoint Reference

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | No | Create an account |
| POST | `/auth/login` | No | Login and receive JWT |
| GET | `/user` | Yes | Get all users |
| GET | `/user/:id` | Yes | Get user by ID |
| GET | `/user/username/:username` | Yes | Get user by username |
| PUT | `/user/:id` | Yes | Update user |
| POST | `/user/:id` | Yes | Follow user |
| DELETE | `/user/:id` | Yes | Delete user |
| GET | `/` | No | Get all posts |
| GET | `/:id` | No | Get one post |
| POST | `/` | Yes | Create post |
| PUT | `/id` | Yes | Update post* |
| PUT | `/:id/publish` | Yes | Publish post |
| DELETE | `/:id` | Yes | Delete post |
| POST | `/:postId/comments` | Yes | Create comment |
| GET | `/:postId/comments` | Yes | Get comments |
| DELETE | `/:postId/comments/:id` | Yes | Delete comment |
| POST | `/:postId/likes` | Yes | Like post |
| GET | `/:postId/likes` | Yes | Get likes |
| DELETE | `/:postId/likes/:id` | Yes | Remove like |

`*` The update-post route currently uses `/id` in the source code. If the intention is to pass the post ID in the URL, it should likely be `/:id`.

---

# 7. Typical Usage Flow

A client can use the API in this order:

### 1. Create an account

```http
POST /auth/signup
```

### 2. Login

```http
POST /auth/login
```

Copy the returned JWT token.

### 3. Send the token with protected requests

```http
Authorization:  YOUR_JWT_TOKEN
```

### 4. Create a post

```http
POST /
```

### 5. View posts

```http
GET /
```

### 6. Comment on a post

```http
POST /:postId/comments
```

### 7. Like a post

```http
POST /:postId/likes
```

---

# 8. Request Headers

For JSON requests, use:

```http
Content-Type: application/json
```

For protected endpoints:

```http
Authorization:  YOUR_JWT_TOKEN
```

Example:

```http
Content-Type: application/json
Authorization:  eyJhbGciOiJIUzI1NiIs...
```

---

# 9. Notes

- The API uses MongoDB for its database.
- JWT is used for authentication.
- Validation middleware is used on several endpoints.
- Authentication is handled with Passport.
- Global error handling is configured in the application.
- The default server address is `http://localhost:3000`.
- Protected routes require a valid JWT.
- Posts can be accessed without authentication for listing and viewing.
- Comments and likes are nested resources belonging to a post.
