const {db} = require("../Schema/config.js");
const ArticleSchema = require("../Schema/article.js");
// 通过db对象创建操作article数据库的模型对象
const Article = db.model("articles", ArticleSchema);

module.exports = Article