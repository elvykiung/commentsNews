// Grab the jobs as a json
$.getJSON("/jobs", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var div = $("<div data-id='" + data[i]._id + "'>")
      .addClass("card")
      .css("width", "35rem");

    var cardBody = $("<div>").addClass("card-body");

    var cardTitle = $("<h5>")
      .addClass("card-title")
      .append(data[i].title);

    var cardSubTitle = $("<h6>")
      .addClass("card-subtitle mb-2 text-muted")
      .append(data[i].companyName);

    var jobBody = $("<p>")
      .addClass("card-text")
      .append(data[i].body);

    var jobLink = $("<a>")
      .attr("href", "https://www.indeed.com" + data[i].link + ">")
      .addClass("card-link")
      .text("Click for detail");

    var jobComments = $("<a>")
      .addClass("card-link")
      .text("See Comment Here");

    cardBody.append(cardTitle, cardSubTitle, jobBody, jobLink, jobComments);

    div.append(cardBody);

    $("#jobDisplay").append(div);
  }
});

// Whenever someone clicks on card
$(document).on("click", "div.card", function() {
  // Empty the jobs from the job card section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the jobs
  $.ajax({
    method: "GET",
    url: "/jobs/" + thisId
  })
    // With that done, add the jobs information to the page
    .then(function(data) {
      var form = $("<form>");

      var formGroup = $("<div>").addClass("form-group");

      var title = $("<h5>").append(data.title);

      var commenttitle = $("<input id='titleinput' name='title' placeholder='Title Here'>");

      var commentArea = $("<textarea id='bodyinput' name='body' placeholder='Comments Here'></textarea>");

      var button = $("<button data-id='" + data._id + "' id='savecomments'>Save Comment</button>");
      formGroup.append(title, commenttitle);
      formGroup.append(commentArea);

      form.append(formGroup, button);

      $("#comments").append(form);

      // // If there's a comment in the job
      if (data.comments) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comments.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comments.body);
      }
    });
});

// When you click the savecomments button
$(document).on("click", "#savecomments", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
