'use strict';
var moment = require('moment');
module.exports=app=>{
    const { INTEGER, DATE, STRING } = app.Sequelize;
    const Receipt = app.model.define('receipts', {
        id: { type: INTEGER(11), primaryKey: true, autoIncrement: true},//id
        name:{type:STRING(30)},
        token:{type:STRING(200)},
        isLocked:{type:INTEGER(3)},
        isRun:{type:INTEGER(3)},
        total:{type:INTEGER(15)},
        fail:{type:INTEGER(15)},
        created_at: {
            type:DATE,
            get() {
                return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updated_at: {
            type:DATE,
            get() {
                return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
    });
    return Receipt;
}
