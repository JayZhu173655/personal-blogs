const {db} = require("../Schema/config.js");
const CommentSchema = require("../Schema/comment.js");
// 通过db对象创建操作comment数据库的模型对象
const Comment = db.model("comments", CommentSchema);

module.exports = Comment