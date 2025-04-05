# Game24 API

A RESTful API service for solving Game24 puzzles using Hono, Prisma, and MongoDB.

## Project Overview

Game24 is a mathematical puzzle where players need to find a way to manipulate four numbers using basic arithmetic operations (+, -, \*, /) to get a result of 24.

## Features

- 🎮 Game24 puzzle solver
- 🔒 User authentication (JWT)
- 💾 Solution caching
- 🚀 RESTful API
- 🐳 Docker support

## Tech Stack

- Hono (Backend Framework)
- Prisma (ORM)
- MongoDB (Database)
- TypeScript
- Docker

## Prerequisites

- Node.js 20+
- MongoDB Atlas account
- Docker (optional)

## Environment Variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_secret_key
```

## Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd Game24
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Start the server:

```bash
npm run dev
```

## Docker Setup

Run with Docker Compose:

```bash
docker-compose up --build
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| POST   | `/api/users/signup`  | Create new user |
| POST   | `/api/users/signin`  | Login user      |
| POST   | `/api/users/signout` | Logout user     |

### Game Routes (Protected)

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/game/solve`       | Solve Game24 puzzle |
| GET    | `/api/game/answers`     | Get all solutions   |
| GET    | `/api/game/answers/:id` | Get solution by ID  |
| PUT    | `/api/game/answers/:id` | Update solution     |
| DELETE | `/api/game/answers/:id` | Delete solution     |

## API Usage Examples

### Solve Puzzle

```bash
curl -X POST http://localhost:3000/api/game/solve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"numbers": [4, 7, 8, 8]}'
```

### Response Example

```json
{
  "cached": false,
  "solutions": ["(8/(7-(8/4)))", "((8*4)/(7-8))"]
}
```

## Project Structure

```
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── game24Controller.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── gameRoute.ts
│   │   └── userRoute.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License

## Author

Your Name

## Acknowledgments

- Hono Framework
- Prisma ORM
- MongoDB Team
