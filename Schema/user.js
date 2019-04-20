const {Schema} = require("./config.js");

const UserSchema = new Schema({
    username: String,
    password: String,
    role: {
        type: String,
        default: 1
    },
    avatar: {
        type: String,
        default: "/avatar/default.jpg"
    },
    articleNum: Number,
    commentNum: Number
},{versionKey: false,
    timestamps: {
        createdAt: "created"
    }
});


UserSchema.post("remove", doc => {
    const Article = require("../Models/article.js")
    const Comment = require("../Models/comment.js")

    const {_id} = doc
    

   
    // 把用户所有文章删除
    Article.find({author: _id})
        .then(data => {
            data.forEach(v => v.remove())
        })

    // 删除用户所有评论
    Comment.find({from: _id})
        .then(data => {
            data.forEach(v => v.remove())
        })
        
        //console.log(doc)
        //console.log(Article.find({author: authorId}))
   
})
module.exports = UserSchema;