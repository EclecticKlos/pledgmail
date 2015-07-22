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
