const {db} = require("../Schema/config.js");
const ArticleSchema = require("../Schema/article.js");
// 这里导入user的Schema,为了拿到用户的数据的操作 users 集合的实例对象
const UserSchema = require("../Schema/user.js");


// 通过db对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema);

// 通过db对象创建操作user数据库的模型对象
const User = db.model("users", UserSchema);

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
    data.author = ctx.session.uid;

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
};

//获取所有文章
exports.getList = async ctx => {
    // 查询所有文章对应的作者和作者的头像
    // 动态路由id 即ctx.params.id
    let page = ctx.params.id || 1;
    page--;

    const maxNum = await Article.estimatedDocumentCount((err, num) => err? console.log(err) : num);

    // sort()根据created（创建时间排序）带-是降序不带是升序
    // skip()是跳过多少条，只加载需要的
    // limit（）设置每页显示的条数，和跳过多少条对应
    // populate()设置连表查询和查询的内容
    const artList = await Article
        .find()
        .sort("-created")
        .skip(5 * page)
        .limit(5)
        .populate({
            path: "author",
            select: "username _id avatar"
        })
        .then(data => data)
        .catch(err => console.log(err));
    //console.log(data)

    await ctx.render("index", {
        session: ctx.session,
        title: "个人博客",
        artList,
        maxNum
    })
}

