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
        // messageContentNode === MessageContentData



          var findContentNode = function(messageObject) {
            if (messageObject.payload.hasOwnProperty("parts")){
              if (messageObject.payload.parts[1]){
                isGmailContent = true;
                return messageObject.payload.parts[0].body.data;
              }
              else if (messageObject.payload.parts[0]){
                if (messageObject.payload.parts[0].parts){
                  debugger
                  // Debugger placed as the logic for this case is likely not be complete
                  // Need to check if the node below does in fact contain the data, if not add a case
                  return messageObject.payload.parts[0].parts[1].body.data;
                  // return messageObject.payload.parts[0].parts[0].body.data
                }
                else {
                  debugger
                  // Debugger placed as the logic for this case is likely not be complete
                  // Need to check if the node below does in fact contain the data, if not add a case
                  return messageObject.payload.parts[0].body.data;
                }
              }
            }
            else if (messageObject.payload.body) {
              return messageObject.payload.body.data
            }
          }

          var returnAppropriateContentFormat = function(messageObject) {
            var messageContentNode = findContentNode(messageObject);
            var messageHTMLContent = decodeAndReturnParsedHTML(messageContentNode);
            var messageTextContent = messageHTMLContent;
            if (isGmailContent === true){
              return messageHTMLContent
            }
            else {
              return messageTextContent
            }
          }

          var decodeAndReturnParsedHTML = function(messageContentNode) {
            var encodedContent = messageContentNode;
            if (encodedContent) {
              var decodedContent = atob(encodedContent.replace(/-/g, '+').replace(/_/g, '/'));
            }
            else {
              var decodedContent = ""
            }
            // var html = $.parseHTML(decodedContent);
            return decodedContent;
          }

//////// Length determining
          var determineEmailLength = function(fullMessageObject){
            if (isGmailContent === true){
              gmailEmailLength = gmailContentLength(fullMessageObject);
              return gmailEmailLength;
            }
            else {
              nonGmailEmailLength = nonGmailContentLength(fullMessageObject);
              return nonGmailEmailLength;
            }
          }

// Gmail
          gmailExtraContentLength = function(messageHTMLContent){
            var gmailExtraLength = $(messageHTMLContent).find(".gmail_extra").text().length
            if (gmailExtraLength === 0 ){
              return 0
            }
            else {
              return gmailExtraLength
            }
          }

          gmailContentLength = function(fullMessageObject){
            var messageHTMLContent = returnAppropriateContentFormat(fullMessageObject);
            var totalMessageLength = messageHTMLContent.length;
            var extraContentLength = gmailExtraContentLength(messageHTMLContent);
            var messageLengthMinusExtra = totalMessageLength - extraContentLength;
            return messageLengthMinusExtra
          }

// Non-gmail
          var nonGmailContentLength = function(messageObject) {
            var messageContent = returnAppropriateContentFormat(messageObject);
            var messageContentLength = messageContent.length;
            return messageContentLength
          }

//////// tableContentParser
// *Still must write


//////// Apply label                                                  **currentMessage needs to be passed as arg
          var extraContent = 0;  // This may not be necessary
          var tempCharLimit = 640;
          var isGmailContent = false;

          var applyAppropriateLabel = function(conciseMsgLabelId, lengthyMsgLabelId) {
            for(var i=0; i < messageContentsArr.length; i++){
              isGmailContent = false;
              var labelIdsArr = [];
              var currentMessage = messageContentsArr[i];
              var messageID = currentMessage.id;
              var emailLength = determineEmailLength(currentMessage);
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






          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: "Hi"}, function(response) {
            });
          });
        }
      );
    });
  }
})






























