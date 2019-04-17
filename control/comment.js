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


// 保存评论
exports.save = async ctx => {
    let message = {
        status: 0,
        msg: "请登录后发表评论"
    }
    // 判断用户是否登录状态
    if(ctx.session.isNew) return ctx.body = message;

    // 用户已登录
    const data = ctx.request.body;
    data.from = ctx.session.uid;

    const _comment = new Comment(data)

    await _comment
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: "评论成功"
            }
            // 更新当前文章的评论数
            Article 
                .update({_id: data.article}, {
                    $inc: {commentNum: 1}
                }, err => {
                    if(err) return console.log(err)
                    console.log("评论成功")
                })
            // 更新用户评论数
            User.update({_id: data.from}, {$inc: {commentNum: 1}}, err => {
                if(err) return console.log(err)
            })
        })
        .catch(err => {
            message = {
                status: 0,
                msg: err 
            }
        })
        ctx.body = message
}