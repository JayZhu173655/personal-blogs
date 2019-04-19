const {db} = require("../Schema/config.js");
const ArticleSchema = require("../Schema/article.js");
// 这里导入user的Schema,为了拿到用户的数据的操作 users 集合的实例对象
const UserSchema = require("../Schema/user.js");
const CommentSchema = require("../Schema/comment.js");


// 通过db对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema);

// 通过db对象创建操作user数据库的模型对象
const User = db.model("users", UserSchema);

// 通过db对象创建操作comment数据库的模型对象
const Comment = db.model("comments", CommentSchema);

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
    data.commentNum = 0;

        await new Promise((resolve,reject) => {
            new Article(data).save((err, data) => {
                if(err) return reject(err);
                // 发表文章后更新用户文章数
                User.update({_id: data.author}, {$inc: {articleNum: 1}}, err => {
                    if(err) return console.log(err)
                    console.log("文章发表成功")
                })
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
};

// 文章详情
exports.details = async ctx => {
    // 取动态路由的id
    const _id = ctx.params.id;

    const article = await Article
        .findById(_id)
        .populate("author", "username")
        .then(data => data)

    // 查找文章的相关评论
    const comment = await Comment
        .find({ article: _id })
        .sort("-created")
        .populate("from", "username avatar")
        .then(data => data)
        .catch(err => {
            console.log(err)
        })
    
    await ctx.render("article", {
        title: article.title,
        article,
        comment,
        session: ctx.session
    })
}

// 获取用户文章列表
exports.artlist = async ctx => {
    const uid = ctx.session.uid
    const data = await Article.find({author: uid})
    console.log(data)
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}
// 用户删除文章
/*
// 下面代码逻辑问题，暂时没实现
exports.del = async ctx => {
    const _id = ctx.params.id
    const uid = ctx.session.uid

    // 用户的文章数减1
    // 删除文章内的所有评论
    // 文章内评论对应的用户的评论数减1
    // 删除文章
    let res = {}

    await Article.deleteOne({_id}).exec(async err =>{
        if(err){
            res = {
                state: 0,
                message: "文章删除失败"
            }
        } else{
            await Article.findById(_id,(err, data) => {
                if(err) return console.log(err)
                uid = data.author
            })
        }
    })

    await User.update({_id: uid}, {$inc: {articleNum: -1}})
    await Comment.find({article: _id}).then(async data => {
        let len = data.length
        let i = 0

        async function deleteUser(){
            if(i >= len) return
            const cId = data[i]._id
            await Comment.deleteOne({_id: cId}).then(data => {
                User.update({_id: data[i].from}, {$inc: {commentNum: -1}}, err => {
                    if(err) return console.log(err)
                    i++
                })
            })
        }
        await deleteUser()
        res = {
            state: 1,
            message: "文章删除成功"
        }
    })
    
    ctx.body = res
}
*/