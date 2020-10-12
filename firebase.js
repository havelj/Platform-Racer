var firebaseConfig = {
    apiKey: "AIzaSyBNfrM9HKRoylk4-jqL0QPSu5o73eK26K8",
    authDomain: "platform-racer.firebaseapp.com",
    databaseURL: "https://platform-racer.firebaseio.com",
    projectId: "platform-racer",
    storageBucket: "platform-racer.appspot.com",
    messagingSenderId: "518309973615",
    appId: "1:518309973615:web:eadfc46eeca538345ac79a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let myDatabase = firebase.database();

//Push the score to the database
function writeNewPost(username, score, time) {
    // A post entry.
    var postData = {
        user: username,
        score: score,
        time: time
    };

    myDatabase.ref("High Scores").push(postData);
}

//Fill High Score List
function fillHighScoreList() {
    var players = myDatabase.ref("High Scores").orderByChild('time').on("child_added", function (snapshot) {
        $("#high-scores").append('<li>' + snapshot.val().user + ", " + snapshot.val().time + '</li>');
    });

}