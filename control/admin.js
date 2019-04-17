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


const fs = require("fs");
const {join} = require("path");
exports.index = async ctx => {
    if(ctx.session.isNew){
        ctx.status = 404
        return await ctx.render("404", {title: "页面不存在"})
    }

    const id = ctx.params.id;
    const arr = fs.readdirSync(join(__dirname, "../views/admin"));
    let flag = false;
    arr.forEach( v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "");
        if(name === id){
            flag = true;
        }
    })
    if(flag){
        await ctx.render("./admin/admin-" + id, {
            role: ctx.session.role
        })
    } else{
        ctx.status = 404;
        await ctx.render("404", {title: "页面不存在"})
    }
}