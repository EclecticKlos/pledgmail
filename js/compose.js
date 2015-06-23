var insertListener = function(event){

  if (event.animationName === "nodeInserted") {
    // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation listener trick

    var makeCharCounterSpan = function() {
      // span.textContent = charCount;
      span.setAttribute('class', 'count');
      span.setAttribute('style', 'color: red');
      span.style.fontSize = "77%";
      $("tr.n1tfz td:nth-child(5) div")[0].appendChild(span)
    }

    var charLimitExceededNotification = function() {
      $(function () {
        $.notifyBar({
          cssClass: "error",
          html: "Too many characters!",
          delay: 2000,
          animationSpeed: "normal"
        });
      });
    }

    var updateCharCounter = function(charCount) {
      // debugger;
      $("span.count")[0].innerText = (charCount + charCountCharLimitDivider + charLimit);
      if (charCount > charLimit) {
        console.log("It's been exceeded!");
        charLimitExceededNotification();
      }
    }

    var findSignatureLength = function(){
      if ($(".gmail_signature").text().length !== 0) {
        if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].innerText.includes("-- ")) { signatureHyphenLength = 3};
        return signature = ($(".gmail_signature").text().replace(/(?:\r\n|\r|\n)/g,'').length);
      }
      else if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].children.length === 0) {
        return signature = 0;
      }
      else if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].children.length > 0) {

        firstNodeTier = $(".Ap div:nth-child(2) div:nth-child(1)")[0];
        for (i = 0; i < firstNodeTier.children.length; i++) {
          if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].innerText.includes("-- ")) {
            signatureHyphenLength = 3;
          };
          if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].children[i].children.length > 0) {
            secondNodeTier = $(".Ap div:nth-child(2) div:nth-child(1)")[0].children[i];
            for (j = 0; j < secondNodeTier.children.length; j++) {
              if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].children[i].children[j].children.length > 0) {
                if ($(".Ap div:nth-child(2) div:nth-child(1)")[0].children[i].children[j].children[0].children.length > 0) {
                  console.log($(".Ap div:nth-child(2) div:nth-child(1)")[0].children[i].children[j].innerText)
                  gmailSignatureExtraChars = 0;
                  return signature = $(".Ap div:nth-child(2) div:nth-child(1)")[0].children[i].children[j].innerText.replace(/(?:\r\n|\r|\n)/g,'').length
                }
                else if (i === (firstNodeTier.children.length -1)) {
                  return signature = 0;
                }
              }
              else if (i === (firstNodeTier.children.length -1)) {
                return signature = 0;
          }
            }
          }
          else if (i === (firstNodeTier.children.length -1)) {
                return signature = 0;
          }
        }
      }
    }

    var keyupListener = function() {
      $('.Am').keyup(function(event) {
        charactersInCompose = $(".Am").text();
        charCount = (charactersInCompose.replace(/(?:\r\n|\r|\n)/g,'').length - findSignatureLength() - signatureHyphenLength - gmailSignatureExtraChars);
        updateCharCounter(charCount);
      })
    }

    var signatureHyphenLength = 0;
    var signatureHyphens = false;
    var charLimit = 640
    var charCountCharLimitDivider = "/"
    var signature = 0;
    var gmailSignatureExtraChars = 0;
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








// $(".Ap div:nth-child(2) div:nth-child(1)")[0].hasChildNodes()
// = true
// THIS IS ALWAYS TRUE

// $(".Ap div:nth-child(2) div:nth-child(1)")[0].children[0].innerText
// Yields sig

















// var insertListener = function(event){

//   if (event.animationName == "nodeInserted") {
//     // Thanks to David Walsh (http://davidwalsh.name/detect-node-insertion) for this animation listener trick

//     var makeCharCounterSpan = function() {
//       // span.textContent = charCount;
//       span.setAttribute('class', 'count');
//       span.setAttribute('style', 'color: red');
//       span.style.fontSize = "77%";
//       $("tr.n1tfz td:nth-child(5) div")[0].appendChild(span)
//     }

//     var updateCharCounter = function(charCount) {
//       $("tr.n1tfz td:nth-child(5) div span:nth-child(3)")[0].innerText = (charCount + "" + charLimit);
//     }

//     var keyupListener = function() {
//       $('.Am').keyup(function(event) {
//         console.log("Keyup detected")
//         charactersInCompose = $(".Am").text();
//         debugger;
//         console.log($(".gmail_signature") + " << sig")
//         if ($(".gmail_signature").text().length !== 0) {
//           signature = ($(".gmail_signature").text().length + signatureExtraChars);
//         } else if ($(".Ap div:nth-child(2) div div:nth-child(4)").text().length !== 0) {
//           signature = ($(".Ap div:nth-child(2) div div:nth-child(4)").text().length + signatureExtraChars);
//         } else {
//           signature = 0;
//         }

//         charCount = (charactersInCompose.length - signature);
//         console.log(charactersInCompose);
//         updateCharCounter(charCount);
//       })
//     }

//     var charLimit = "/640"
//     var signature = 0;
//     var signatureExtraChars = 4;
//     var span = document.createElement('span');
//     var charactersInCompose = $(".Am").text();
//     var charCount = undefined;
//     var checkForCharactersInCompose = window.setInterval(function() {
//       if (charactersInCompose != undefined || charactersInCompose != '') {
//         console.log("Inside the interval");
//         console.log(charactersInCompose);
//         console.log(charactersInCompose.length);
//         window.clearInterval(checkForCharactersInCompose);
//       makeCharCounterSpan();
//       keyupListener();
//       }

//     }, 1000);


//   }
// };

// document.addEventListener("webkitAnimationStart", insertListener, false);





