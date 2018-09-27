$(document).ready(function () {
  $(document).ajaxStart(function () {
    $(".contentmain").hide();
      $(".se-pre-con").show();
      $("#messageeXml").hide();
  }).ajaxStop(function () {
      $(".se-pre-con").hide();
  });
});
$(function() {
  $("input[name=inputfile]").change(function() {
    var filename = $("#inputfile").val();
    (file = filename.toLowerCase()),
      (extension = file.substring(file.lastIndexOf(".") + 1));
    if (extension === "csv") {
      $("#messages")
        .show()
        .html("The file you have chosen is : " + this.files[0].name);
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
  $("#parseXml").on("click", function(e) {
    e.preventDefault();
    var url2 = document.getElementById("xmlurl").value;
    console.log(url2);

      $.ajax({
        type: "post",
        data: { url: url2 },
        url: "/importxml",
        success: function(data) {
          $(".contentmain").hide();
          window.location.href = "/showxml";
        },
        error: function(xhr, status, error) {
          $(".contentmain").show();
          $("#messageeXml")
            .show()
            .html("The URL you have entered is unvalid. Please try again");
        }
      });
  });
  $(".showitemcsv").on("click", function(e) {
    console.log(this.id);
    window.location.href = "showcsv/showitem/" + this.id;
  });
  $(".showitemxml").on("click", function(e) {
    console.log(this.id);
    window.location.href = "showxml/showitem/" + this.id;
  });
});
