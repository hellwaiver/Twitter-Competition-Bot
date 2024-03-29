const rwClient = require("./twitterClient.js");
const config = require("./config.js");
const Tweet = require('./tweet.js');
const databaseClient = require("./databaseClient.js");
let mongoClient;
let savedTweets;
let loggedInUser;

configureAndStart();

async function configureAndStart(){
    //mongoDb connections are limited, reuse the connection!
    mongoClient = await databaseClient.connectToCluster();
    const db = mongoClient.db('twitter-competitions');
    savedTweets = db.collection('tweets');
    //Get the logged in user
    loggedInUser = await rwClient.currentUserV2();
    //Main startup method
    start()
}

async function start(){
        //All exceptions are handled at this level because the only exception we expect to handle is the rate limit,
        //otherwise we can just log it.
        try{
            //Retrieve from database which tweets have been entered
            const enteredCompetitionTweets = [];
            const databaseTweetCursor = await savedTweets.find();
            await databaseTweetCursor.forEach((tweet)=>{
                //Multiple bots can enter the same competition, so filter by the logged in user id.
                //Check for undefined is because of legacy data without loggedInUser properties
                if (!tweet.loggedInUserId || tweet.loggedInUserId == loggedInUser.data.id){
                    enteredCompetitionTweets.push(tweet)
                }
            })

            //Search Twitter API for new competition tweets
            const foundTweets = (await findTweets()).data;


            //Remove already entered competitions from search results by looking for matching text as (some scammers tweet the same text across multiple accounts/tweets)
            //ID is also needed, because the originally entered competition tweet can have its text edited, so a text match isn't sufficient
            const tweetsToAction = foundTweets.data
            .filter((tweet)=>enteredCompetitionTweets
            .every((x)=> x.tweetId != tweet.id && x.text != tweet.text))
            //WAIT A MINIMUM OF 10 MINUTES
            const startTime = Date.now();
            //Process competition actions against filtered tweets
            await processTweets(tweetsToAction, savedTweets, loggedInUser);
            //Start timer if needed to rate limit
            const endTime = Date.now();
            const timeTaken = endTime - startTime;
            if(timeTaken < config.searchRateLimitsMilliseconds){                
                const timeToWait = config.searchRateLimitsMilliseconds - timeTaken
                console.log(`Took ${timeTaken/60000} minutes to process tweets, requires ${config.searchRateLimitsMilliseconds/60000}... 
                Waiting the remaining ${timeToWait/60000} minutes before continuing`)
                await new Promise(resolve => setTimeout(resolve, timeToWait));
            }
            
            
            //Restart process!
            start();

        }
        catch(err){

            //If we hit the rate limit, wait a while and restart
            if(err.rateLimit != undefined && err.rateLimit.remaining < 1){
                //Calculate wait time until rate limit hit
                const now = Date.now();
                const requestsResetMilliseconds = err.rateLimit.reset * 1000;

                //Random number added to reduce suspicion
                const randomNumber = Math.floor(Math.random() * (config.maxRandomWait - 0 + 1) + 0);
                const waitTime = (requestsResetMilliseconds - now) + randomNumber;

                console.log(`Max requests reached! Waiting for ${(waitTime/1000)/60} minutes ⏳`)

                //await the timer to elapse and restart
                await new Promise(resolve => setTimeout(resolve, waitTime));
                start();
            }
            else{
                console.error(new Date() + err);

                //Try to restart after waiting
                const timeToWait = config.searchRateLimitsMilliseconds;
                await new Promise(resolve => setTimeout(resolve, timeToWait));
                start()
            }
        }

}

async function processTweets(tweets, mongoDbCollection, loggedInUser){

    for(let i = 0; i < tweets.length; i++){
        const tweet = new Tweet(tweets[i], loggedInUser);

        //Keep competition entries SFW (as much as possible)
        if(tweet.sensitiveContent){continue};

        //Complete follow, like, retweet, tag actions where applicable
        const tweetProcessedData = await tweet.process();

        //If no actions can be made, skip the tweet!
        if(!tweetProcessedData.processed){
            continue
        }

        //Add successfully entered competition tweets to external database (Heroku wipes data on restart, data is stored in mongo)
        await mongoDbCollection.insertOne(
            {
                tweetId: tweet.tweet.id, text: 
                tweet.tweet.text, 
                tweetCreatedAt: tweet.tweet.created_at, 
                enteredCompetitionTime: tweetProcessedData.dateProcessed,
                liked: tweetProcessedData.liked,
                followed: tweetProcessedData.followed,
                retweeted: tweetProcessedData.retweeted,
                taggedFriends: tweetProcessedData.friendsTagged,
                loggedInUserId: loggedInUser.data.id
            });

        //Random wait interval to avoid detection, defined by the config. User information
        const randomNumber = Math.floor(Math.random() * (config.maxRandomWait - 0 + 1) + 0);
        const randomWaitTime = config.minTweetInterval + randomNumber;
        console.log(`
----------------------------------------------------------------
Sleeping for ${(Math.floor(randomWaitTime/1000)/60)} minutes 😴
----------------------------------------------------------------`)
        await new Promise(resolve => setTimeout(resolve, randomWaitTime));
    }
}

function findTweets(){
    //Parse search criteria from config file and return the search promise
    const searchTerms = `"${config.searchItems.join('" OR "')}"`;
    const negativeSearchItems = `-${config.negativeSearchItems.join(' -')}`
    const params = { 'max_results': config.searchRateLimitResults, 'expansions': 'author_id', 'tweet.fields': 'possibly_sensitive,created_at'}

    const x = `(${searchTerms}) -is:retweet -is:quote -is:reply ${negativeSearchItems}`;
    return rwClient.v2.search(`(${searchTerms}) -is:retweet -is:quote -is:reply ${negativeSearchItems}`, params);
    
}


