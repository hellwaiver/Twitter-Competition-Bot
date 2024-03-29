const config = {
    //Terms to search when finding new competitions to enter
    searchItems: ['retweet to enter', 'like to enter', 'to enter: retweet', 'to enter: follow', 'this tweet to enter', 'Retweet to win'],
    
    //Like indicators
    likeIndicators: ['like', 'tweet a like', 'heart this tweet', 'like the tweet', 'favorite the tweet', 'favourite this tweet', 'like this tweet', 'like and retweet'],
    
    //Retweet indicators
    retweetIndicators : ['retweet', 'share', 'RT', 'rt'],
    
    //Retweet indicators
    followIndicators : ['follow'],

    //Terms to exclude from the search. These are some common, annoying, undesirable keywords
    //Multi word keywords must be escaped with backslashes
    negativeSearchItems : ['NFT', 'Robux', 'Furry', 'ROBLOX', 'whitelist', 'OnlyFans', 'Whitelist', 'ROBUX', 'nudes', 'GTA', 'blockchain', 'crypto', 'Fortnite', 'BOT', 'airdrop', 'shrooms', 'grams', 'NFT', 'coin', 'digital', 'psychedelics', 'Dogecoin', 'ETH', 'XRP'],

    //These are the friends who will be tagged if tagging is required (TURNED OFF CURRENTLY)
    friendsToTag : [
    {   name: 'Josh', 
        twitterId: 1369402574743498755, 
        handle: '@hellwaiver'},
    {
        name: 'Kezia',
        twitterId: 1502053576197222404,
        handle: '@baxter_kezia'
    },
    {
        name: 'Trump',
        twitterId: 950002618163712004,
        handle: '@TheTrumpTaste'
    }],

    //Minimum amount of time between actions (retweets, likes, follows, tags) in milliseconds
    minTweetInterval:  250000,

    //The maximum amount of time in addition to the minimum wait time when generating a random wait
    maxRandomWait: 130000,

    //Collection of emojis to be used when creating a comment (used to make tweets unique)
    // emojis: ["😀","😃","😄","😁","😆","😅","😂","🤣","☺️","😊","😇","🙂","🙃","😉","😌","😍","😘","😗","😙","😚","😋","😜","😝","😛","🤑","🤗","🤓","😎","🤡","🤠","😏",
    // "😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","😤","😠","😡","😶","😐","😑","😯","😦","😧","😮","😲","😵","😳","😱","😨","😰","😢","😥","🤤","😭","😓","😪","😴","🙄",
    // "🤔","🤥","😬","🤐","🤢","🤧","😷","🤒","🤕","😈","👿","👹","👺","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾","👐","🙌","👏","🙏","🤝",
    // "👍","👎","👊","✊","🤛","🤜","🤞","✌️","🤘","👌","👈","👉","👆","👇","☝️","✋","🤚","🖐","🖖","👋","🤙","💪","🖕","✍️","🤳","💅","💍","💄","💋","👄","👅","👂","👃","👣","👁",
    // "👀", "🧠","🗣","👤","👥","👶","👦","👧","👨","👩","👱‍♀","👱","👴","👵","👲","👳‍♀","👳","👮‍♀","👮","👷‍♀","👷","💂‍♀","💂","🕵️‍♀️","🕵","👩‍⚕","👨‍⚕","👩‍🌾","👨‍🌾","👩‍🍳","👨‍🍳","👩‍🎓","👨‍🎓","👩‍🎤",
    // "👨‍🎤","👩‍🏫","👨‍🏫","👩‍🏭","👨‍🏭","👩‍💻","👨‍💻","👩‍💼","👨‍💼","👩‍🔧","👨‍🔧","👩‍🔬","👨‍🔬","👩‍🎨","👨‍🎨","👩‍🚒","👨‍🚒","👩‍✈","👨‍✈","👩‍🚀","👨‍🚀","👩‍⚖","👨‍⚖","🤶","🎅","👸","🤴","👰","🤵","👼","🤰","🙇‍♀","🙇","💁","💁‍♂"
    // ,"🙅","🙅‍♂","🙆","🙆‍♂","🙋","🙋‍♂","🤦‍♀","🤦‍♂","🤷‍♀","🤷‍♂","🙎","🙎‍♂","🙍","🙍‍♂","💇","💇‍♂","💆","💆‍♂","🕴","💃","🕺","👯","👯‍♂","🚶‍♀","🚶","🏃‍♀","🏃","👫","👭","👬","💑","👩‍❤️‍👩","👨‍❤️‍👨","💏","👩‍❤️‍💋‍👩",
    // "👨‍❤️‍💋‍👨","👪","👨‍👩‍👧","👨‍👩‍👧‍👦","👨‍👩‍👦‍👦","👨‍👩‍👧‍👧","👩‍👩‍👦","👩‍👩‍👧","👩‍👩‍👧‍👦","👩‍👩‍👦‍👦","👩‍👩‍👧‍👧","👨‍👨‍👦","👨‍👨‍👧","👨‍👨‍👧‍👦","👨‍👨‍👦‍👦","👨‍👨‍👧‍👧","👩‍👦","👩‍👧","👩‍👧‍👦","👩‍👦‍👦","👩‍👧‍👧","👨‍👦","👨‍👧","👨‍👧‍👦","👨‍👦‍👦","👨‍👧‍👧","👚","👕","👖","👔","👗","👙","👘","👠","👡",
    // "👢","👞","👟","🧣","🧤","🧥","🧦","🧢","👒","🎩","🎓","👑","⛑","🎒","👝","👛","👜","💼","👓","🕶","🌂","☂️"],
    
    //Number of items to search for
    searchRateLimitResults: 100,

    //Based on 500k searches a month, at 100 searches results a pop, we must wait at least 10 minutes between searches to avoid hitting the limit
    searchRateLimitsMilliseconds: 600000,

    //Will need to play with this figure!
    maxFollowing: 2000
}

module.exports = config