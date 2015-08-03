chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      chromeIdentityToken = token
      chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse){
          console.log("HERE")

          var gapiRequestInboxThreadsAndToken = "https://www.googleapis.com/gmail/v1/users/me/threads?q=-from%3Ame+in%3Ainbox&access_token=" + chromeIdentityToken
          var gapiRequestInboxMessagesAndToken = "https://www.googleapis.com/gmail/v1/users/me/messages?q=-label%3ASENT+in%3AINBOX&access_token=" + chromeIdentityToken

          var gapiGETRequest = function (gapiRequestURL)
            {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open( "GET", gapiRequestURL, false );
                xmlHttp.send( null );
                return xmlHttp.responseText;
            }

          var allMessagesReceived = gapiGETRequest(gapiRequestInboxMessagesAndToken)
          var allMessagesObject = JSON.parse(allMessagesReceived)
          var messageIdsOfMessagesWithContent = [];
          var getIdsOfMessagesWithContents = function(responseObject){
            console.log(responseObject)
            for(var i=0; i < responseObject.messages.length; i ++) {
              messageIdsOfMessagesWithContent.push(responseObject.messages[i].id);
            }
          }

          var messageContentsArr = [];
          var gapiRequestMessageWithId = "";
          var getMessageContents = function(messageIdList)
          {
            for(var i=0; i < messageIdList.length; i++)
            {
              gapiRequestMessageWithId = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageIdList[i] + "?access_token=" + chromeIdentityToken
              var currentMessage = JSON.parse(gapiGETRequest(gapiRequestMessageWithId))
              // var encodedMessageContents = currentMessage.payload.parts[0].body.data
              // var decodedMessageContents = atob(encodedMessageContents.replace(/-/g, '+').replace(/_/g, '/'));
              // messageContentsArr.push(decodedMessageContents)
              messageContentsArr.push(currentMessage)
            }
          }

          getIdsOfMessagesWithContents(allMessagesObject);
          getMessageContents(messageIdsOfMessagesWithContent);

          var createLabel = function (gapiRequestURL, labelName)
          {

            $.ajax({
              url: gapiRequestURL,
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                name: labelName,
                labelListVisibility: "labelShow",
                messageListVisibility: "show"
              }),
              success: function(msg){
                // alert(JSON.stringify(msg));
              },
              error: function(msg){
                alert("Error:" + JSON.stringify(msg));
              }
            })
          }


          var labelsRequestURL = "https://www.googleapis.com/gmail/v1/users/me/labels?access_token=" + chromeIdentityToken;
          var conciseMessageLabelName = "Concise";
          var lengthyMessageLabelName = "Too Long";
          var conciseMessageLabelId = 0;
          var lengthyMessageLabelId = 0;
          var existingLabels = JSON.parse(gapiGETRequest(labelsRequestURL))
          var getIdsOfExistingPledgmailLabels = function(){
            for (var i=0; i < existingLabels.labels.length; i++){
              if (existingLabels.labels[i].name === conciseMessageLabelName) {
                conciseMessageLabelId = existingLabels.labels[i].id
              }
              else if (existingLabels.labels[i].name === lengthyMessageLabelName)
                lengthyMessageLabelId = existingLabels.labels[i].id
            }
          }

          var makePledgmailLabelsIfNecessary = function(){
            getIdsOfExistingPledgmailLabels()
            if (conciseMessageLabelId === 0 && lengthyMessageLabelId === 0){
              createLabel(labelsRequestURL, conciseMessageLabelName);
              createLabel(labelsRequestURL, lengthyMessageLabelName);
              getIdsOfExistingPledgmailLabels()
            }
            else if (conciseMessageLabelId === 0){
              createLabel(labelsRequestURL, conciseMessageLabelName);
              getIdsOfExistingPledgmailLabels()
            }
            else if (lengthyMessageLabelId === 0){
              createLabel(labelsRequestURL, lengthyMessageLabelName);
              getIdsOfExistingPledgmailLabels()
            }
          }
          makePledgmailLabelsIfNecessary();


          var applyLabel = function (gapiRequestURL, labelIdsArr)
          {

            $.ajax({
              url: gapiRequestURL,
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify({
                addLabelIds: labelIdsArr
              }),
              success: function(msg){
                // alert(JSON.stringify(msg));
              },
              error: function(msg){
                alert("Error:" + JSON.stringify(msg));
              }
            })
          }



      //////////////////////   vvv    REFACTOR TO BE A CLOSURE???    vvv   ///////////////////
      //// REFACTOR NOTES:
        // "nonGmail" really means nonGmailReply





          // var runAppropriateParsingFunction = function(fullMessageObject) {
          //   if (needsGmailCheck === true){
          //     gmailEmailLength = gmailContentLength(fullMessageObject);
          //     return gmailEmailLength;
          //   }
          //   else {
          //     nonGmailEmailLength = nonGmailContentLength(fullMessageObject);
          //     return nonGmailEmailLength;
          //   }
          // }


