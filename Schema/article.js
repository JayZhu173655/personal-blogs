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

module.exports = ArticleSchema;