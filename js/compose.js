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
          cssClass: "too-long",
          html: "Can you pare this down, or perhaps a phone call is better?",
          delay: 4000,
          position: "bottom",
          animationSpeed: "normal"
        });
      });
    }

    var updateCharCounter = function(charCount) {
      // debugger;
      $("span.count")[0].innerText = (charCount + charCountCharLimitDivider + charLimit);
      if (charCount > charLimit && notificationAlreadyDisplayedOnce === false) {
        charLimitExceededNotification();
        notificationAlreadyDisplayedOnce = true;
      }
      else if (charCount > charLimit && notificationAlreadyDisplayedOnce === true) {
        notificationAlreadyDisplayedOnce = true;
      }
      else { notificationAlreadyDisplayedOnce = false; }
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

    var notificationAlreadyDisplayedOnce = "";
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


