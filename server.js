//dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/commentsjobdb", { useNewUrlParser: true });

// Routes

// A GET route for scraping the indeed website
app.get("/scrape", function(req, res) {
  var count = 0;
  // First, we grab the body of the html with axios
  axios.get("https://www.indeed.com/jobs?q=software+engineer&l=Seattle%2C+WA").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("div.jobsearch-SerpJobCard").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // console.log(element);
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element)
        .children("div.title")
        .children("a")
        .attr("title");
      result.companyName = $(element)
        .find("span.company")
        .text()
        .trim();
      result.body = $(element)
        .find("div.summary")
        .text()
        .trim();
      result.link = $(element)
        .find("div.title")
        .children("a")
        .attr("href");

      db.Job.find({ title: result.title, companyName: result.companyName, body: result.body }, function(err, jobs) {
        if (jobs.length == 0) {
          db.Job.create(result)
            .then(function(dbJob) {
              // View the added result in the console
              console.log(dbJob);
              count++;
              console.log(count);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        }
      });
      // Create a new Job using the `result` object built from scraping
    });

    // Send a message to the client
    res.send("Scrape Complete! ");
  });
});

// Route for getting all Jobs from the db
app.get("/jobs", function(req, res) {
  // Grab every document in the JOb collection
  db.Job.find({})
    .then(function(dbJob) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbJob);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific jobs by id, populate it with it's comments
app.get("/jobs/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Job.findOne({ _id: req.params.id })
    // ..and populate all of the comments associated with it
    .populate("comments")
    .then(function(dbJob) {
      // If we were able to successfully find an Job with the given id, send it back to the client
      res.json(dbJob);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/jobs/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.dbJob.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment._id }, { new: true });
    })
    .then(function(dbJob) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbJob);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
