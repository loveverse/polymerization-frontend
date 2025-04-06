import express, {Express} from "express";
import axios from "axios";

const app: Express = express()

app.get("/api", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")

  axios.get("https://imzujuan.xkw.com/Answer/26452541/2/843/14/28/8417fd2d1bb74d77a79ffbede64bb1be4da2?enVqdWFu=eyJ1c2VySWQiOiI4MDY1NjY1NCIsInVzZXJfdG9rZW4iOiJBQm0ycjBjMUIifQ%3D%3D", {responseType: "arraybuffer"}).then(response => {
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data)
  }).catch(error => {
    res.status(500).send("错误")
  })

})

app.listen(4100, () => {
  console.log("Express server started run: localhost:4100");
})
