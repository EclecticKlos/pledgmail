chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      thisToken = token
      chrome.runtime.onMessage.addListener(
        function(request,sender,sendResponse){

          var gapiRequestInboxThreadsAndToken = "https://www.googleapis.com/gmail/v1/users/me/threads?q=-from%3Ame+in%3Ainbox&access_token=" + thisToken
          var gapiRequestInboxMessagesAndToken = "https://www.googleapis.com/gmail/v1/users/me/messages?q=-label%3ASENT+in%3AINBOX&access_token=" + thisToken

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
              gapiRequestMessageWithId = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageIdList[i] + "?access_token=" + thisToken
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


          var labelsRequestURL = "https://www.googleapis.com/gmail/v1/users/me/labels?access_token=" + thisToken;
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

      ////////////////////// REFACTOR TO BE A CLOSURE ///////////////////
          hasExtraContent = function(messageObject){
            var encodedSignature = messageObject.payload.parts[1].body.data;
            var decodedSignature = atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/'));
            var html = $.parseHTML(decodedSignature);
            if ( ($(html).find(".gmail_extra").text().length) === 0 ){
              return false
            }
            else {
              return $(html).find(".gmail_extra")
            }
          }

          determineExtraContentLength = function(hasExtraContentFunc, currentMessage){
            var signatureContent = hasExtraContentFunc(currentMessage);
            var signatureLength = 0;
            if (signatureContent){
              signatureLength = signatureContent.text().length;
            };
            return signatureLength;
          }

          var decideWhichLabelToApply = function(conciseMsgLabelName, lengthyMsgLabelName){
            var tempCharLimit = 640;
            var messageID = 0;

            for(var i=0; i < messageContentsArr.length; i++){
              var labelIdsArr = []
              var currentMessage = messageContentsArr[i]
              var signatureLength = determineExtraContentLength(hasExtraContent, currentMessage);
              var messageID = currentMessage.id
              var encodedMessageContents = currentMessage.payload.parts[0].body.data
              var decodedMessageContents = atob(encodedMessageContents.replace(/-/g, '+').replace(/_/g, '/'));
              var totalMessageLength = decodedMessageContents.length - signatureLength

              if (totalMessageLength > tempCharLimit){
                var labelModifyURL = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageID + "/modify?access_token=" + thisToken
                labelIdsArr.push(lengthyMsgLabelName)
                applyLabel(labelModifyURL, labelIdsArr)
              }
              else if (totalMessageLength <= tempCharLimit) {
                var labelModifyURL = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageID + "/modify?access_token=" + thisToken
                labelIdsArr.push(conciseMsgLabelName)
                applyLabel(labelModifyURL, labelIdsArr)
              }
            }
          }

          decideWhichLabelToApply(conciseMessageLabelId, lengthyMessageLabelId)


          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {data: "Hi"}, function(response) {
            });
          });
        }
      );
    });
  }
})






























