var insertListener = function(event){

  if (event.animationName == "nodeInserted") {
    // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation trick

    var charactersInCompose = $(".Am").text();
    var checkForCharactersInCompose = window.setInterval(function() {
      if (charactersInCompose != undefined || charactersInCompose != "") {
        console.log("Inside the interval");
        console.log(charactersInCompose.length);
        window.clearInterval(checkForCharactersInCompose);
        return charactersInCompose;
      }
    }, 1000);

    var updatedCharactersInCompose = charactersInCompose;

    $('.Am').keyup(function(event) {
      console.log("Keyup detected")
      updatedCharactersInCompose = $(".Am").text();
      console.log(updatedCharactersInCompose.length);
    })

  }
};

document.addEventListener("webkitAnimationStart", insertListener, false);
