const {db} = require("../Schema/config.js");
const ArticleSchema = require("../Schema/article.js");


// 通过db对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema);

// 文章发表
exports.addPage = async (ctx) => {
    await ctx.render("add-article", {
        title: "发表文章",
        session: ctx.session
    })
};

// 文章发表 存储到数据库
exports.add = async ctx => {
    if(ctx.session.isNew){
        // 如果ctx.session.isNew为true则没登录，不用存数据库
        return ctx.body = {
            msg: "用户未登录",
            status: 0
        }
    }

    // 用户登录了
    // 这是用户登录后，post请求发过来的数据
    const data = ctx.request.body;

    // 向data内添加文章的作者
    data.author = ctx.session.username;

        await new Promise((resolve,reject) => {
            new Article(data).save((err, data) => {
                if(err) return reject(err);
                resolve(data);
            })
        })
        .then(data => {
            ctx.body = {
                msg: "发表成功",
                status: 1
            }
        })
        .catch(err => {
            ctx.body = {
                msg: "发表失败",
                status: 0
            }
        })
}

