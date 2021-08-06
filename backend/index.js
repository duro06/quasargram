/*
  dependencies
*/

const express = require("express");

/*
  config -express
*/
const app = express();

/*
  endpoint
*/
// posts
app.get("/posts", (req, res) => {
  let posts = [
    {
      caption: "golden gate",
      location: "san fransisco, USA",
    },
    {
      caption: "London eye",
      location: "London, England",
    },
  ];
  res.send(posts);
});

/*
  listen
*/

app.listen(3000);
