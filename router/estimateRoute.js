const express = require("express");

const estimateCont = require("../controler/estimateController");

const router = express();

router.get("/:userid", estimateCont.getallestimate);

router.post(
  "/createorupateestimate/:userid",
  estimateCont.createorupdateestimate
);
router.post("/saveestimationid/:userid/", estimateCont.incremeantestimateid);
router.get("/getestimationid/:userid", estimateCont.getestimateid);
router.post("/deleteestimate/:userid", estimateCont.deleteEstimate);
module.exports = router;
