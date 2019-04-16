const {db} = require("../Schema/config.js");
const UserSchema = require("../Schema/user.js");
const encrypt = require("../until/encrypt.js")


// 通过db对象创建操作user数据库的模型对象
const User = db.model("users", UserSchema)
// 用户注册
exports.reg = async (ctx) => {
    //console.log("这事处理用户注册的中间件")
    // 用户注册时post发过来的数据
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    /*console.log(`注册账户:${username}
                注册账户密码:${password}
    `)*/
    // 注册前，前端应先判断用户名等信息是不是符合条件
    // 然后去数据库user先查询前端传过来的用户名是否存在
    // 如果用户名不存在则添加数据库否则返回前端
    // 密码添加数据库要加密
    await new Promise((resolve, reject) => {
        // 去数据库查询
        User.find({username}, (err, data) => {
            if(err) return reject(err);

            // 对查询到的数据判断用户名存不存在
            if(data.length !== 0){
                // 用户名已存在
                return resolve("");
            } 
            // 用户名不存在 注册到数据库
            // 保存到数据库要加密 encrypt是加密函数
            const _user = new User({
                username,
                password: encrypt(password)
            });
            _user.save((err, data) => {
                if(err){
                    reject(err);
                } else{
                    resolve(data);
                }
            });
        })
    })
    .then(async data => {
        if(data){
            // 注册成功
            await ctx.render("isOK", {
                status: "注册成功"
            })
        } else{
            // 用户名存在
            await ctx.render("isOK", {
                status: "用户名已存在"
            })
        }
    })
    .catch(async err => {
        await ctx.render("isOK", {
            status: "注册失败，请重试"
        })
    })
}

// 用户登录
exports.login = async ctx => {
    // 拿到登录的账号密码
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    await new Promise((resolve, reject) => {
        User.find({username},(err, data) => {
            if(err) return(err);
            if(data.length === 0) return reject("用户名不存在");

            // 把用户登陆的密码加密后和数据库密码比较
            if(data[0].password === encrypt(password)){
                return resolve(data);
            }
            resolve("");
        })
    })
    .then(async data => {
        // 密码不对
        if(!data){
            return ctx.render("isOk", {
                status: "密码不正确，登录失败"
            })
        }

        // 密码正确
        await ctx.render("isOk", {
            status: "登录成功"
        })
    })
    .catch(async err => {
        if(err === "用户名不存在"){
            await ctx.render("isOk", {
                status: "用户名不存在，登录失败"
            })
        } else{
            await ctx.render("isOk", {
                status: "登录失败,请重新登陆"
            })
        }
    });
}