
function addGmailPolicy(Policy){
  return PubSubApp.policyBuilder()
  [(Policy)?"editPolicy":"newPolicy"](Policy)
  .addPublisher("SERVICEACCOUNT", 'gmail-api-push@system.gserviceaccount.com')
  .getPolicy();
}

function addDomainSubs(Domain,Policy){
  return PubSubApp.policyBuilder()
  [(Policy)?"editPolicy":"newPolicy"](Policy)
  .addPublisher("DOMAIN", Domain)
  .getPolicy();
}

function getSubscriptionPolicy(){
  return PubSubApp.policyBuilder()
  .newPolicy()
  .addSubscriber("DOMAIN","__PROBABLY_ADD_YOUR_DOMAIN_HERE__")
}

function CreateTopic(topicName) {
  var topic;
  PubSubApp.setTokenService(getTokenService());
  var pubservice = PubSubApp.PublishingApp(PROJECTID);
  try{topic = pubservice.newTopic(topicName)}
  catch(e){topic = pubservice.getTopic(topicName);}
  return topic;  
}

function CreateSubscription(subscriptionName,topicName,webhookUrl){
  var sub;
  PubSubApp.setTokenService(getTokenService());
  var subService = PubSubApp.SubscriptionApp(PROJECTID);
  try{sub = subService.newSubscription(subscriptionName,topicName,webhookUrl)}
  catch(e){sub = subService.getSubscription(subscriptionName,topicName,webhookUrl)}
  return sub;
}


function getTokenService(){
  var jsonKey = JSON.parse(PropertiesService.getScriptProperties().getProperty("jsonKey"));  
  var privateKey = jsonKey.private_key;
  var serviceAccountEmail = jsonKey.client_email; 
  var sa = init(privateKey, ['https://www.googleapis.com/auth/pubsub'], serviceAccountEmail);
  sa.addUser(serviceAccountEmail)
  .requestToken();
  return sa.tokenService(serviceAccountEmail);
}

function getLabelIdByName(name = "INBOX") {
  const labels = Gmail.Users.Labels.list('me').labels;
  const labelId = labels.find(l => l.name == name).id;
  return labelId;
}

function requestGmailScope_(){GmailApp.getAliases()}

