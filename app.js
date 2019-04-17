const Koa = require("koa");
const static = require("koa-static");
const views = require("koa-views");
const router = require("./routers/router.js");
const logger = require("koa-logger") ;
const body = require("koa-body");
const {join} = require("path");
const session = require("koa-session");

// 生成koa实例
const app = new Koa;

app.keys = ["this is a key"];

// session的配置对象
const CONFIG = {
    key: "Sid",
    maxAge: 72e5,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true
};

// 这个中间件必须放在最前面
// 注册日志模块
app.use(logger());

// 注册session
app.use(session(CONFIG, app));

// 配置koa-body 处理post 请求数据
app.use(body());

// 配置静态资源目录
app.use(static(join(__dirname, "public")));

// 配置视图模版
app.use(views(join(__dirname, "views"), {
    extension: "pug"
}))

// 注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log("项目正常运行，监听在3000端口")
})