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

  $("#fetchdata").on("click", function() {
    $(".se-pre-con").show();
    $("#tableitem").hide();
    $("#messagee").hide();
    $("#return").show();
    $.get("/showcsv/list", function(data) {
      var radios = data["data"];

      // creating a string that will have all the data provided by the /fetchdata
      var string = "";
      $.each(radios, function(index, radio) {
        string +=
          "<tr title='Click to view list of items' id='radio' onclick=\"showItems('" +
          radio["_id"] +
          "')\"><td>" +
          (index + 1) +
          "</td><td>" +
          radio["title"] +
          "</td><td>" +
          radio["author"] +
          "</td><td>" +
          radio["release_date"] +
          "</td><td>" +
          radio["categories"] +
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
  $("input[name=xmlurl]").on("input", function() {
    var urlinput = document.getElementById("xmlurl").value;

    if (
      urlinput === "" ||
      urlinput === null ||
      urlinput.length == 0 ||
      urlinput.length < 8
    )
      document.getElementById("parseXml").disabled = true;
    else {
      document.getElementById("parseXml").disabled = false;
    }
  });
  $("#parseXml").on("click", function() {
    var url = document.getElementById("xmlurl").value;
    console.log(url);
    fetch(url).then(function(data2) {
      $.ajax({
        type: 'post',
        data:{url:data2.url},
        url: '/importxml',	
        success: function (data) {
          console.log('success');
        }
     });
    });
  });
});

function showItems(id) {
  $("#table").hide();
  $("#listradio").hide();
  $("#listitems").show();
  $("#return").hide();

  $(".se-pre-con").show();
  $.get("/showcsv/show/" + id, function(data) {
    var items = data["data"];
    console.log(items);
    if (items.length == 0) {
      $(".se-pre-con").hide();
      $("#messagee")
        .show()
        .html("this radio does not have any items ");
    } else {
      $("#messagee").hide();
      // creating a string that will have all the data provided by the /fetchdata
      var string = "";
      $.each(items, function(index, item) {
        string +=
          "<tr><td>" +
          (index + 1) +
          "</td><td>" +
          item["title"] +
          "</td><td>" +
          item["pubDate"] +
          "</td><td>" +
          item["duration"] +
          "</td><td>" +
          item["description"] +
          "</td><td>" +
          item["summary"] +
          "</td><td>" +
          item["subtitle"] +
          "</td></tr>";
      });
      // filling in the trdata with the string
      $("#trdataitem").html(string);
      $(".se-pre-con").hide();
      $("#tableitem").show();
      $("#listofradios").show();
    }
  });

  console.log(id);
}
