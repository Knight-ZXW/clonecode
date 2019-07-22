'use strict';
module.exports=app=>{
    const { router, controller } = app;

    router.get('/api/receipts', controller.receipt.list);

    router.post('/api/receipts', controller.receipt.create);

    router.get('/api/receipts/checkUser', controller.receipt.checkUser);

    router.delete('/api/receipts/:id', controller.receipt.destroy);

    router.patch('/api/receipts/:id', controller.receipt.update);

    router.get('/api/exchg/order/queryPendingOrders', controller.receipt.relay);

    router.post("/api/receipts/batch",controller.receipt.batch)

    router.patch("/api/receipts/start/:id",controller.receipt.start)

    router.patch("/api/receipts/stop/:id",controller.receipt.stop)

    router.get("/api/reset",controller.receipt.reset)

    router.get("/api/detail",controller.receipt.detail)

    router.patch("/api/isLockBig",controller.receipt.isLockBig)

}
