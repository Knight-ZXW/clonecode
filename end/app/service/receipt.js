'use strict';

const Service = require('egg').Service;

class ReceiptService extends Service {
    async list(params) {
        let query={}
        let where={}
        query.order=[[ 'created_at', 'desc' ]]
        if(isNaN(params.offset)==false){
            query.offset=params.offset
            query.limit=params.limit
        }

        query.where=where
        return await this.ctx.model.Receipt.findAndCountAll(query);
    }

    async find(id) {
        const receipt = await this.ctx.model.Receipt.findById(id);
        return receipt;
    }

    async create(receipt) {
        return await this.ctx.model.Receipt.create(receipt);
    }

    async update({ id, updates }) {
        const receipt = await this.ctx.model.Receipt.findOne({where:{id:id}});
        if(receipt.isRun==1){
            updates.isRun=0
        }
        if(receipt){
            await receipt.update(updates);
            return true
        }else{
            return false
        }
    }

    async del(id) {
        const receipt = await this.ctx.model.Receipt.findOne({where:{id:id}});
        if(receipt){
            await receipt.destroy();
            return true
        }else{
            return false
        }
    }
    async findByName(name){
        const receipt = await this.ctx.model.Receipt.findOne({where:{name:name}});
        return receipt;
    }
    async batch(ids){
        const Op = this.app.Sequelize.Op;
        const res = await this.ctx.model.Receipt.destroy({where:{id:{[Op.in]:ids}}});
        if(res){
            return true
        }else{
            return false
        }
    }


}

module.exports = ReceiptService;