//////// Length determining


// Gmail
//           gmailExtraContentLength = function(messageHTMLContent){
//             var gmailExtraLength = $(messageHTMLContent).find(".gmail_extra").text().length
//             if (gmailExtraLength === 0 ){
//               return 0
//             }
//             else {
//               return gmailExtraLength;
//             }
//           }

//           gmailContentLength = function(fullMessageObject){
//             var messageContent = returnContent(fullMessageObject);
//             var messageHTMLContent = decodeData(messageContent);
//             var totalMessageLength = messageHTMLContent.length;
//             var extraContentLength = gmailExtraContentLength(messageHTMLContent);
//             var messageLengthMinusExtra = totalMessageLength - extraContentLength;
//             return messageLengthMinusExtra
//           }

// // Non-gmail
//           var nonGmailContentLength = function(fullMessageObject) {
//             var messageContent = returnContent(fullMessageObject);
//             var messageHTMLContent = decodeData(messageContent);
//             var messageContentLength = messageHTMLContent.length;
//             return messageContentLength
          // }

//////// tableContentParser
// *Still must write table parser

          var parseToHTML = function(data) {
            var parsedData = $.parseHTML(data);
            return parsedData;
          }

          var decodeData = function(encodedMessageContent) {
            var encodedContent = encodedMessageContent;
            if (encodedContent) {
              var decodedContent = atob(encodedContent.replace(/-/g, '+').replace(/_/g, '/'));
            }
            else {
              var decodedContent = ""
            }
            // var html = $.parseHTML(decodedContent);
            return decodedContent;
          }

          var determineNecessaryExtraContentChecks = function(messageObject){
            for (var i=0; i < messageObject.payload.headers.length; i++) {
              if (messageObject.payload.headers[i].name === "Message-Id" && messageObject.payload.headers[i].value.includes("gmail")){
                  needsGmailCheck = true;
              }
              if (needsGmailCheck === true){
                if (messageObject.payload.headers[i].name === "X-Mailer" && messageObject.payload.headers[i].value.includes("iPhone")) {
                  needsiPhoneCheck = true;
                }
              }
            }
          }

          var returnExtraContent = function(messageObject) {
            if (needsGmailCheck === true && needsiPhoneCheck === false){
              var encodedMessageData = messageObject.payload.parts[1].body.data;
              var decodedMessageData = decodeData(encodedMessageData);
              var htmlData = parseToHTML(decodedMessageData);
              for (var i=0; i < htmlData.length; i++) {
                if (htmlData[i].attributes && htmlData[i].classList.contains("gmail_extra")) {
                  return htmlData[i].innerText
                }
                else if (htmlData[i].attributes && htmlData[i].children[0].classList.contains("gmail_extra")) {
                  return htmlData[i].children[0].innerText
                }
                else if (htmlData[i].attributes && htmlData[i].getElementsByClassName("gmail_signature").length === 1) {
                  return htmlData[i].getElementsByClassName("gmail_signature")[0].innerText
                }
                else {
                  return ""
                }
              }
            }
            else if (needsiPhoneCheck === true){
              var encodedMessageData = messageObject.payload.body.data;
              var decodedMessageData = decodeData(encodedMessageData);
              var htmlData = parseToHTML(decodedMessageData);
              if (htmlData[1]) {
                return htmlData[1].innerText
              }
              else {
                return ""
              }
            }
            else {
              return ""
            }
          }

          var returnContent = function(messageObject) {                                                        //////////////// FINISH THIS
            if (messageObject.payload.parts){
              if (messageObject.payload.parts[0]){
                if (messageObject.payload.parts[0].parts){
                  // Debugger placed as the logic for this case is likely not be complete
                  // Need to check if the node below does in fact contain the data, if not add a case
                  // This is likely where the table parser will be needed
                  return messageObject.payload.parts[0].parts[0].body.data
                }
                else if (messageObject.payload.parts[0].body) {
                  var encodedMessageData = messageObject.payload.parts[0].body.data
                  var decodedMessageData = decodeData(encodedMessageData);
                  return decodedMessageData;
                }
                else {
                  debugger
                  // Debugger placed as the logic for this case is likely not be complete
                  // Need to check if the node below does in fact contain the data, if not add a case
                  // This is likely where the table parser will be needed
                  var encodedMessageData = messageObject.payload.parts[0].body.data;
                  var decodedMessageData = decodeData(encodedMessageData);
                  return decodedMessageData;
                }
              }
            }
            else if (needsiPhoneCheck === true) {                                                        ///////////////////// iPhone parse is not correct
              var encodedMessageData = messageObject.payload.body.data;
              var decodedMessageData = decodeData(encodedMessageData);
              if (decodedMessageData) {
                return decodedMessageData
              }
              else {
                return ""
              }
            }
            else if (messageObject.payload.body) {
              var encodedMessageData = messageObject.payload.body.data
              var decodedMessageData = decodeData(encodedMessageData);
              return decodedMessageData;
            }
            else {
              debugger
              // Unknown cases
            }
          }

          var findEmailLength = function(messageObject) {
            determineNecessaryExtraContentChecks(messageObject);
            var emailExtraContent = returnExtraContent(messageObject);
            var emailContent = returnContent(messageObject);
            var emailLength = emailContent.replace(/\s/g, '').length - emailExtraContent.replace(/\s/g, '').length;
            return emailLength
          }

