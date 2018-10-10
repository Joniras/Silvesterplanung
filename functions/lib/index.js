const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp();
exports.fcmSend = functions.database.ref('/messages/{userId}/{messageId}').onCreate((event, context) => {
    const message = event.val();
    const userId = context.params.userId;
    const payload = {
        notification: {
            title: message.title,
            body: message.body,
            icon: message.img ? message.img : "https://placeimg.com/100/100/people",
            actionUrl: "localhost:4200/prices"
        }
    };
    admin.database()
        .ref(`/fcmTokens/${userId}`)
        .once('value')
        .then(token => {
        return token.val();
    })
        .then(userFcmToken => {
        return admin.messaging().sendToDevice(userFcmToken, payload);
    })
        .then(res => {
        console.log("Sent Successfully", res);
    })
        .catch(err => {
        console.log(err);
    });
});
//# sourceMappingURL=index.js.map