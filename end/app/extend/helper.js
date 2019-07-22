'use strict';
const decode = require("./decode")
var moment = require('moment');
module.exports = {

    parseInt(string) {
        if (typeof string === 'number') return string;
        if (!string) return string;
        return parseInt(string) || 0;
    },
    isEmpty(val) {
        if ((val == null || typeof(val) == "undefined") || (typeof(val) == "string" && (val == "" || val == "{}") && val != "undefined") || (typeof(val) == 'object' && val.length == 0) || val == "null") {
            return true;
        } else {
            return false;
        }
    },
    request(options) {
        var rp = require('request-promise');
        return new Promise((resolve, reject) => {
            rp(options).then((res) => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    refresh(index, request, url, lockToken, i1) {

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
        const token = this.app.users[index].token
        options.headers['x-token'] = token
        options.url = "https://" + url + "/api/exchg/order/queryPendingOrders?page=1&count=1"
        const nthis = this
        // nthis.ctx.logger.error("index1:"+i1)
        request(options, async function (error, response, body) {
            if (body.indexOf("code") != -1) {
                let json = JSON.parse(body)
                if (json.captcha) {

                    const yzm = decode.decode(json.captcha)
                    setTimeout(function () {
                        //nthis.ctx.logger.error("index2:"+i1)
                        nthis.app.users[index].yzm = "yzm"
                    }, 15)

                    const ips = await nthis.ctx.app.redis.zrange('ips', 0, -1, 'WITHSCORES')
                    let date = new Date().getTime()
                    if (date - parseInt(ips[1]) >= 180) {
                        await nthis.ctx.app.redis.zadd('ips', date, ips[0])
                        options.url = "https://" + ips[0] + "/api/exchg/order/queryPendingOrders?page=1&count=1&captcha=" + yzm
                        //nthis.ctx.logger.error("index3:"+i1)
                        request(options, function (error, response, body) {
                            //nthis.ctx.logger.error(ips[0])
                            if (body.indexOf("oid") != -1) {
                                let json = JSON.parse(body)
                                let oid = json["msg"]["data"][0]["oid"]
                                let name = json["msg"]["data"][0]["receiptName"]

                                if (nthis.app.cache.lockBig == true && nthis.app.users[index].name == "liuliu") {
                                    if (nthis.app.names.indexOf(name) != -1) {
                                        if (nthis.app.cache.goid != oid) {
                                            nthis.app.cache.goid = oid
                                            let options1 = {
                                                url: "https://" + nthis.app.config.receipt.ip + "/api/exchg/order/lockOrder",
                                                method: 'post',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'Authorization': 'geEj2jAsH7HMxt14uYDLv0PWR9BuolNq',
                                                    'Connection': 'keep-alive',
                                                    'x-token': lockToken
                                                },
                                                forever: true,
                                                rejectUnauthorized: false,
                                                body: "{\"oid\":\"" + oid + "\",\"status\":\"pending\"}"
                                            }
                                            request(options1, function (error, response, body) {

                                                nthis.ctx.logger.error(body)
                                                if (body.indexOf("成功") != -1) {
                                                    //nthis.app.redis.zadd(nthis.ctx.app.config.tokens, new Date().getTime(), lockToken.toString())

                                                    nthis.app.lists.push({
                                                        date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                                        name: nthis.app.users[index].name,
                                                        isRun: -1
                                                    })
                                                    nthis.app.users[index].isRun = -1

                                                } else if (body.indexOf("已存在锁单") != -1) {
                                                    nthis.app.lists.push({
                                                        date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                                        name: nthis.app.users[index].name,
                                                        isRun: -3
                                                    })
                                                    nthis.app.users[index].isRun = -3

                                                } else {
                                                    nthis.app.lists.push({
                                                        date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                                        name: nthis.app.users[index].name,
                                                        isRun: 1
                                                    })
                                                    nthis.app.users[index].isRun = 1

                                                }
                                            })
                                        }
                                    }
                                } else {
                                    if (nthis.app.cache.goid != oid) {
                                        nthis.app.cache.goid = oid
                                        let options1 = {
                                            url: "https://" + nthis.app.config.receipt.ip + "/api/exchg/order/lockOrder",
                                            method: 'post',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Accept': 'application/json',
                                                'Authorization': 'geEj2jAsH7HMxt14uYDLv0PWR9BuolNq',
                                                'Connection': 'keep-alive',
                                                'x-token': lockToken
                                            },
                                            forever: true,
                                            rejectUnauthorized: false,
                                            body: "{\"oid\":\"" + oid + "\",\"status\":\"pending\"}"
                                        }
                                        request(options1, function (error, response, body) {

                                            nthis.ctx.logger.error(body)
                                            if (body.indexOf("成功") != -1) {
                                                //nthis.app.redis.zadd(nthis.ctx.app.config.tokens, new Date().getTime(), lockToken.toString())

                                                nthis.app.lists.push({
                                                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                                    name: nthis.app.users[index].name,
                                                    isRun: -1
                                                })
                                                nthis.app.users[index].isRun = -1

                                            } else if (body.indexOf("已存在锁单") != -1) {
                                                nthis.app.lists.push({
                                                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                                    name: nthis.app.users[index].name,
                                                    isRun: -3
                                                })
                                                nthis.app.users[index].isRun = -3

                                            } else {
                                                nthis.app.lists.push({
                                                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                                    name: nthis.app.users[index].name,
                                                    isRun: 1
                                                })
                                                nthis.app.users[index].isRun = 1

                                            }
                                        })
                                    }
                                }
                            } else if (body.indexOf("503") != -1) {
                                nthis.ctx.logger.error("503")
                            } else if (body.indexOf("captcha") != -1) {
                                nthis.ctx.logger.error(body.substr(0, 20))
                            } else {
                                nthis.app.users[index].total = nthis.app.users[index].total + 1
                            }
                        })
                    }
                } else if (json.msg) {

                    nthis.app.users[index].yzm = "yzm"
                    let data = json["msg"]["data"]
                    if (data.length > 0) {
                        let oid = data[0]["oid"]
                        let options1 = {
                            url: "https://" + nthis.app.config.receipt.ip + "/api/exchg/order/lockOrder",
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': 'geEj2jAsH7HMxt14uYDLv0PWR9BuolNq',
                                'Connection': 'keep-alive',
                                'x-token': lockToken
                            },
                            forever: true,
                            rejectUnauthorized: false,
                            body: "{\"oid\":\"" + oid + "\",\"status\":\"pending\"}"
                        }
                        request(options1, function (error, response, body) {

                            nthis.ctx.logger.error(body)
                            if (body.indexOf("成功") != -1) {
                                //nthis.app.redis.zadd(nthis.ctx.app.config.tokens, new Date().getTime(), lockToken.toString())

                                nthis.app.lists.push({
                                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                    name: nthis.app.users[index].name,
                                    isRun: -1
                                })
                                nthis.app.users[index].isRun = -1

                            } else if (body.indexOf("已存在锁单") != -1) {
                                nthis.app.lists.push({
                                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                    name: nthis.app.users[index].name,
                                    isRun: -3
                                })
                                nthis.app.users[index].isRun = -3

                            } else {
                                nthis.app.lists.push({
                                    date: moment().format("YYYY-MM-DD HH:mm:ss"),
                                    name: nthis.app.users[index].name,
                                    isRun: 1
                                })
                                nthis.app.users[index].isRun = 1

                            }
                        })
                    }
                } else {
                    nthis.ctx.logger.error(json.err)
                    nthis.app.users[index].isRun = -2
                }
            } else {
                nthis.app.users[index].yzm = "yzm"
            }
        })


    }

};


