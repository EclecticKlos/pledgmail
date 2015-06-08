$(".z0").ready(function() {

  debugger;

  $(".Ap div:nth-child(2) div:nth-child(1)").ready(function() {
    debugger;
    console.log($(".Ap div:nth-child(2) div:nth-child(1)").innerText.length);
  })

  $(".z0 div:nth-child(1)").on("click", function() {

    console.log("MADE IT HERE")

  })
})


// var insertListener = function(event){
//   debugger;
//   if (event.animationName == "nodeInserted") {
//     debugger;
//     // This is the debug for knowing our listener worked!
//     // event.target is the new node!
//     console.warn("Another node has been inserted! ", event, event.target);
//   }
// };

// document.addEventListener("webkitAnimationStart", insertListener, false);


