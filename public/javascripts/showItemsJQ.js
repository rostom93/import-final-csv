$(window).on("load", function() {
  $(".se-pre-con").hide();
  $(".contentcsv").show();
});
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
      string += "</table>"+"<a href='#'> View more details ... </a></div>"
   
    }
    else{
      string+="<p class='noerr'>this channel does not have any errors</p>";
    }
   
   
    return string;
  }
  $(document).ready(function() {
    
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
        {}
      ]
    });
  
    $("#table tbody").on("click", "tr td.details-control", function() {
      var tr = $(this).closest("tr");
      var id = tr.attr("id");
      $.get("/showItems/getErrorsItem/" + id, function(data) {
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
    $("#table tbody").on("click", ".delete", function() {
      var tr = $(this).closest("tr");
      var id = tr.attr("id");
      console.log(id);
      dt.row($(this).parents("tr"))
            .remove()
            .draw();
      $.ajax({
        url: "/showItems/delete/" + id,
        type: "DELETE",
        success: function(result) {
          
          succ();
        },
        error: function(xhr, status, error) {
          err();
        }
      });
    });
  });
  function succ() {
    swal("Done!",
     ",The item has been successfully deleted",
      "success"
    );
  }
  function err() {
    swal(
      "Error!",
      ",we are having issues deleting the item please try again later",
      "error"
    );
  }
  