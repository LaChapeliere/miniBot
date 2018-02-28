// Populate intents table on loading the page
$(window).on('load', setUp)

function setUp() {
  newIntentHide();
  $("#newIntentClose").click(newIntentHide())
  $("#submitIntent").click(newIntentHide())
  $("#detailsIntentClose").click(newIntentHide())
  populateIntentsTable();
}

// Get intents from server and put them in a table
function populateIntentsTable() {
  $.ajax({
  type: "POST",
    url: "http://167.114.255.133:8888/minibot/api/intents",
    data: { },
    success: function ( data ) {
      // Format data for the table
      formattedData = []
      for (var i = 0; i < data["intents"].length; i++) {
        intent = data["intents"][i];
        formattedIntent = {"id": intent["tag"], "tag": intent["tag"]};
        formattedIntent["pattern"] = intent["patterns"][0]; // Pick first pattern as an example
        formattedIntent["response"] = intent["responses"][0]; // Pick first response as an example
        formattedData.push(formattedIntent)
      }

      //create Tabulator on DOM element with id "intents-table"
      $("#intents-table").tabulator({
          height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
          layout:"fitColumns", //fit columns to width of table (optional)
          columns:[ //Define Table Columns
              {title:"Intent", field:"tag", width:100},
              {title:"Example pattern", field:"pattern", align:"left"},
              {title:"Example response", field:"response", align:"left"},
          ],
          rowClick:function(e, row){ //trigger an alert message when the row is clicked
              detailsIntentShow(row.getData().id);
          },
      });

      // Load data into the table
      $("#intents-table").tabulator("setData", formattedData);
    },
    dataType: "json"
  });
}

function reloadIntentsTable() {
  $.ajax({
  type: "POST",
    url: "http://167.114.255.133:8888/minibot/api/intents",
    data: { },
    success: function ( data ) {
      // Format data for the table
      formattedData = []
      for (var i = 0; i < data["intents"].length; i++) {
        intent = data["intents"][i];
        formattedIntent = {"id": intent["tag"], "tag": intent["tag"]};
        formattedIntent["pattern"] = intent["patterns"][0]; // Pick first pattern as an example
        formattedIntent["response"] = intent["responses"][0]; // Pick first response as an example
        formattedData.push(formattedIntent)
      }

      // Load data into the table
      $("#intents-table").tabulator("setData", formattedData);
    },
    dataType: "json"
  });
}

// Display popup for intent details
function detailsIntentShow(intentTag) {
  $("#detailsIntentDiv").show();
  $.ajax({
  type: "POST",
    url: "http://167.114.255.133:8888/minibot/api/intent",
    data: { "tag": intent },
    success: function ( data ) {
      // Find intent data in the table
      patterns = [];
      responses = [];
      for (var i = 0; i < data["intents"].length; i++) {
        intent = data["intents"][i];
        if (intent["tag"] == intentTag) {
          patterns = intent["patterns"];
          responses = intent["responses"];
          break;
        }
      }
      $("#intentDetailsTag").text(intentTag);
      $("#intentDetailsPatterns").text("Patterns: " + patterns.toString());
      $("#intentDetailsResponses").text("Responses: " + responses.toString());
    },
    dataType: "json"
  });
  return false;
}


// Close popup for intent details
function detailsIntentHide() {
  $("#detailsIntentDiv").hide();
  return false;
}

// Parse input for intent modification
function detailsIntentCheck() {/*
  // Get form data
  intent = $("input#intent").val();
  patternsText = $("textarea#patterns").val();
  responsesText = $("textarea#responses").val();

  //Validate data
  if (intent.length === 0 || patternsText.length === 0 || responsesText.length === 0) {
    alert("You must provide an intent tag and at least one pattern and one response!");
    return false;
  }

  // Parse patterns and responses
  patterns = patternsText.split("\n")
  responses = responsesText.split("\n")

  // Send new intent to server
  intentData = {"tag": intent, "patterns": patterns, "responses": responses};
  console.log(intentData);
  $.ajax({
  type: "POST",
    url: "http://167.114.255.133:8888/minibot/api/add_intent",
    data: intentData,
    success: function ( data ) {
      reloadIntentsTable();
    },
    dataType: "json",
  });*/

  return detailsIntentHide();
}

// Display popup to create new intent
function newIntentShow() {
  $("#newIntentDiv").show();
  return false;
}

// Parse input for new intent
function newIntentCheck() {
  // Get form data
  intent = $("input#intent").val();
  patternsText = $("textarea#patterns").val();
  responsesText = $("textarea#responses").val();

  //Validate data
  if (intent.length === 0 || patternsText.length === 0 || responsesText.length === 0) {
    alert("You must provide an intent tag and at least one pattern and one response!");
    return false;
  }

  // Parse patterns and responses
  patterns = patternsText.split("\n")
  responses = responsesText.split("\n")

  // Send new intent to server
  intentData = {"tag": intent, "patterns": patterns, "responses": responses};
  console.log(intentData);
  $.ajax({
  type: "POST",
    url: "http://167.114.255.133:8888/minibot/api/add_intent",
    data: intentData,
    success: function ( data ) {
      reloadIntentsTable();
    },
    dataType: "json",
  });

  return newIntentHide();
}

// Close popup for intent creation
function newIntentHide() {
  $("#newIntentDiv").hide();
  $("#newIntentForm")[0].reset();
  return false;
}
