var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new JobSchema object

var JobSchema = new Schema({
  // `title` must be of type String
  title: String,
  companyName: String,
  // `body` must be of type String
  body: String,
  // `link` must be of type String
  link: String,
  comments: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Comment model
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Job = mongoose.model("Job", JobSchema);

// Export the Job model
module.exports = Job;
