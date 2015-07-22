
//////// findContentNode                                            **make currentMessage messageObject
          var findContentNode = function(messageObject) {
            if (messageObject.payload.body) {
              return messageObject.payload.body.data
            };
            else if (messageObject.payload.parts[1]){
              isGmailContent = true;
              return messageObject.payload.parts[0].body.data;
            };
            else if (messageObject.payload.parts[0]){
              if (messageObject.payload.parts[0].parts){
                debugger
                // Debugger placed as the logic for this case is likely not be complete
                // Need to check if the node below does in fact contain the data, if not add a case
                return messageObject.payload.parts[0].parts[1].body.data;
              };
              else {
                debugger
                // Debugger placed as the logic for this case is likely not be complete
                // Need to check if the node below does in fact contain the data, if not add a case
                return messageObject.payload.parts[0].body.data;
              }
            }
          }

//////// returnAppropriateContentFormat
          var returnAppropriateContentFormat = function(messageObject) {
            var messageContentNode = findContentNode(messageObject);
            var messageHTMLContent = decodeAndReturnParsedHTML(messageContentNode);
            var messageTextContent = messageHTMLContent.text();
            if (isGmailContent === true){
              return messageHTMLContent
            }
            else {
              return messageTextContent
            }
          }

//////// decodeAndReturnParsedHTML
          var decodeAndReturnParsedHTML = function(messageContentNode) {
            var encodedContent = messageContentNode;
            var decodedContent = atob(encodedContent.replace(/-/g, '+').replace(/_/g, '/'));
            var html = $.parseHTML(decodedContent);
            return html;
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
            var totalMessageLength = messageHTMLContent.text().length;
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


//////// Apply label                                                  **currentMessage needs to be passed as arg
          var extraContent = 0;  // This may not be necessary
          var isGmailContent = false;
          var tempCharLimit = 640;

          var applyAppropriateLabel = function(conciseMsgLabelId, lengthyMsgLabelId) {
            for(var i=0; i < messageContentsArr.length && i < 30; i++){
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

