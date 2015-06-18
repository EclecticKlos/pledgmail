
// $(".z0").ready(function() {

//   $(".Ap div:nth-child(2) div:nth-child(1)").ready(function() {
//     console.log("hereeeeeeeee")
//     console.log($(".Ap div:nth-child(2) div:nth-child(1)").innerText)
//     console.log($(".Ap div:nth-child(2) div:nth-child(1)").innerText.length);
//   })

//   $(".z0 div:nth-child(1)").on("click", function() {

//     console.log("MADE IT HERE")

//   })



// })




var insertListener = function(event){

  if (event.animationName == "nodeInserted") {
    // debugger;
    // This is the debug for knowing our listener worked!
    // event.target is the new node!
    console.warn("Another node has been inserted! ", event, event.target);
  }
};

document.addEventListener("webkitAnimationStart", insertListener, false);
