const crypto = require("crypto");

// 导出加密函数 函数接收要加密的数据，返回加密后的数据
module.exports = function(password, key = "as456ff@$@$%$5df21vds5f61v"){
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(password);
    const passwordHmac = hmac.digest("hex");
    return passwordHmac;
}