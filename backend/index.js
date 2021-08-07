/*
  dependencies
*/

const express = require("express");
const admin = require("firebase-admin");

/*
  config
*/
// express
const app = express();

// firebase
const serviceAccount = require("./admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// config origin
let allowOrigin = "Access-Control-Allow-Origin";

/*
  endpoint
*/
// posts
app.get("/posts", (req, res) => {
  res.set(allowOrigin, "*");
  let posts = [];
  db.collection("posts")
    .orderBy("date", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      res.send(posts);
    });
});

// Create Post
app.post("/createPost", (req, res) => {
  res.set(allowOrigin, "*");
  res.send(req.headers);
});

/*
  listen
*/

app.listen(process.env.PORT || 3000);
