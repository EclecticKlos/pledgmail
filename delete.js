// This file is used for development purposes only, and will be deleted in final release versions.






// <div dir="ltr">Incoming reply content from someone else.<div class="gmail_extra"><br><div class="gmail_quote">On Thu, Jul 9, 2015 at 11:03 AM, Dan Klos <span dir="ltr">&lt;<a href="mailto:dan@pledgmail.com" target="_blank">dan@pledgmail.com</a>&gt;</span> wrote:<br><blockquote class="gmail_quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex"><div dir="ltr">Outgoing message content from me</div>
// </blockquote></div><br><br clear="all"><div><br></div>-- <br><div><div dir="ltr"><div><div dir="ltr"><div><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div dir="ltr"><div>Dan Klos</div><div><a href="tel:734-945-2331" value="+17349452331" target="_blank">734-945-2331</a></div></div></div></div></div></div></div></div></div></div></div></div></div></div>
// </div></div>













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

































