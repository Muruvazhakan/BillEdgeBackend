const express = require("express");

const invoicecont = require("../controler/invoicegenController");

const router = express();

router.post(
  "/createorupdateinvoice/:userid",
  invoicecont.createorupdateinvoice
);
router.post(
  "/createorupdateestimateinvoice/:userid",
  invoicecont.createorupdateestimateinvoice
);
router.post("/getestimateinvoice/:userid", invoicecont.getallestimateinvoice);
router.post("/getinvoiceid/:userid", invoicecont.getInvoiceid);
router.post("/:userid", invoicecont.getallinvoice);
router.post("/saveinvoiceid/:userid", invoicecont.incremeantinvoiceid);
router.post("/deleteinvoice/:userid", invoicecont.deleteInvoice);
router.post(
  "/deleteinvoiceestimate/:userid",
  invoicecont.deleteInvoiceEstimate
);
module.exports = router;
