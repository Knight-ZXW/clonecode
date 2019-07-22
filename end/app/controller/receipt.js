'use strict';

const Controller = require('egg').Controller;

class ReceiptController extends Controller {

    async list() {
        const ctx = this.ctx
        const query = {
            limit: 10,
            offset: 0,
        };
        const list = await ctx.service.receipt.list(query)
        for (let i = 0; i < list.rows.length; i++) {
            for (let j = 0; j < this.app.users.length; j++) {
                if (this.app.users[j] && list.rows[i].token == this.app.users[j].token) {
                    list.rows[i].isRun = this.app.users[j].isRun
                    list.rows[i].total = this.app.users[j].total
                }
            }
        }
        list.lockBig = this.app.cache.lockBig
        ctx.status = 200
        ctx.body = list

    }

    async show() {
        const ctx = this.ctx;
        const rule = {
            id: 'id'
        }
        ctx.validate(rule, ctx.params)
        ctx.status = 200
        ctx.body = await ctx.service.receipt.find(ctx.helper.parseInt(ctx.params.id));
    }

    async create() {
        const ctx = this.ctx;
        const receipt = await ctx.service.receipt.findByName(ctx.request.body.name)
        if (receipt) {
            ctx.status = 422;
            ctx.body = {code: 0, msg: "该用户已存在"};
        } else {
            ctx.request.body.isRun = 0
            ctx.request.body.isLocked = 1
            const n_receipt = await ctx.service.receipt.create(ctx.request.body);
            if (n_receipt) {
                ctx.status = 201;
                ctx.body = {code: 1, msg: "新增成功"};
            } else {
                ctx.status = 500;
                ctx.body = {code: 0, msg: "新增失败"};
            }
        }
    }

    async update() {
        const ctx = this.ctx;
        const id = ctx.helper.parseInt(ctx.params.id);
        const body = ctx.request.body;
        const receipt = await this.ctx.model.Receipt.findOne({where:{id:id}});
        if(receipt){
            for(let i=0;i<this.app.users.length;i++){
                if(this.app.users[i].token==receipt.token){
                    this.app.users.splice(i,1)
                    break
                }
            }
            await this.ctx.app.redis.zrem(this.ctx.app.config.tokens,receipt.token.toString())
        }
        let res = await ctx.service.receipt.update({id, updates: body});
        if (res) {

            ctx.status = 200
            ctx.body = {code: 1, msg: "修改成功"};
        } else {
            ctx.status = 404
            ctx.body = {code: 0, msg: "修改失败"};
        }
    }

    async destroy() {
        const ctx = this.ctx;
        const id = ctx.helper.parseInt(ctx.params.id);
        const rule = {
            id: 'id',
        }
        ctx.validate(rule, ctx.params)
        let res = await ctx.service.receipt.del(id);
        if (res == true) {
            ctx.status = 200
            ctx.body = {code: 1, msg: "删除成功"};
        } else {
            ctx.status = 404
            ctx.body = {code: 0, msg: "删除失败"};
        }

    }

    async batch() {
        const ctx = this.ctx;
        const ids = ctx.request.body.ids
        const rule = {
            ids: 'array'
        }
        ctx.validate(rule, ctx.request.body)
        let res = await ctx.service.receipt.batch(ids);
        if (res == true) {
            ctx.status = 200
            ctx.body = {code: 1, msg: "删除成功"};
        } else {
            ctx.status = 404
            ctx.body = {code: 0, msg: "删除失败"};
        }
    }

    async checkUser() {
        const ctx = this.ctx;
        ctx.status = 200
        ctx.body = {code: 1}
    }

