# Movie Club Manager

A web application for a local movie club to manage its movie collection, replacing paper records.
Built with **Node.js, Express, MongoDB (Mongoose)** and a plain HTML/CSS/JavaScript frontend.

## Features
1. Add a new movie (title, genre, release year, rating, director)
2. View all movies
3. Search movies by title or genre
4. Update existing movie details
5. Delete movies from the collection
6. All data stored in and retrieved from MongoDB

## Project Structure
```
movie-club/
├── server.js            # Express app + MongoDB connection
├── models/Movie.js      # Mongoose schema with validation
├── routes/movies.js     # REST API (CRUD + search)
├── public/              # Frontend
│   ├── index.html
│   ├── style.css
│   └── app.js
├── package.json
├── .env.example
└── README.md
```

## Prerequisites
- [Node.js](https://nodejs.org) 18 or newer
- MongoDB running locally (`mongod`) **or** a free MongoDB Atlas connection string

## Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env        # Windows: copy .env.example .env
# (edit MONGO_URI in .env if you use Atlas or a different host)

# 3. Start the server
npm start
```
Open **http://localhost:3000** in your browser.

## REST API
| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | `/api/movies`         | Add a movie                              |
| GET    | `/api/movies`         | List all movies                          |
| GET    | `/api/movies?q=drama` | Search by title or genre (case-insens.)  |
| GET    | `/api/movies/:id`     | Get one movie                            |
| PUT    | `/api/movies/:id`     | Update a movie                           |
| DELETE | `/api/movies/:id`     | Delete a movie                           |

Example request body:
```json
{
  "title": "Inception",
  "genre": "Sci-Fi",
  "releaseYear": 2010,
  "rating": 8.8,
  "director": "Christopher Nolan"
}
```

## Notes
- Validation: all fields required; rating 0–10; release year 1888–2100.
- Search input is regex-escaped, and table cells use `textContent`, so user input can't inject HTML or regex.
- The app has no login. If you need admin-only access, add authentication (e.g. sessions or JWT) before deploying publicly.
