const Router = require("koa-router");
// 获取用户表的控制层
const user = require("../control/user.js")
// 获取文章控制层
const article = require("../control/article.js")

const comment = require("../control/comment.js")
const admin = require("../control/admin.js")
const upload = require("../until/upload.js")

const router = new Router;

// 设计首页 ctx是一次请求的上下文对象
router.get("/", user.keepLog, article.getList);
/*
router.get("/", user.keepLog, async (ctx) => {
    // ctx.body = "index"
    // 因为app.js里面配置了视图模版的路径，这里的路径都是相对于设置好的哪个文件夹
    // 模版引擎的后缀可以不写 根目录也可以不写
    await ctx.render("index.pug", {
        title: "个人博客",
        session:ctx.session
    });
})
*/

// 动态路由 用来处理用户的登录、注册状态
/*
    router.get("/user/:id", async (ctx) => {
        ctx.body = ctx.params.id;
    })
*/
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
    // show为真（true）则显示注册界面   show为真（false）则显示登录界面
    const show = /reg$/.test(ctx.path);
    await ctx.render("register", {show})
})
/*
// 处理用户登录的post请求
router.post("/user/login", async (ctx) => {
    // console.log("用户正在登陆");
    // console.log(ctx.request.body);
    // 获取登录的账号和密码
    const data = ctx.request.body;

    //登录需要把获取的账户、密码和数据库的对比下
})
*/

// 注册用户路由
router.post("/user/reg", user.reg);

// 用户登录路由
router.post("/user/login", user.login);

// 用户退出登录状态
router.get("/user/logout", user.logout)

// 文章发表页面路由
router.get("/article", user.keepLog, article.addPage)

// 发表文章提交
router.post("/article", user.keepLog, article.add);

// 文章列表分页路由
router.get("/page/:id", article.getList)

// 文章的详情页面路由
router.get("/article/:id", user.keepLog, article.details)


// 发表评论
router.post("/comment", user.keepLog, comment.save)

// 后台管理页面路由
router.get("/admin/:id", user.keepLog, admin.index)

// 用户中心上传头像
router.post("/upload", user.keepLog, upload.single("file"), user.upload)


// 获取用户的评论
router.get("/user/comments", user.keepLog, comment.comlist)

// 删除用户的评论
router.del("/comment/:id", user.keepLog, comment.del)

// 获取用户文章
router.get("/user/articles", user.keepLog, article.artlist)

// 删除用户的文章
router.del("/article/:id", user.keepLog, article.del)

// 管理员获取用户
router.get("/user/users", user.keepLog, user.userlist)

// 管理员删除用户
router.del("/user/:id", user.keepLog, user.del)

// 没有路由的页面显示404页面
router.get("*", async ctx => {
    await ctx.render("404", {
        title: "页面不存在"
    })
})


module.exports = router;
/*
    exports.router = router导出的是对象
    引入时要用解构赋值{router} = require("路径")
*/