const {db} = require("../Schema/config.js");
// 这里导入user的Schema,为了拿到用户的数据的操作 users 集合的实例对象
const UserSchema = require("../Schema/user.js");
// 通过db对象创建操作user数据库的模型对象
const User = db.model("users", UserSchema);

module.exports = User