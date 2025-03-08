const {
  EstimateDetails,
  EstimateDeatailCounter,
} = require("../Module/EstimateDetailModel");
const HttpError = require("../Module/httpError");

const getestimateid = async (req, res, next) => {
  let inputeuserid = req.params.userid;
  try {
    estimateidvalue = await EstimateDeatailCounter.find({
      userid: inputeuserid,
    });
    //console.log('estimateidvalue');
    //console.log(estimateidvalue);
    if (estimateidvalue.length !== 0) {
      return res.status(200).json(estimateidvalue[0].estimatedeatilcount);
    } else {
      return res.status(204).json("No count is registered");
    }
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }
};

const incremeantestimateid = async (req, res, next) => {
  let inputeuserid = req.params.userid;
  let estimateids = req.body.estimationcount;
  //console.log('estimateids');
  //console.log(estimateids);
  let estimateidvalue, finalsave;
  try {
    estimateidvalue = await EstimateDeatailCounter.find({
      userid: inputeuserid,
    });
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }
  //console.log('estimateidvalue');
  //console.log(estimateidvalue);
  if (estimateidvalue.length > 0) {
    finalsave = estimateidvalue[0];
    //console.log('inside');
    finalsave.estimatedeatilcount = estimateids;
    //console.log(finalsave);
    try {
      await finalsave.save({ upsert: true });
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error " + er);
    }
  } else {
    //console.log('else');
    finalsave = new EstimateDeatailCounter({
      userid: inputeuserid,
      estimatedeatilcount: estimateids,
    });
    try {
      await finalsave.save({ upsert: true });
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in new saving" + er);
    }
  }

  return res.status(200).json(finalsave);
};
const getallestimate = async (req, res, next) => {
  let inputeuserid = req.params.userid;
  //console.log(inputeuserid);
  //console.log(req.params.toString());
  // let filteruserdata = estimate.filter((item) => {
  //     return item.userid === userid;
  // })
  let filteruserEstimation;
  try {
    filteruserEstimation = await EstimateDetails.find({ userid: inputeuserid });
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }
  //console.log(filteruserEstimation);
  if (filteruserEstimation.length === 0) {
    return res.status(401).json("No estimation for this user");
  } else {
    return res.status(200).json(filteruserEstimation);
  }
};

const createorupdateestimate = async (req, res, next) => {
  let allestimate = req.body.estimate;
  // console.log('allestimate');
  // console.log(allestimate);
  let userid = req.params.userid;
  let singleestimate = null;
  // for (let i = 0; i < allestimate.length; i++) {
  singleestimate = allestimate;
  let estimate = null,
    isexistestimate,
    updatesexistestimate;
  //console.log(singleestimate);
  try {
    updatesexistestimate = await EstimateDetails.find({
      userid: userid,
      estimateid: singleestimate.estimateid,
    });
  } catch (er) {
    throw new HttpError("error in exist search", 400);
  }
  // console.log('updatesexistestimate');
  // console.log(updatesexistestimate);
  // //console.log(updatesexistestimate.length);
  if (updatesexistestimate.length === 0) {
    estimate = new EstimateDetails({
      clientAdd: singleestimate.clientAdd,
      clientName: singleestimate.clientName,
      clientPhno: singleestimate.clientPhno,
      estimatedate: singleestimate.estimatedate,
      estimatedate1: singleestimate.estimatedate1,
      estimateid: singleestimate.estimateid,
      grandtotalpvccost: singleestimate.grandtotalpvccost,
      grandtotalupvccost: singleestimate.grandtotalupvccost,
      grandtotalwoodcost: singleestimate.grandtotalwoodcost,
      granttotalsqft: singleestimate.granttotalsqft,
      userid: userid,
      rows: singleestimate.rows,
      columns: singleestimate.columns,
      discountedcheck: singleestimate.discountedcheck,
      discountedText: singleestimate.discountedText,
      discountedTotalupvccost: singleestimate.discountedTotalupvccost,
      discountedTotalpvccost: singleestimate.discountedTotalpvccost,
      discountedTotalwoodcost: singleestimate.discountedTotalwoodcost,
    });
    // console.log('estimate');
    // console.log(estimate);
    try {
      await estimate.save({ upsert: true });
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in new saving" + er);
    }
  } else {
    isexistestimate = updatesexistestimate[0];
    isexistestimate.clientAdd = singleestimate.clientAdd;
    isexistestimate.clientName = singleestimate.clientName;
    isexistestimate.clientPhno = singleestimate.clientPhno;
    isexistestimate.estimatedate = singleestimate.estimatedate;
    isexistestimate.estimatedate1 = singleestimate.estimatedate1;

    isexistestimate.grandtotalpvccost = singleestimate.grandtotalpvccost;
    isexistestimate.grandtotalupvccost = singleestimate.grandtotalupvccost;
    isexistestimate.grandtotalwoodcost = singleestimate.grandtotalwoodcost;
    isexistestimate.granttotalsqft = singleestimate.granttotalsqft;

    isexistestimate.rows = singleestimate.rows;
    isexistestimate.columns = singleestimate.columns;

    isexistestimate.discountedText = singleestimate.discountedText;
    isexistestimate.discountedcheck = singleestimate.discountedcheck;
    isexistestimate.discountedTotalupvccost =
      singleestimate.discountedTotalupvccost;
    isexistestimate.discountedTotalpvccost =
      singleestimate.discountedTotalpvccost;
    isexistestimate.discountedTotalwoodcost =
      singleestimate.discountedTotalwoodcost;

    try {
      console.log("before isexistestimate");
      console.log(isexistestimate);
      await isexistestimate.save();
      //  await EstimateDetails.findByIdAndUpdate();
      //console.log(' after isexistestimate');
      //console.log(isexistestimate);
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in updating" + er);
    }
  }
  // }
  return res.status(200).json("estimation saved");
};

const deleteEstimate = async (req, res, next) => {
  console.log("req.params deleteEstimate");
  console.log(req.params);
  console.log(req.body);
  let singleestimate = req.body.estimate;
  console.log(req.body);
  let userid = req.params.userid;

  try {
    // If 'id' is a string or number, no need to cast it to ObjectId
    const deleteestimate = await EstimateDetails.findOneAndDelete({
      userid: userid,
      estimateid: singleestimate.estimateid,
    });
    console.log("deleteestimate");
    console.log(deleteestimate);
    if (!deleteestimate) {
      return res.status(404).json({ message: "Estimation not found" });
    }
    return res.status(200).json({
      message: "Estimation deleted successfully",
      deleteestimate,
    });
  } catch (error) {
    console.error(error); // For debugging purposes
    return res.status(400).json({ message: error.message });
  }
};

exports.getestimateid = getestimateid;
exports.getallestimate = getallestimate;
exports.createorupdateestimate = createorupdateestimate;
exports.incremeantestimateid = incremeantestimateid;
exports.deleteEstimate = deleteEstimate;
