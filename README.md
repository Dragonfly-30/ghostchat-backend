GhostChat Backend

A logical, secure, and anonymous messaging backend built with Node.js and MongoDB. Users can register to get a unique link, and anyone can send anonymous messages to that link.
🛠 Tech Stack

    Runtime: Node.js (Express.js)

    Database: MongoDB (Running locally via Docker)

    Authentication: JWT (JSON Web Tokens) & Bcrypt

    Tools: Mongoose, Dotenv, Nodemon, Cookie-Parser

🚀 Getting Started
1. Prerequisites

Ensure you have the following installed on your machine:

    Node.js (v18+)

    Docker & Docker Compose (for the local database)

2. Installation

Clone the repository and install dependencies:
Bash
```
git clone <your-repo-url>
cd ghostchat
npm install
```

3. Environment Setup

Create a .env file in the root directory:
Code snippet
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/gochat
CORS_ORIGIN=*
JWT_SECRET=your_super_secret_random_string
ACCESS_TOKEN_EXPIRY=1d
```

4. Database Setup (Docker)

Instead of installing MongoDB on your OS, we use Docker. Run this command to spin up the database container:
Bash
```
# Starts MongoDB on port 27017
docker compose up -d
```

5. Run the Server

Start the development server with Nodemon (auto-restarts on save):
Bash

`npm run dev`

Server should be running at http://localhost:3000
📡 API Endpoints
👤 User Routes
Method	Endpoint	Description	Auth Required
POST	/api/user/register	Create a new account	❌
POST	/api/user/login	Login & receive JWT Token	❌
💬 Message Routes
Method	Endpoint	Description	Auth Required
POST	/api/messages/:uniqueLinkId	Send an anonymous message to a user	❌
GET	/api/messages/my-messages	Read your received messages	✅ (JWT)
🧪 Testing with Curl

1. Register a User:
Bash

```curl -X POST http://localhost:3000/api/user/register \
     -H "Content-Type: application/json" \
     -d '{"fullName": "Ghost User", "email": "ghost@test.com", "password": "password123"}'
```

2. Login (Get Token):
Bash
```
curl -X POST http://localhost:3000/api/user/login \
     -H "Content-Type: application/json" \
     -d '{"email": "ghost@test.com", "password": "password123"}'
```

3. Send Anonymous Message:
Bash
```
# Replace 'unique-link-id' with the one from registration
curl -X POST http://localhost:3000/api/messages/ghostuser-x7z9 \
     -H "Content-Type: application/json" \
     -d '{"content": "I know what you did last summer 👻"}'
```

4. Read Messages (Protected):
Bash
```
# Replace 'YOUR_ACCESS_TOKEN' with the token from login
curl -X GET http://localhost:3000/api/messages/my-messages \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
