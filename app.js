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

// 创建管理员用户，如果管理员用户存在则返回
{
    const {db} = require("./Schema/config.js");
    const UserSchema = require("./Schema/user.js");
    const encrypt = require("./until/encrypt.js");


    // 通过db对象创建操作user数据库的模型对象
    const User = db.model("users", UserSchema);

    // 创建管理员账户
    User
        .find({username: "admin"})
        .then(data => {
            if(data.length === 0){
                // 管理员账户不存在
                new User({
                    username: "admin",
                    password: encrypt("admin"),
                    role: 888,
                    commentNum: 0,
                    articleNum: 0
                })
                .save()
                .then(data => {
                    console.log("管理员用户名: admin 密码:admin131415926")
                })
                .catch(err => {
                    console.log("管理员账号检查失败")
                })
            } else{
                console.log("管理员用户名: admin 密码:admin131415926")
            }
        })
}