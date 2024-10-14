// import fetch from "node-fetch"
// async function fetchData(){

//     const res = await fetch('http://localhost:3000/',{method:'POST'})

//     const data = await res.text()
//     res.send(data)

// }

// fetchData()

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});
app.post("/", (req, res) => {
  res.send("post method");
});
app.put("/", (req, res) => {
  res.send("put method");
});
app.patch("/", (req, res) => {
  res.send("pathc mathod");
});
app.delete("/", (req, res) => {
  res.send("delete method");
});

app.listen(3000, () => {
  console.log("server started")
});
