const Router = require("koa-router");
const router = new Router;

// 设计首页 ctx是一次请求的上下文对象
router.get("/", async (ctx) => {
    // ctx.body = "index"
    // 因为app.js里面配置了视图模版的路径，这里的路径都是相对于设置好的哪个文件夹
    // 模版引擎的后缀可以不写 根目录也可以不写
    await ctx.render("index.pug", {
        title: "个人博客",
        session: {
            role: 777
        }
    });
})

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



module.exports = router;
/*
    exports.router = router导出的是对象
    引入时要用解构赋值{router} = require("路径")
*/