    async start() {

        const ctx = this.ctx;
        const id = ctx.helper.parseInt(ctx.params.id);
        const rule = {
            token: 'string',
        }
        ctx.validate(rule, ctx.request.body)
        let options = {
            // url:"https://nihlm.jlhuafa.com/api/api/exchg/merc/User",
            url: "https://"+this.app.config.receipt.ip+"/api/exchg/user/queryLoginUser",
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': 'geEj2jAsH7HMxt14uYDLv0PWR9BuolNq',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
                'Origin': 'https://nihlm.jlhuafa.com',
                'Referer': 'https://nihlm.jlhuafa.com/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Cookie': '__guid=14201384.1024209859778874600.1560491678050.2251; monitor_count=6'
            },
            forever: true,
            rejectUnauthorized: false,
        }
        options.headers['x-token'] = ctx.request.body.token
        try {
            const res = JSON.parse(await ctx.helper.request(options))
            if (res.code != 200) {
                ctx.status = 200
                ctx.body = {code: 0, msg: "用户令牌已过期"}
            } else {

                var flag=true
                for(let i=0;i<this.app.users.length;i++){
                    if(this.app.users[i].token==ctx.request.body.token){
                        this.app.users[i].isRun = 1
                        this.app.users[i].total = 0
                        flag=false
                        break
                    }
                }

                if(flag==true){
                    const receipt = await this.ctx.model.Receipt.findOne({where:{token:ctx.request.body.token}});
                    this.app.users.push({
                        name:receipt.name,
                        yzm: "yzm",
                        total: 0,
                        isRun: 1,
                        isSuccess:false,
                        token: ctx.request.body.token,
                    })
                }

                //await ctx.app.redis.zadd(this.ctx.app.config.tokens,new Date().getTime(),ctx.request.body.token.toString())

                let res = await ctx.service.receipt.update({id, updates: {isRun: 1}});
                if (res) {
                    ctx.status = 200
                    ctx.body = {code: 1, msg: "启动成功"};
                } else {
                    ctx.status = 404
                    ctx.body = {code: 0, msg: "启动失败"};
                }
            }
        } catch (err) {
            ctx.logger.error(err)
            ctx.status = 200
            ctx.body = {code: 0, msg: "未知异常，请联系开发"}
        }
    }

    async stop() {

        const ctx = this.ctx;
        const id = ctx.helper.parseInt(ctx.params.id);
        const rule = {
            token: 'string',
        }
        ctx.validate(rule, ctx.request.body)
        const users = this.app.users
        for (var i = 0; i < users.length; i++) {
            if (users[i].token == ctx.request.body.token) {
                this.app.users[i].isRun = 0
                break;
            }
        }

        let res = await ctx.service.receipt.update({id, updates: {isRun: 0}});
        if (res) {
            await ctx.app.redis.zrem(this.ctx.app.config.tokens,ctx.request.body.token.toString())
            ctx.status = 200
            ctx.body = {code: 1, msg: "停止成功"};
        } else {
            ctx.status = 404
            ctx.body = {code: 0, msg: "停止失败"};
        }
    }


    async relay(){
        const ctx=this.ctx
        let options = {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'geEj2jAsH7HMxt14uYDLv0PWR9BuolNq',
                'Connection': 'keep-alive',
            },
            forever: true,
            rejectUnauthorized: false,
        }
        options.headers['x-token'] =ctx.request.headers["x-token"]
        options.url = "https://"+this.app.config.receipt.ip+"/api/exchg/order/queryPendingOrders?page=1&count=1"
        const res=await ctx.helper.request(options)
        ctx.status=200
        ctx.body=res
    }

    async reset() {

        const ctx = this.ctx
        const receipts = await ctx.model.Receipt.findAndCountAll({});
        for (let i = 0; i < receipts.rows.length; i++) {
            if (receipts.rows[i].isRun == 1) {
                receipts.rows[i].update({isRun: 0})
            }
        }
        for(let i=0;i<this.app.users.length;i++){
            this.app.users[i].isRun = 0
            this.app.users[i].total = 0
        }
        await ctx.app.redis.zremrangebyrank(this.ctx.app.config.tokens, 0, 10)
        ctx.status = 200
        ctx.body = "重置成功"
    }

    async detail(){
        const ctx=this.ctx
        ctx.status=200
        let list=new Array()
        list=ctx.app.lists
        ctx.body=list.slice((list.length-10)>=0?list.length-10:0,list.length)
    }

    async isLockBig(){
        const ctx=this.ctx
        this.app.cache.lockBig=ctx.request.body.lockBig
        ctx.status = 200
        ctx.body = "修改成功"
    }
}

module.exports = ReceiptController;
