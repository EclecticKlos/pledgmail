var insertListener = function(event){

  if (event.animationName == "nodeInserted") {
    // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation listener trick

    var makeCharCounterSpan = function() {
      // span.textContent = charCount;
      span.setAttribute('class', 'count');
      span.setAttribute('style', 'color: red');
      $("tr.n1tfz td:nth-child(5) div")[0].appendChild(span)
    }

    var updateCharCounter = function(charCount) {
      $("tr.n1tfz td:nth-child(5) div span:nth-child(3)")[0].innerText = charCount;
    }

    var keyupListener = function() {
      $('.Am').keyup(function(event) {
        console.log("Keyup detected")
        charactersInCompose = $(".Am").text();
        charCount = charactersInCompose.length;
        console.log(charCount);
        updateCharCounter(charCount);
      })
    }

    var span = document.createElement('span');
    var charactersInCompose = $(".Am").text();
    var charCount = undefined;
    var checkForCharactersInCompose = window.setInterval(function() {
      if (charactersInCompose != undefined || charactersInCompose != '') {
        console.log("Inside the interval");
        console.log(charactersInCompose);
        console.log(charactersInCompose.length);
        window.clearInterval(checkForCharactersInCompose);
      makeCharCounterSpan();
      keyupListener();
      }

    }, 1000);


  }
};

document.addEventListener("webkitAnimationStart", insertListener, false);





