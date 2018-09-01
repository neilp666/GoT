var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);

  Alexa.dynamoDBTable = 'testGOT';

  alexa.registerHandlers(handlers);
  alexa.execute();

};

var handlers = {
  'LaunchRequest': function() {
      this.emit('WelcomeIntent');
  },
  'WelcomeIntent': function() {
      this.emit(':ask', 'Welcome to the Game of Thrones Characters Skill! Please pick a random number from one to seven hundred to select a character');
  },
  'MyIntent': function() {
      var randomNumber = this.event.request.intent.slots.number.value;
      var myRequest = parseInt(randomNumber);

      httpsGet (myRequest, (myResult) => {
          console.log("sent     : " + myRequest);
          console.log("received : " + myResult);

          this.emit(':tell', `This Game of Thrones character is ${myResult.name} which also has the title of ${myResult.titles}`);
          this.attributes['character_name'] = myResult.name;
          this.attributes['character_title'] = myResult.titles;
          this.emit(':responseReady');
      }
    };
  }
};

var https = require('https');

function httpsGet (myData, callback) {

  var options = {
    host: 'anapioficeandfire.com',
    post 443,
    path: '/api/characters/' + encodeURIComponent(myData),
    method: 'GET',
  };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on.on('end', () => {
            var pop = JSON.parse(returnData);
            callback(pop);
        });
    });

  req.end();
}