//////// Apply label                                                  **currentMessage needs to be passed as arg
          var extraContent = 0;  // This may not be necessary
          var tempCharLimit = 640;
          var needsGmailCheck = false;
          var needsiPhoneCheck = false;

          var applyAppropriateLabel = function(conciseMsgLabelId, lengthyMsgLabelId) {
            for(var i=0; i < messageContentsArr.length; i++){
              needsGmailCheck = false;
              needsiPhoneCheck = false;
              var labelIdsArr = [];
              var currentMessage = messageContentsArr[i];
              var messageID = currentMessage.id;
              determineNecessaryExtraContentChecks(currentMessage);
              var emailLength = findEmailLength(currentMessage);
              var labelModifyURL = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageID + "/modify?access_token=" + chromeIdentityToken;

              if (emailLength > tempCharLimit){
                labelIdsArr.push(lengthyMsgLabelId);
                applyLabel(labelModifyURL, labelIdsArr);
              }
              else if (emailLength <= tempCharLimit) {
                labelIdsArr.push(conciseMsgLabelId);
                applyLabel(labelModifyURL, labelIdsArr);
              }
            }
          }


          applyAppropriateLabel(conciseMessageLabelId, lengthyMessageLabelId)






          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          //   chrome.tabs.sendMessage(tabs[0].id, {data: "Hi"}, function(response) {
          //   });
          // });
        }
      );
    });
  }
})






























