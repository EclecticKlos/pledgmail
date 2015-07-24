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





tables = html[1].getElementsByTagName("table");
tableString = "";
for(var i=0; i < tables.length; i++){
  tableString.push(tables[i].innerText)
}

str = str.replace(/\s/g, '');



Error:{"readyState":4,"responseText":"{\n \"error\": {\n  \"errors\": [\n   {\n    \"domain\": \"usageLimits\",\n    \"reason\": \"rateLimitExceeded\",\n    \"message\": \"Too many concurrent requests for user\"\n   }\n  ],\n  \"code\": 429,\n  \"message\": \"Too many concurrent requests for user\"\n }\n}\n","responseJSON":{"error":{"errors":[{"domain":"usageLimits","reason":"rateLimitExceeded","message":"Too many concurrent requests for user"}],"code":429,"message":"Too many concurrent requests for user"}},"status":429,"statusText":"OK"}



messageObject.payload.headers[4].value
"from omr-a010e.mx.aol.com (omr-a010e.mx.aol.com. [204.29.186.54])        by mx.google.com with ESMTPS id rt15si7151192pab.240.2015.07.22.17.02.17        for <dan@pledgmail.com>        (version=TLSv1 cipher=RC4-SHA bits=128/128);        Wed, 22 Jul 2015 17:02:17 -0700 (PDT)"


"from mail-wi0-x22e.google.com (mail-wi0-x22e.google.com. [2a00:1450:400c:c05::22e])        by mx.google.com with ESMTPS id bs1si15589532wjc.24.2015.07.24.09.01.56        for <dan@pledgmail.com>        (version=TLSv1.2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128);        Fri, 24 Jul 2015 09:01:56 -0700 (PDT)"


name: "Message-ID"
value: "<CAGjX0hC4nUhJ5otYVQzddbsjP=eOdYXSnUpxmQGO3b4hQ-XkFA@mail.gmail.com>"

name: "Message-Id"
value: "<14eb83ae96c-50be-c1c2@webstg-m07.mail.aol.com>"

