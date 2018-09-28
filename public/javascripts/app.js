function format(errors) {
  var string = "";
  if(errors.length!=0){
      string +=
      "<div class='details-container'>" +
      "<table cellpadding='5' cellspacing='0' border='0' class='details-table'>";
    $.each(errors, function(index, error) {
      string +=
        "<tr class='err'>" +
        "<td>Error code: </td>" +
        "<td>" +
        error.code +
        "</td>" +
        "<td>" +
        error.msg +
        "</td>" +
        "</tr>";
    });
    string += "</table></div>";
  }
  else{
    string+="<p class='noerr'>this channel does not have any errors</p>";
  }
 
 
  return string;
}
$(document).ready(function() {
  $(document)
    .ajaxStart(function() {
      $(".contentmain").hide();
      $(".se-pre-con").show();
      $("#messageeXml").hide();
    })
    .ajaxStop(function() {
      $(".se-pre-con").hide();
    });
  var dt = $("#table").DataTable({
    columns: [
      {
        className: "details-control",
        defaultContent: "",
        data: null,
        orderable: false
      },
      {},
      {},
      {},
      {},
      {},
      {}
    ]
  });

  $("#table tbody").on("click", "tr td.details-control", function() {
    var tr = $(this).closest("tr");
    var id = tr.attr("id");
    $.get("show/getErrors/" + id, function(data) {
      var errors = data["data"];
      var row = dt.row(tr);
      if (row.child.isShown()) {
        tr.removeClass("details");
        row.child.hide();
      } else {
        tr.addClass( 'details' );
        row.child(format(errors)).show();
      }
    });
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
        window.location.href = "/show";
      },
      error: function(xhr, status, error) {
        $(".contentmain").show();
        $("#messageeXml")
          .show()
          .html("The URL you have entered is unvalid. Please try again");
      }
    });
  });

  /*
  
  $(".showitemxml").on("click", function(e) {
    $(location).attr("href", "showxml/showitem/" + this.id);
  });*/
});
