$(function() {
  $("input[name=inputfile]").change(function() {
    var filename = $("#inputfile").val();
    (file = filename.toLowerCase()),
      (extension = file.substring(file.lastIndexOf(".") + 1));
    if (extension === "csv") {
      $("#messages")
        .show()
        .html("The file you have chosen is : " + filename);
      $("#messagee").hide();
      document.getElementById("uploadfile").disabled = false;
    } else {
      $("#messagee")
        .show()
        .html("The file you have chosen is not a csv file please try again ");
      $("#messages").hide();
      document.getElementById("uploadfile").disabled = true;
    }
  });

  $("#fetchdata").on('click', function() {
    $(".se-pre-con").show();
    $.get("/showcsv/list", function(data) {
      
      var radios = data['data'];
     
      // creating a string that will have all the data provided by the /fetchdata
      var string = "";
      $.each(radios, function(index, radio) {
        string +=
          "<tr><td>" +
          (index + 1) +
          "</td><td>" +
          radio["title"] +
          "</td><td>" +
          radio["author"] +
          "</td><td>" +
          radio["release_date"] +
          "</td><td>" +
          radio["category"] +
          "</td><td>" +
          radio["description"] +
          "</td><td>" +
          radio["keywords"] +
          "</td></tr>";
      });
      // filling in the trdata with the string
      $("#trdata").html(string);
      $(".se-pre-con").hide();
      $("#table").show();
    });
  });
});
