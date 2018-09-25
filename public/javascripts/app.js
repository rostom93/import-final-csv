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
    var url = document.getElementById("xmlurl").value;
    console.log(url);
    fetch(url).then(function(data2) {
      $.ajax({
        type: 'post',
        data:{url:data2.url},
        url: '/importxml',	
        success: function (data) {
          window.location.href = '/showxml'
        }
     });
    });
  });
  $(".showitemcsv").on("click",function(e){
    console.log (this.id)
    window.location.href = 'showcsv/showitem/'+this.id
  })
  $(".showitemxml").on("click",function(e){
    console.log (this.id)
    window.location.href = 'showxml/showitem/'+this.id
  })
});