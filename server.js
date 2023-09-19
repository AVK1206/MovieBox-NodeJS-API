const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
const express = require("express"); // Import the Express.js framework
const PORT = 3000;

const app = express();
app.use(express.json()); // Middleware to parse JSON data in incoming requests

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, (err) => {
      err ? console.log(err) : console.log(`listening port ${PORT}`);
    });
    db = getDb();
  } else {
    console.log(`DB connection error: ${err}`);
  }
});


// Define a function to handle errors and send an error response
const handleError = (res, error) => {
  res.status(500).json({ error });
}


// Define a route to get a list of movies
app.get("/movies", (req, res) => {
  const movies = [];

  db
    .collection("movies")
    .find()
    .sort({ title: 1 }) // Sort movies by title in ascending order
    .forEach((movie) => movies.push(movie)) // Iterate over the found movies and add them to the 'movies' array
    .then(() => {
      res
        .status(200)
        .json(movies);
    })
    .catch(() => handleError(res, "Something went wrong..."));
});


// Define a route to get details of a specific movie by ID
app.get("/movies/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const movieId = new ObjectId(req.params.id); // Convert the request parameter 'id' to a MongoDB ObjectId

    db
      .collection("movies")
      .findOne({ _id: movieId })
      .then((doc) => {
        res
          .status(200)
          .json(doc);
      })
      .catch(() => handleError(res, "Something went wrong..."));
  } else {
    handleError(res, "Wrong id");
  }
});

// Handle POST requests to add a new movie to the database.
app.post("/movies", (req, res) => {
  db
  .collection('movies')
  .insertOne(req.body)
  .then((result) => {
    res
      .status(201)
      .json(result);
  })
  .catch(() => handleError(res, "Something went wrong..."));
});

// Handle PATCH requests to update a movie record in the database by its ID.
app.patch("/movies/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const movieId = new ObjectId(req.params.id);

    db
      .collection("movies")
      .updateOne({ _id: movieId }, { $set: req.body })
      .then((result) => {
        res
          .status(200)
          .json(result);
      })
      .catch(() => handleError(res, "Something went wrong..."));
  } else {
    handleError(res, "Wrong id");
  }
});

// Handle DELETE requests to remove a movie record from the database by its ID.
app.delete("/movies/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const movieId = new ObjectId(req.params.id);

    db
      .collection("movies")
      .deleteOne({ _id: movieId })
      .then((result) => {
        res
          .status(200)
          .json(result);
      })
      .catch(() => handleError(res, "Something went wrong..."));
  } else {
    handleError(res, "Wrong id");
  }
});

