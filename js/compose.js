
// $(".Am").ready(function() {

  // $(".Ap div:nth-child(2) div:nth-child(1)").ready(function() {
  //   console.log("hereeeeeeeee")
  //   console.log($(".Ap div:nth-child(2) div:nth-child(1)").innerText)
  //   console.log($(".Ap div:nth-child(2) div:nth-child(1)").innerText.length);
  // })

  // $(".z0 div:nth-child(1)").on("click", function() {

  //   console.log("MADE IT HERE")

  // })
  // console.log($(".Am").innerText)
  // var charPresent = $(".Am").innerText;
  // console.log("^This")
  // while (charPresent == undefined){
  //   console.log("Yes I am undefined")
  //   setInterval(function() {
  //     charPresent = $(".Am").innerText
  //     console.log(charPresent)
  //   }, 1000 )
  // }


// })







var insertListener = function(event){

  if (event.animationName == "nodeInserted") {
    // debugger;
    // This is the debug for knowing our listener worked!
    // event.target is the new node!
    console.warn("Another node has been inserted! ", event, event.target);

    var charPresent = undefined;

    var checkCharPresent = window.setInterval(function() {
      charPresent = $(".Am").text();
      console.log(charPresent + " I am before condition")
      if (charPresent != undefined) {
        console.log(charPresent + " I am inside condition")
        console.log(charPresent.length)
        window.clearInterval(checkCharPresent);
        return charPresent;
      }
    }, 1000 )
  }
};

document.addEventListener("webkitAnimationStart", insertListener, false);
