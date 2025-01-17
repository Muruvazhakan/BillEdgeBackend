const express = require("express");

const stockcont = require('../controler/StockController');

const router=express();

router.get('/getallstocks/:userid',stockcont.getAllStockdata);
router.get('/getallhistorystocks/:userid',stockcont.getAllHistoryStockdata);
router.get('/getallclient/:userid',stockcont.getAllClientdata);
router.post('/savestock/:userid',stockcont.addOrUpdateStockdata);
router.post('/getstockid/:userid',stockcont.getstockid);
router.post('/savesalesstock/:userid',stockcont.addOrUpdateSaleStockdata);
router.post('/getsalesstockid/:userid',stockcont.getsalesstockid);
router.get('/getallhistorysalesstocks/:userid',stockcont.getAllHistorySalesStockdata);
router.post('/deletestock/:userid',stockcont.deleteStock);
module.exports=router;