// This file is used for development purposes only, and will be deleted in final release versions.


////////////////////////////////////////////////////////  vv   USE FOR REFACTORING!!  vv //////////////////////////////////////////////////////////

// var gapiGETRequest = function (gapiRequestURL)
//   {
//       var xmlHttp = new XMLHttpRequest();
//       xmlHttp.open( "GET", gapiRequestURL, false );
//       xmlHttp.send( null );
//       return xmlHttp.responseText;
//   }

// var gapiRequestInboxMessagesAndToken = "https://www.googleapis.com/gmail/v1/users/me/messages?q=-label%3ASENT+in%3AINBOX&access_token=" + thisToken
// var allMessagesReceived = gapiGETRequest(gapiRequestInboxMessagesAndToken)
// var allMessagesObject = JSON.parse(allMessagesReceived)
// var messageIdsOfReceivedMessages = [];
// var getIdsOfReceivedMessages = function(responseObject){
//   for(var i=0; i < responseObject.messages.length; i ++) {
//     messageIdsOfReceivedMessages.push(responseObject.messages[i].id);
//   }
// }

// var messageContentsArr = [];
// var getMessageContents = function(messageIdList)
// {
//   for(var i=0; i < messageIdList.length; i++)
//   {
//     var gapiRequestMessageWithId = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageIdList[i] + "?access_token=" + thisToken
//     var currentMessage = JSON.parse(gapiGETRequest(gapiRequestMessageWithId))
//     var encodedMessageContents = currentMessage.payload.parts[0].body.data
//     var decodedMessageContents = atob(encodedMessageContents.replace(/-/g, '+').replace(/_/g, '/'));
//     messageContentsArr.push(decodedMessageContents)
//   }
// }

// getIdsOfReceivedMessages(allMessagesObject);
// getMessageContents(messageIdsOfReceivedMessages);

////////////////////////////////////////////////////////  ^^   USE FOR REFACTORING!!  ^^ //////////////////////////////////////////////////////////

































