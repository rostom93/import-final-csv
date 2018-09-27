$(window).on("load", function() {
  setTimeout(removeLoader, 4000);
});
function removeLoader() {
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  } else {
    $(".se-pre-con").hide();
    $(".contentcsv").show();
  }
}
