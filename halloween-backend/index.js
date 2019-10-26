// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require("ask-sdk-core");
const { getTrickOrTreat, initTrickOrTreat } = require("./trickOrTreat.js");
const maxNumberOfShards = 2;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
        );
    },
    handle(handlerInput) {
        // const speakOutput = `Welcome to trick or treat. <audio src="soundbank://soundlibrary/human/amzn_sfx_laughter_giggle_01"/> How many players are entering the spook zone?`;
        const speakOutput = 'yo'
        return (
            handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(false)
                //.reprompt(speakOutput)
                .getResponse()
        );
    }
};
const NumberOfPlayerIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === "numberOfPlayersIntent"
        );
    },
    handle(handlerInput) {

        const slot = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number')

        // const speakOutput = `Prepare for a fright. <audio src="soundbank://soundlibrary/monsters/pigmy_bats/pigmy_bats_09"/> There is no turning back.`;

        const speakOutput = `ok, lets begin.`;
        const playerShardsRemaining = [];
        for (let i = 0; i < slot; i++) {
            playerShardsRemaining.push(maxNumberOfShards);
        }

        const sessionAttributes = {};
        Object.assign(sessionAttributes, {
            numberOfPlayers: slot,
            currentPlayer: 1,
            playerShardsRemaining,
            remainingTricksAndTreats: initTrickOrTreat()
        });

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt("I'll ask you again: how many players?")
            .getResponse();
    }
};

const TrickOrTreatIntentHandler = {

    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'trickOrTreatIntent'
        )
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const { numberOfPlayers, currentPlayer, remainingTricksAndTreats } = sessionAttributes
        const trickOrTreat = getTrickOrTreat(remainingTricksAndTreats.tricks, remainingTricksAndTreats.treats);
        const speakOutput = `${trickOrTreat}. Do you accept your fate?`

        return handlerInput
            .responseBuilder
            .speak(speakOutput)
            .reprompt('testing reprompt')
            .getResponse()
    }
}

const AcceptFateIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AcceptFateIntent'
        )
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const { numberOfPlayers, currentPlayer, playerShardsRemaining } = sessionAttributes

        sessionAttributes.currentPlayer = (currentPlayer < numberOfPlayers) ? currentPlayer + 1 : 1;

        const remaining = playerShardsRemaining[currentPlayer - 1];
        const speakOutput = `Excellent! You have ${remaining} soul shards remaining. Player ${sessionAttributes.currentPlayer} I am waiting for you lurker.`
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput
            .responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse()
    }
}

const DeclineFateIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'DeclineFateIntent'
        )
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
        const { numberOfPlayers, currentPlayer, playerShardsRemaining } = sessionAttributes
        const index = currentPlayer - 1;
        const newRemainingShards = playerShardsRemaining[index] - 1;

        if (newRemainingShards > 0) {
            sessionAttributes.currentPlayer = (currentPlayer < numberOfPlayers) ? currentPlayer + 1 : 1;

            sessionAttributes.playerShardsRemaining[index] = newRemainingShards;

            const speakOutput = `You’ve lost a crucial part of your soul, you only have ${newRemainingShards} shards left before your doom! Player ${sessionAttributes.currentPlayer} tell me if you are ready.`
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput
                .responseBuilder
                .speak(speakOutput)
                .reprompt('testing reprompt')
                .getResponse()
        }

        const speakOutput = `You’ve lost your soul, you are doomed for all eternity. You've ended the game, I'm sure your friends are very proud of you.`;
        return handlerInput
            .responseBuilder
            .speak(speakOutput)
            .getResponse()
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
        );
    },
    handle(handlerInput) {
        const speakOutput = "You can say hello to me! How can I help?";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('please try again')
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) ===
                "AMAZON.CancelIntent" ||
                Alexa.getIntentName(handlerInput.requestEnvelope) ===
                "AMAZON.StopIntent")
        );
    },
    handle(handlerInput) {
        const speakOutput = "Happy Halloween!";
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) ===
            "SessionEndedRequest"
        );
    },
    handle(handlerInput) {
        // Any cleanup logic goes here
        return handlerInput
            .responseBuilder
            .speak('Happy Halloween')
            .getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
        );
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return (
            handlerInput.responseBuilder
                .speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse()
        );
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `It's Halloween, pumpkin head, speak up. I need to hear you clear and loud`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NumberOfPlayerIntentHandler,
        TrickOrTreatIntentHandler,
        AcceptFateIntentHandler,
        DeclineFateIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
