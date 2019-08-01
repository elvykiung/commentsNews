// Grab the jobs as a json
$.getJSON("/jobs", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var div = $("<div>")
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

// Whenever page load
$(document).on("load", function() {
  // Empty the jobs from the job card section
  $("#").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the jobs
  $.ajax({
    method: "GET",
    url: "/jobs/" + thisId
  })
    // With that done, add the jobs information to the page
    .then(function(data) {
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        // var div = $("<div>")
        //   .hasClass("card")
        //   .css("width", "22rem");
        // $("div").html("<h5 class='card-title'>" + data[1].title + " </h5>");
        // $("#jobDisplay").append(div);
      }
      // The title of the article
      // $("#jobDisplay").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#jobDisplay").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      // $("#jobDisplay").append("<textarea id='bodyinput' name='body'></textarea>");
      // // A button to submit a new note, with the id of the article saved to it
      // $("#jobDisplay").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      // if (data.note) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.note.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
      // }
    });
});
