//////////////// BEGIN TESTING

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   });
// });

var nonAuthApiKey = "AIzaSyB2V-yBQqZB6U3vM4urVKpBoksYXW2IeMs"
alert("Background page")

  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        thisToken = token
        alert("HERE")
        chrome.runtime.onMessage.addListener(
          function(request,sender,sendResponse){
            var gapiRequestUrlAndToken = "https://www.googleapis.com/gmail/v1/users/me/threads?access_token=" + thisToken

            var hopeThisWorks = function (gapiRequestURL)
              {
                  var xmlHttp = new XMLHttpRequest();
                  xmlHttp.open( "GET", gapiRequestURL, false );
                  xmlHttp.send( null );
                  return xmlHttp.responseText;
              }

            alert(gapiRequestUrlAndToken)
            alert("didnt break")
            alert(hopeThisWorks(gapiRequestUrlAndToken));
            alert("STILL didnt break")







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
