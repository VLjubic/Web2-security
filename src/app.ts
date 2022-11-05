import path from "path";
import https from "https";
import fs from "fs";
import express from "express";
const cookieParser = require("cookie-parser");

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port =
  externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4020;

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async function (req: any, res: any) {
  res.clearCookie("username");
  res.clearCookie("password");
  res.clearCookie("sessionID");
  res.render("index");
});

app.get("/input", function (req, res) {
  let text: any = req.query.text,
    security: any = req.query.security;
  let retText: any;
  if (security == "true") {
    retText = text.replace(/[&/\\#,+()$~%.^'":*?<>{}]/g, "");
    let pero = retText;
    res.render("xss", { pero, retText, username: req.cookies["username"] });
  } else {
    res.render("xss", { text, username: req.cookies["username"] });
  }
});

app.get("/loginXss", function (req, res) {
  res.render("loginXss");
});

app.get("/loginBroken", function (req, res) {
  res.render("loginBroken");
});

app.get("/xss", function (req, res) {
  res.render("xss", { username: req.cookies["username"] });
});

app.get("/brokenAuth", function (req, res) {
  res.render("brokenAuth", { username: req.cookies["username"] });
});

app.post("/xss", function (req, res) {
  let { username, password } = req.body;
  res.cookie("username", username, { maxAge: 900000, httpOnly: false });
  res.cookie("password", password, { maxAge: 900000, httpOnly: false });
  res.render("xss", { username });
});

app.get("/broken", function (req, res) {
  let username: any = req.query.username,
    security: any = req.query.security;
  if (security == "true") {
    res.cookie("sessionID", 1234, { maxAge: 900000, httpOnly: true });
    res.render("brokenAuth", { username });
  } else {
    res.cookie("sessionID", 1234, { maxAge: 900000, httpOnly: false });
    res.render("brokenAuth", { username });
  }
});

if (externalUrl) {
  const hostname = "127.0.0.1";
  app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
  outside on ${externalUrl}`);
  });
} else {
  https
    .createServer(
      {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      },
      app
    )
    .listen(port, function () {
      console.log(`Server running at https://localhost:${port}/`);
    });
}

module.exports = app;
