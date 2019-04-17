const {Schema} = require("./config.js");

const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: String,
    tips: String
},{
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
});

module.exports = ArticleSchema;