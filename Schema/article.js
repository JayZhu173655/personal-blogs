const {Schema} = require("./config.js");

// 获取id
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: "users"
     }, // 关联user文档（联表查询）
    tips: String,
    commentNum: Number
},
{
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
});


ArticleSchema.post("remove", doc => {
    const Comment = require("../Models/comment.js")
    const User = require("../Models/user.js")

    const {_id: artId, author: authorId} = doc
    // 文章作者的文章数减1
    User.findByIdAndUpdate(authorId, {$inc: {articleNum: -1}}).exec()

    // 把文章下面所有评论一次删除
    Comment.find({article: artId})
        .then(data => {
            data.forEach(v => v.remove())
        })

        //console.log("文章通过钩子删除了")
})
module.exports = ArticleSchema;