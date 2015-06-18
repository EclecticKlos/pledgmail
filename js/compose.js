var insertListener = function(event){

  if (event.animationName == "nodeInserted") {
    // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation trick

    var checkForCharactersInCompose = window.setInterval(function() {
      charactersInCompose = $(".Am").text();
      if (charactersInCompose != undefined || charactersInCompose != "") {
        console.log(charactersInCompose.length);
        window.clearInterval(checkForCharactersInCompose);
        return charactersInCompose;
      }
    }, 1000);

    $('.Am').keyup(function(event) {
      console.log("Keyup detected")
    })

  }
};

document.addEventListener("webkitAnimationStart", insertListener, false);
