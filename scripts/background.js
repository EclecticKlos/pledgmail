//////////////// BEGIN TESTING
  var background = chrome.extension.getBackgroundPage();

// var nonAuthApiKey = "AIzaSyB2V-yBQqZB6U3vM4urVKpBoksYXW2IeMs"

// $.getScript('https://apis.google.com/js/client.js?onload=init', function(){

  // alert("Inside the script")
  // function init() {
  //   gapi.client.setApiKey(nonAuthApiKey);
  //   alert("Set API key fired")
  // }



  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        thisToken = token
        // alert("HERE")
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

            var allThreads = gapiGETRequest(gapiRequestInboxThreadsAndToken);
            var allMessagesReceived = gapiGETRequest(gapiRequestInboxMessagesAndToken)
            var allThreadsObject = JSON.parse(allThreads);
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
                var encodedMessageContents = currentMessage.payload.parts[0].body.data
                var decodedMessageContents = atob(encodedMessageContents.replace(/-/g, '+').replace(/_/g, '/'));
                messageContentsArr.push(decodedMessageContents)
              }
            }

            getIdsOfMessagesWithContents(allMessagesObject);
            getMessageContents(messageIdsOfMessagesWithContent);

            var labelsRequestURL = "https://www.googleapis.com/gmail/v1/users/me/labels?access_token=" + thisToken;

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
                  alert(JSON.stringify(msg));
                },
                error: function(msg){
                  alert("Error:" + JSON.stringify(msg));
                }
              })
            }

            var existingLabels = JSON.parse(gapiGETRequest(labelsRequestURL))
            var labelNameForMessageContentTooLong = "TooLong"
            var labelNameForConciseMessageContent = "Concise"
            var makePledgmailLabelsIfNecessary = function(){
              var labelTooLongExists = false;
              var labelConciseExists = false;
              for (var i=0; i < existingLabels.labels.length; i++){
                if (existingLabels.labels[i].name === labelNameForMessageContentTooLong){
                  labelTooLongExists = true;
                }
                else if (existingLabels.labels[i].name === labelNameForConciseMessageContent){
                  labelConciseExists = true;
                }
              }
              if (labelTooLongExists === false && labelConciseExists === false){
                createLabel(labelsRequestURL, labelNameForMessageContentTooLong);
                createLabel(labelsRequestURL, labelNameForConciseMessageContent);
              }
              else if (labelTooLongExists === false){
                createLabel(labelsRequestURL, labelNameForMessageContentTooLong);
              }
              else if (labelConciseExists === false){
                createLabel(labelsRequestURL, labelNameForConciseMessageContent);
              }
            }

            makePledgmailLabelsIfNecessary();





            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {data: existingLabels}, function(response) {
                // alert(response.farewell);
              });
            });


              // var getListOfThreadsFromGAPI = function listThreads(userId, callback) {
              //   // alert("I AM HERE 2222")
              //   var getPageOfThreads = function(request, result) {
              //     request.execute(function (resp) {
              //       // alert("I AM HERE 4444")
              //       result = result.concat(resp.threads);
              //       var nextPageToken = resp.nextPageToken;
              //       if (nextPageToken) {
              //         request = gapi.client.gmail.users.threads.list({
              //           'userId': me,
              //           'pageToken': nextPageToken
              //         });
              //         getPageOfThreads(request, result);
              //       } else {
              //         callback(result);
              //       }
              //     });
              //   };
              //   // alert("I AM HERE 33333")
              //   // alert(thisToken)
              //   // alert(gapi)
              //   var request = gapi.client.gmail.users.threads.list({
              //     'userId': userId
              //   });
              //   // alert("I AM HERE 4444")
              //   getPageOfThreads(request, []);
              // }

              // // alert("Before function execution")
              // var testListOfThreads = getListOfThreadsFromGAPI("me")

              // // alert(testListOfThreads)




            // sendResponse({token: thisToken});
          }
        );
      });
    }
  })
// });






//////////////// END TESTING



// console.log("Background.js is loading ******************************")

// //oauth2 auth
// chrome.identity.getAuthToken(
//   {'interactive': true},
//   function(){
//     //load Google's javascript client libraries
//     window.gapi_onload = authorize;
//     loadScript('https://apis.google.com/js/client.js');
//   }
// );


// function loadScript(url){
//   var request = new XMLHttpRequest();

//   request.onreadystatechange = function(){
//     if(request.readyState !== 4) {
//       return;
//     }

//     if(request.status !== 200){
//       return;
//     }

//     eval(request.responseText);
//   };

//   request.open('GET', url);
//   request.send();
// }

// function authorize(){
//   console.log("This is the authorize function")
//   gapi.auth.authorize(
//     {
//       client_id: '887620817404-05g424mgdqpa6dm3trah3h83jbrtk9di.apps.googleusercontent.com',
//       immediate: true,
//       scope: 'https://www.googleapis.com/auth/gmail.modify'
//     },
//     function(){
//       gapi.client.load('gmail', 'v1', gmailAPILoaded);
//     }
//   );
// }

// function gmailAPILoaded(){
//     //do stuff here
// }


// /* here are some utility functions for making common gmail requests */
// function getThreads(query, labels){
//   return gapi.client.gmail.users.threads.list({
//     userId: 'me',
//     q: query, //optional query
//     labelIds: labels //optional labels
//   }); //returns a promise
// }

// //takes in an array of threads from the getThreads response
// function getThreadDetails(threads){
//   var batch = new gapi.client.newBatch();

//   for(var ii=0; ii<threads.length; ii++){
//     batch.add(gapi.client.gmail.users.threads.get({
//       userId: 'me',
//       id: threads[ii].id
//     }));
//   }

//   return batch;
// }

// function getThreadHTML(threadDetails){
//   var body = threadDetails.result.messages[0].payload.parts[1].body.data;
//   return B64.decode(body);
// }

// function archiveThread(id){
//   var request = gapi.client.request(
//     {
//       path: '/gmail/v1/users/me/threads/' + id + '/modify',
//       method: 'POST',
//       body: {
//         removeLabelIds: ['INBOX']
//       }
//     }
//   );

//   request.execute();
// })
