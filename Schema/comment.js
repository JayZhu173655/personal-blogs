const {Schema} = require("./config.js");

// 获取id
const ObjectId = Schema.Types.ObjectId;

// 需要评论者的头像，用户名，评论的文章，评论的内容，评论的时间
const CommentSchema = new Schema({
    content: String,
    from: {
        type: ObjectId,
        ref: "users"
    },
    article: {
        type: ObjectId,
        ref: "articles"
    }
},
{
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
});

// 设置comment的remove钩子 
/*
    CommentSchema.pre()前置钩子
    CommentSchema.post()后置钩子
    都在事件之前之行的
    pre()钩子可以绑定多个，需要next传递
    post()钩子只有一个，就是在所有钩子最后
*/
CommentSchema.post("remove", (doc) => {
    const Article = require("../Models/article.js")
    const User = require("../Models/user.js")
    const {from, article} = doc

    //评论对应的文章的评论数减1
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec()
    // 该评论的用户的评论数减1
    User.updateOne({_id: from}, {$inc: {commentNum: -1}}).exec()
})
module.exports = CommentSchema;