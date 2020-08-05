exports.convertDate = function (theDate) { // exports .convertDate();
  let convertingDate = theDate;

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return convertingDate.toLocaleDateString("en-US", options);
}
