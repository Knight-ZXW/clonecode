// app.js
class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    configWillLoad() {
        // 此时 config 文件已经被读取并合并，但是还并未生效
        // 这是应用层修改配置的最后时机
        // 注意：此函数只支持同步调用

    }

    async didLoad() {
        // 所有的配置已经加载完毕
        // 可以用来加载应用自定义的文件，启动自定义的服务

        // 例如：创建自定义应用的示例
    }

    async willReady() {
        // 所有的插件都已启动完毕，但是应用整体还未 ready
        // 可以做一些数据初始化等操作，这些操作成功才会启动应用

        // 例如：从数据库加载数据到内存缓存
    }

    async didReady() {
        // 应用已经启动完毕
    }

    async serverDidReady() {
        const fs=require('fs');
        // http / https server 已启动，开始接受外部请求
        // 此时可以从 app.server 拿到 server 的实例
        this.app.cache = {
            goid: "",
            lockBig:true,
        };
        this.app.names=fs.readFileSync("names.txt","utf-8")
        this.app.users = []
        this.app.lists=[]
        const request0 = require("request")
        const ctx = await this.app.createAnonymousContext();
        const receipts = await ctx.model.Receipt.findAndCountAll({});
        for (let i = 0; i < receipts.rows.length; i++) {
            if (receipts.rows[i].isRun == 1) {
                receipts.rows[i].update({isRun: 0})
            }
        }

        const users = this.app.users
        let i = 0
        setInterval(async function () {
            if (users.length > 0) {
                let index = i % users.length
                if (users[index].yzm != "" && (users[index].isRun == 1||users[index].isRun == -1||users[index].isRun == -3) ) {
                    const ips = await ctx.app.redis.zrange('ips', 0, -1, 'WITHSCORES')
                    let date = new Date().getTime()
                    if (date - parseInt(ips[1]) >= 180) {
                        users[index].yzm = ""
                        await ctx.app.redis.zadd('ips', date, ips[0])
                       // const tokens = await ctx.app.redis.zrange(ctx.app.config.tokens, 0, -1, 'WITHSCORES')
                        ctx.helper.refresh(index, request0, ips[0], users[index].token,i)
                    }
                }
                i++
                if(i>100000){
                    i=0
                }
            }
        }, 2)

    }

    async beforeClose() {

        // Do some thing before app close.
    }

}

module.exports = AppBootHook;
