var insertListener = function(event){

  if (event.animationName == "nodeInserted") {
    // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation listener trick

    var displayCharCount = function(charCount) {
      var span = document.createElement('span');
      span.textContent = charCount;
      span.setAttribute('class', 'count');
      $("tr.n1tfz td:nth-child(5) div")[0].appendChild(span)
    }

    var keyupListener = function() {
      $('.Am').keyup(function(event) {
        console.log("Keyup detected")
        charactersInCompose = $(".Am").text();
        console.log(charactersInCompose.length);
        var charCount = charactersInCompose.length;
        displayCharCount(charCount);
      })
    }

    var charactersInCompose = $(".Am").text();
    var updatedCharactersInCompose = undefined;
    var checkForCharactersInCompose = window.setInterval(function() {
      if (charactersInCompose != undefined || charactersInCompose != '') {
        console.log("Inside the interval");
        console.log(charactersInCompose);
        console.log(charactersInCompose.length);
        window.clearInterval(checkForCharactersInCompose);
      keyupListener();
      }

    }, 1000);


  }
};

document.addEventListener("webkitAnimationStart", insertListener, false);
















// var insertListener = function(event){

//   if (event.animationName == "nodeInserted") {
//     // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation listener trick

//     var charactersInCompose = $(".Am").text();
//     var updatedCharactersInCompose = undefined;
//     var checkForCharactersInCompose = window.setInterval(function() {
//       if (charactersInCompose != undefined || charactersInCompose != "") {
//         console.log("Inside the interval");
//         console.log(charactersInCompose.length);
//         window.clearInterval(checkForCharactersInCompose);
//         // return charactersInCompose;
//       }
//     }, 1000);

//     console.log(charactersInCompose + " this test");
//     var updatedCharactersInCompose = charactersInCompose;

//     $('.Am').keyup(function(event) {
//       console.log("Keyup detected")
//       updatedCharactersInCompose = $(".Am").text();
//       console.log(updatedCharactersInCompose.length);
//     })

//   }
// };

// document.addEventListener("webkitAnimationStart", insertListener, false);
