
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
   
  });