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

module.exports = CommentSchema;