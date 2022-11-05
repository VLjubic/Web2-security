"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var https_1 = __importDefault(require("https"));
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var cookieParser = require("cookie-parser");
var port = 4020;
var app = (0, express_1["default"])();
app.set("views", path_1["default"].join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express_1["default"].json());
app.use(express_1["default"].static(path_1["default"].join(__dirname, "public")));
app.use(express_1["default"].urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.clearCookie("username");
            res.clearCookie("password");
            res.render("index");
            return [2 /*return*/];
        });
    });
});
app.get("/input", function (req, res) {
    var text = req.query.text, security = req.query.security;
    var retText;
    if (security == "true") {
        retText = text.replace(/[&/\\#,+()$~%.^'":*?<>{}]/g, "");
        var pero = retText;
        res.render("xss", { pero: pero, retText: retText, username: req.cookies["username"] });
    }
    else {
        res.render("xss", { text: text, username: req.cookies["username"] });
    }
});
app.get("/login", function (req, res) {
    res.render("login");
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
    var _a = req.body, username = _a.username, password = _a.password;
    res.cookie("username", username, { maxAge: 900000, httpOnly: false });
    res.cookie("password", password, { maxAge: 900000, httpOnly: false });
    res.render("xss", { username: username });
});
app.get("/broken", function (req, res) {
    var username = req.query.username, security = req.query.security;
    if (security == "true") {
        res.cookie("sessionID", 1234, { maxAge: 900000, httpOnly: true });
        res.render("brokenAuth", { username: username });
    }
    else {
        res.cookie("sessionID", 1234, { maxAge: 900000, httpOnly: false });
        res.render("brokenAuth", { username: username });
    }
});
// app.get("/table", function (req, res) {
//   let username: string | undefined;
//   if (req.oidc.isAuthenticated()) {
//     username = req.oidc.user?.name ?? req.oidc.user?.sub;
//   }
//   Table.findAll({
//     attributes: ["clubName", "points", "difference"],
//     order: [
//       ["points", "DESC"],
//       ["difference", "DESC"],
//     ],
//   })
//     .then((table: any) => {
//       res.render("table", {
//         table: JSON.parse(JSON.stringify(table)),
//         username,
//       });
//     })
//     .catch((err: any) => console.log(err));
// });
// app.get("/games", async function (req, res) {
//   let username: string | undefined | false;
//   let userInfo: any, admin: boolean;
//   if (req.oidc.isAuthenticated()) {
//     username = req.oidc.user?.name ?? req.oidc.user?.sub;
//     userInfo = await req.oidc.fetchUserInfo();
//     admin = isAdmin(userInfo);
//   } else {
//     username = false;
//     admin = false;
//   }
//   Game.findAll({
//     attributes: [
//       "id",
//       "round",
//       "homeTeam",
//       "awayTeam",
//       "homeResult",
//       "awayResult",
//     ],
//     order: [["id", "ASC"]],
//   })
//     .then((games: any) => {
//       res.render("games", {
//         games: JSON.parse(JSON.stringify(games)),
//         username,
//         admin: admin,
//       });
//     })
//     .catch((err: any) => console.log(err));
// });
// app.post("/getComments", requiresAuth(), async function (req, res) {
//   let { gameId } = req.body;
//   let userInfo: any, admin: boolean, email: string;
//   userInfo = await req.oidc.fetchUserInfo();
//   admin = isAdmin(userInfo);
//   email = userInfo.email;
//   Comment.findAll({
//     attributes: ["id", "gameId", "text", "userId", "createdAt", "updatedAt"],
//     where: {
//       gameId: gameId,
//     },
//   })
//     .then((comments: any) => {
//       User.findAll({})
//         .then((users: any) => {
//           res.render("comments", {
//             comments: JSON.parse(JSON.stringify(comments)),
//             username: req.oidc.user?.name,
//             users: JSON.parse(JSON.stringify(users)),
//             admin: admin,
//             email: email,
//           });
//         })
//         .catch((err: any) => console.log(err));
//     })
//     .catch((err: any) => console.log(err));
// });
// app.post("/games/deleteComments", requiresAuth(), function (req, res) {
//   let { commentId } = req.body;
//   Comment.destroy({ where: { id: commentId } })
//     .then((comment: any) => {
//       Game.findAll({
//         attributes: [
//           "id",
//           "round",
//           "homeTeam",
//           "awayTeam",
//           "homeResult",
//           "awayResult",
//         ],
//       })
//         .then((games: any) => {
//           res.status(200);
//           res.render("alter");
//         })
//         .catch((err: any) => console.log(err));
//     })
//     .catch((err: any) => console.log(err));
// });
// app.post("/games/editComment", requiresAuth(), async function (req, res) {
//   let { commentId, text } = req.body;
//   let userInfo: any, admin: boolean;
//   userInfo = await req.oidc.fetchUserInfo();
//   admin = isAdmin(userInfo);
//   Comment.update(
//     {
//       text,
//     },
//     { where: { id: commentId } }
//   )
//     .then((comment: any) => {
//       Game.findAll({
//         attributes: [
//           "id",
//           "round",
//           "homeTeam",
//           "awayTeam",
//           "homeResult",
//           "awayResult",
//         ],
//       })
//         .then((games: any) => {
//           res.status(200);
//           res.render("games", {
//             games: JSON.parse(JSON.stringify(games)),
//             username: req.oidc.user?.name,
//             admin: admin,
//           });
//         })
//         .catch((err: any) => console.log(err));
//     })
//     .catch((err: any) => console.log(err));
// });
// app.post("/games/editScore", requiresAuth(), async function (req, res) {
//   let { homeResult, awayResult, gameId } = req.body;
//   let userInfo: any, admin: boolean;
//   userInfo = await req.oidc.fetchUserInfo();
//   admin = isAdmin(userInfo);
//   Game.update(
//     {
//       homeResult,
//       awayResult,
//       completed: true,
//     },
//     { where: { id: gameId } }
//   )
//     .then((game: any) => {
//       Game.findAll({
//         attributes: [
//           "id",
//           "round",
//           "homeTeam",
//           "awayTeam",
//           "homeResult",
//           "awayResult",
//         ],
//         order: [["id", "ASC"]],
//       })
//         .then((games: any) => {
//           res.status(200);
//           res.render("games", {
//             games: JSON.parse(JSON.stringify(games)),
//             username: req.oidc.user?.name,
//             admin: admin,
//           });
//         })
//         .catch((err: any) => console.log(err));
//     })
//     .catch((err: any) => console.log(err));
// });
// app.post("/games/addComment", async function (req, res) {
//   let userInfo: any, admin: boolean;
//   userInfo = await req.oidc.fetchUserInfo();
//   admin = isAdmin(userInfo);
//   let { gameId, text } = req.body;
//   let userId = userInfo.email;
//   Comment.create({
//     gameId: gameId,
//     text: text,
//     userId: userId,
//   })
//     .then((comment: any) => {
//       Game.findAll({
//         attributes: [
//           "id",
//           "round",
//           "homeTeam",
//           "awayTeam",
//           "homeResult",
//           "awayResult",
//         ],
//       })
//         .then((games: any) => {
//           res.status(200);
//           res.render("games", {
//             games: JSON.parse(JSON.stringify(games)),
//             username: req.oidc.user?.name,
//             admin: admin,
//           });
//         })
//         .catch((err: any) => console.log(err));
//     })
//     .catch((err: any) => console.log(err));
// });
if (1) {
    var hostname_1 = "127.0.0.1";
    app.listen(port, hostname_1, function () {
        console.log("Server locally running at http://".concat(hostname_1, ":").concat(port, "/"));
    });
}
else {
    https_1["default"]
        .createServer({
        key: fs_1["default"].readFileSync("server.key"),
        cert: fs_1["default"].readFileSync("server.cert")
    }, app)
        .listen(port, function () {
        console.log("Server running at https://localhost:".concat(port, "/"));
    });
}
module.exports = app;
