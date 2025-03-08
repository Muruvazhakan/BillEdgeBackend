const { AllStockDetailSchema } = require("../Module/StockDetailMode");
const HttpError = require("../Module/httpError");
const {
  InvoiceDetail,
  InvoiceDetailCounter,
  EstimateInvoiceDetail,
} = require("../Module/InvoiceDetailModel");
const { addOrUpdateStock, addOrUpdateClient } = require("./StockController");
const getInvoicedata = async (req, res, next) => {
  // console.log('get invoice');

  res.status(200).json("get invoice");
};

const getInvoiceid = async (req, res, next) => {
  let inputuserid = req.params.userid;
  let headertext = req.body.headertext;
  let invoiceid;
  try {
    invoiceid = await InvoiceDetailCounter.find({ userid: inputuserid });

    if (invoiceid.length !== 0) {
      return res.status(200).json(invoiceid[0].invoicedeatilcount);
    } else {
      return res.status(204).json("No invoice count is registered");
    }
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }

  // console.log('get invoice');
};

const incremeantinvoiceid = async (req, res, next) => {
  let inputeuserid = req.params.userid;
  let invoiceids = req.body.invoicecount;
  let headertext = req.body.headertext;
  console.log("invoiceids");
  console.log(invoiceids);
  let invoiceidvalue, finalsave;
  try {
    invoiceidvalue = await InvoiceDetailCounter.find({ userid: inputeuserid });
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }
  console.log("invoiceidvalue");
  console.log(invoiceidvalue);
  if (invoiceidvalue.length > 0) {
    finalsave = invoiceidvalue[0];
    console.log("inside");
    finalsave.invoicedeatilcount = invoiceids;
    //console.log(finalsave);
    try {
      await finalsave.save({ upsert: true });
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error " + er);
    }
  } else {
    //console.log('else');
    finalsave = new InvoiceDetailCounter({
      userid: inputeuserid,
      invoicedeatilcount: invoiceids,
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

const getallinvoice = async (req, res, next) => {
  let inputeuserid = req.params.userid;
  let headertext = req.body.headertext;
  console.log(inputeuserid);
  console.log(req.params.toString());
  // let filteruserdata = invoice.filter((item) => {
  //     return item.userid === userid;
  // })
  let filteruserinvoice;
  try {
    filteruserinvoice = await InvoiceDetail.find({ userid: inputeuserid });
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }
  console.log(filteruserinvoice);
  if (filteruserinvoice.length === 0) {
    return res.status(401).json("No invoice for this user");
  } else {
    return res.status(200).json(filteruserinvoice);
  }
};

const createorupdateinvoice = async (req, res, next) => {
  let salestocklist = req.body.invoice.list;
  let allinvoice = req.body.invoice;
  let headertext = req.body.invoice.authorization;
  let clientid = req.body.invoice.clientid;
  if (headertext !== "invoicerequest") {
    return res.status(400).json("Authorization restricted");
  }
  // console.log("req.body");
  // console.log(req.body);
  let userid = req.params.userid;
  let singleinvoice = null,
    existstock = false,
    beforeisexistsalestock;
  // console.log("allinvoice ");
  // console.log(singleinvoice);
  singleinvoice = allinvoice;
  let invoice = null,
    isexistinvoice,
    updatesexistinvoice;
  // console.log('singleinvoice');
  // console.log(singleinvoice);
  try {
    updatesexistinvoice = await InvoiceDetail.find({
      userid: userid,
      invoiceid: singleinvoice.invoiceid,
    });
  } catch (er) {
    throw new HttpError("error in exist search", 400);
  }
  // console.log('updatesexistinvoice');
  // console.log(updatesexistinvoice);
  // console.log(updatesexistinvoice.length);

  let responClientUpdate = await addOrUpdateClient(
    req.body.invoice,
    userid,
    clientid,
    "add"
  );
  console.log("responClientUpdate");
  console.log(responClientUpdate);
  if (updatesexistinvoice.length === 0) {
    invoice = new InvoiceDetail({
      columns: singleinvoice.columns,
      userid: userid,
      invoiceid: singleinvoice.invoiceid,
      invoicedate: singleinvoice.invoicedate,
      invoicedate1: singleinvoice.invoicedate1,
      paymentdate: singleinvoice.paymentdate,
      paymentdate1: singleinvoice.paymentdate1,
      paymentmode: singleinvoice.paymentmode,
      list: singleinvoice.list,
      hsnlist: singleinvoice.hsnlist,
      otherchargedetail: singleinvoice.otherchargedetail,
      totalcentaxamt: singleinvoice.totalcentaxamt,
      totalstatetaxamt: singleinvoice.totalstatetaxamt,
      totalsubamt: singleinvoice.totalsubamt,
      totalamt: singleinvoice.totalamt,
      totalamtwords: singleinvoice.totalamtwords,
      totaltaxvalueamt: singleinvoice.totaltaxvalueamt,
      totalhsnamt: singleinvoice.totalhsnamt,
      totalhsnamtwords: singleinvoice.totalhsnamtwords,
      clientAdd: singleinvoice.clientAdd,
      clientName: singleinvoice.clientName,
      clientPhno: singleinvoice.clientPhno,
      clientGST: singleinvoice.clientGST,
      ctrate: singleinvoice.ctrate,
      strate: singleinvoice.strate,
      clientid: singleinvoice.clientid,
    });
    // console.log('invoice');
    // console.log(invoice);

    try {
      await invoice.save({ upsert: true });
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in new saving" + er);
    }
  } else {
    isexistinvoice = updatesexistinvoice[0];
    beforeisexistsalestock = JSON.parse(JSON.stringify(isexistinvoice));
    existstock = true;
    //  console.log('isexistinvoice');
    //  console.log(isexistinvoice);
    isexistinvoice.columns = singleinvoice.columns;
    isexistinvoice.invoicedate = singleinvoice.invoicedate;
    isexistinvoice.invoicedate1 = singleinvoice.invoicedate1;
    isexistinvoice.paymentdate = singleinvoice.paymentdate;
    isexistinvoice.paymentdate1 = singleinvoice.paymentdate1;
    isexistinvoice.paymentmode = singleinvoice.paymentmode;
    isexistinvoice.list = singleinvoice.list;
    isexistinvoice.hsnlist = singleinvoice.hsnlist;
    isexistinvoice.otherchargedetail = singleinvoice.otherchargedetail;
    isexistinvoice.totalcentaxamt = singleinvoice.totalcentaxamt;
    isexistinvoice.totalstatetaxamt = singleinvoice.totalstatetaxamt;
    isexistinvoice.totalsubamt = singleinvoice.totalsubamt;
    isexistinvoice.totalamt = singleinvoice.totalamt;
    isexistinvoice.totalamtwords = singleinvoice.totalamtwords;
    isexistinvoice.totaltaxvalueamt = singleinvoice.totaltaxvalueamt;
    isexistinvoice.totalhsnamt = singleinvoice.totalhsnamt;
    isexistinvoice.totalhsnamtwords = singleinvoice.totalhsnamtwords;
    isexistinvoice.clientAdd = singleinvoice.clientAdd;
    isexistinvoice.clientName = singleinvoice.clientName;
    isexistinvoice.clientPhno = singleinvoice.clientPhno;
    isexistinvoice.clientGST = singleinvoice.clientGST;
    isexistinvoice.ctrate = singleinvoice.ctrate;
    isexistinvoice.strate = singleinvoice.strate;
    isexistinvoice.clientid = singleinvoice.clientid;

    try {
      // console.log('before isexistinvoice');
      // console.log(isexistinvoice);
      await isexistinvoice.save();
      //  await invoiceDetails.findByIdAndUpdate();
      // console.log(' after isexistinvoice');
      // console.log(isexistinvoice);
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in updating" + er);
    }
  }

  if (existstock) {
    let accumalatevalue = [];
    console.log("$$$$$$ beforeisexistsalestock ????? ");
    console.log(beforeisexistsalestock);
    let isexistsales = beforeisexistsalestock.list;

    isexistsales.forEach((innerRow) => {
      // Check if this product exists in salestocklist
      const productInStock = salestocklist.find(
        (stockItem) => stockItem.productid === innerRow.productid
      );

      // If the product is missing in salestocklist (it might have been deleted), add it back to accumalatevalue
      if (!productInStock) {
        console.log(
          `Product ${innerRow.productid} from isexistsales is missing in salestocklist. Adding back to accumalatevalue.`
        );
        innerRow.quantity = innerRow.quantity * -1;
        accumalatevalue.push(innerRow); // Add the product from isexistsales
      } else {
        // If the product exists in both lists, update the quantity
        console.log(
          `Product ${innerRow.productid} exists in both lists. Adjusting quantity.`
        );
        productInStock.quantity =
          productInStock.quantity * 1 - innerRow.quantity * 1;
        if (productInStock.quantity !== 0) accumalatevalue.push(productInStock);
      }
    });

    // Now, handle any additional products from salestocklist that are not in isexistsales
    salestocklist.forEach((innerRow) => {
      // If the product does not exist in isexistsales, add it directly
      const productInSales = isexistsales.find(
        (saleItem) => saleItem.productid === innerRow.productid
      );
      if (!productInSales) {
        console.log(
          `Product ${innerRow.productid} from stocklist is not in isexistsales. Adding to accumalatevalue.`
        );

        accumalatevalue.push(innerRow); // Add the product from stocklist
      }
    });

    // let compainedvalue = [...salestocklist, ...isexistsales];
    // console.log("$$$$$$ isexistsales ????? ");
    // console.log(isexistsales);

    // let singllistofsales = compainedvalue.map((innerrows) => {
    //   console.log("innerrows");
    //   console.log(innerrows);
    //   let found = false;
    //   if (accumalatevalue.length > 0) {
    //     for (let i = 0; i < accumalatevalue.length; i++) {
    //       if (accumalatevalue[i].productid === innerrows.productid) {
    //         found = true;
    //         accumalatevalue[i].quantity =
    //           accumalatevalue[i].quantity * 1 - innerrows.quantity * 1;
    //         console.log(" found &&&");
    //         console.log(accumalatevalue);
    //       }
    //     }
    //     if (!found) {
    //       accumalatevalue = [...accumalatevalue, innerrows];
    //       console.log("nt found &&&");
    //     }
    //   } else {
    //     accumalatevalue = [innerrows];
    //     console.log("else &&&");
    //   }
    //   console.log("accumalatevalue &&&");
    //   console.log(accumalatevalue);
    //   // return accumalatevalue;
    // });

    console.log("accumalatevalue add stocks");
    console.log(accumalatevalue);
    let responUpdatesale = await addOrUpdateStock(
      accumalatevalue,
      userid,
      "sale"
    );
    console.log("responUpdate sale stocks 2");
    console.log(responUpdatesale);
    if (responUpdatesale != "updated")
      return res.status(400).json("error in " + responUpdatesale);
  } else {
    let responUpdate = await addOrUpdateStock(salestocklist, userid, "sale");
    console.log("%%%responUpdate sale stocks %%%%");
    console.log(responUpdate);
    if (responUpdate != "updated")
      return res.status(400).json("error in " + responUpdate);
  }

  return res.status(200).json("invoice saved");
};

const getallestimateinvoice = async (req, res, next) => {
  let inputeuserid = req.params.userid;
  let headertext = req.body.headertext;
  console.log(inputeuserid);
  console.log(req.params.toString());
  // let filteruserdata = invoice.filter((item) => {
  //     return item.userid === userid;
  // })
  let filteruserinvoice;
  try {
    filteruserinvoice = await EstimateInvoiceDetail.find({
      userid: inputeuserid,
    });
  } catch (er) {
    throw new HttpError("error in search user", 400);
  }
  console.log(filteruserinvoice);
  if (filteruserinvoice.length === 0) {
    return res.status(401).json("No Estimated invoice for this user");
  } else {
    return res.status(200).json(filteruserinvoice);
  }
};

const createorupdateestimateinvoice = async (req, res, next) => {
  let salestocklist = req.body.invoice.list;
  let allinvoice = req.body.invoice;
  let headertext = req.body.invoice.authorization;
  let clientid = req.body.invoice.clientid;
  if (headertext !== "invoicerequest") {
    return res.status(400).json("Authorization restricted");
  }
  // console.log("req.body");
  // console.log(req.body);
  let userid = req.params.userid;
  let singleinvoice = null,
    existstock = false,
    beforeisexistsalestock;
  // console.log("allinvoice ");
  // console.log(singleinvoice);
  singleinvoice = allinvoice;
  let invoice = null,
    isexistinvoice,
    updatesexistinvoice;
  // console.log('singleinvoice');
  // console.log(singleinvoice);
  try {
    updatesexistinvoice = await EstimateInvoiceDetail.find({
      userid: userid,
      invoiceid: singleinvoice.invoiceid,
    });
  } catch (er) {
    throw new HttpError("error in exist search", 400);
  }
  // console.log('updatesexistinvoice');
  // console.log(updatesexistinvoice);
  // console.log(updatesexistinvoice.length);

  let responClientUpdate = await addOrUpdateClient(
    req.body.invoice,
    userid,
    clientid,
    "add"
  );
  console.log("responClientUpdate");
  console.log(responClientUpdate);
  if (updatesexistinvoice.length === 0) {
    invoice = new EstimateInvoiceDetail({
      columns: singleinvoice.columns,
      userid: userid,
      invoiceid: singleinvoice.invoiceid,
      invoicedate: singleinvoice.invoicedate,
      invoicedate1: singleinvoice.invoicedate1,
      paymentdate: singleinvoice.paymentdate,
      paymentdate1: singleinvoice.paymentdate1,
      paymentmode: singleinvoice.paymentmode,
      list: singleinvoice.list,
      hsnlist: singleinvoice.hsnlist,
      otherchargedetail: singleinvoice.otherchargedetail,
      totalcentaxamt: singleinvoice.totalcentaxamt,
      totalstatetaxamt: singleinvoice.totalstatetaxamt,
      totalsubamt: singleinvoice.totalsubamt,
      totalamt: singleinvoice.totalamt,
      totalamtwords: singleinvoice.totalamtwords,
      totaltaxvalueamt: singleinvoice.totaltaxvalueamt,
      totalhsnamt: singleinvoice.totalhsnamt,
      totalhsnamtwords: singleinvoice.totalhsnamtwords,
      clientAdd: singleinvoice.clientAdd,
      clientName: singleinvoice.clientName,
      clientPhno: singleinvoice.clientPhno,
      clientGST: singleinvoice.clientGST,
      ctrate: singleinvoice.ctrate,
      strate: singleinvoice.strate,
      clientid: singleinvoice.clientid,
    });
    // console.log('invoice');
    // console.log(invoice);

    try {
      await invoice.save({ upsert: true });
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in new saving" + er);
    }
  } else {
    isexistinvoice = updatesexistinvoice[0];
    beforeisexistsalestock = JSON.parse(JSON.stringify(isexistinvoice));
    existstock = true;
    //  console.log('isexistinvoice');
    //  console.log(isexistinvoice);
    isexistinvoice.columns = singleinvoice.columns;
    isexistinvoice.invoicedate = singleinvoice.invoicedate;
    isexistinvoice.invoicedate1 = singleinvoice.invoicedate1;
    isexistinvoice.paymentdate = singleinvoice.paymentdate;
    isexistinvoice.paymentdate1 = singleinvoice.paymentdate1;
    isexistinvoice.paymentmode = singleinvoice.paymentmode;
    isexistinvoice.list = singleinvoice.list;
    isexistinvoice.hsnlist = singleinvoice.hsnlist;
    isexistinvoice.otherchargedetail = singleinvoice.otherchargedetail;
    isexistinvoice.totalcentaxamt = singleinvoice.totalcentaxamt;
    isexistinvoice.totalstatetaxamt = singleinvoice.totalstatetaxamt;
    isexistinvoice.totalsubamt = singleinvoice.totalsubamt;
    isexistinvoice.totalamt = singleinvoice.totalamt;
    isexistinvoice.totalamtwords = singleinvoice.totalamtwords;
    isexistinvoice.totaltaxvalueamt = singleinvoice.totaltaxvalueamt;
    isexistinvoice.totalhsnamt = singleinvoice.totalhsnamt;
    isexistinvoice.totalhsnamtwords = singleinvoice.totalhsnamtwords;
    isexistinvoice.clientAdd = singleinvoice.clientAdd;
    isexistinvoice.clientName = singleinvoice.clientName;
    isexistinvoice.clientPhno = singleinvoice.clientPhno;
    isexistinvoice.clientGST = singleinvoice.clientGST;
    isexistinvoice.ctrate = singleinvoice.ctrate;
    isexistinvoice.strate = singleinvoice.strate;
    isexistinvoice.clientid = singleinvoice.clientid;

    try {
      console.log("before estimated isexistinvoice");
      console.log(isexistinvoice);
      await isexistinvoice.save();
      //  await invoiceDetails.findByIdAndUpdate();
      // console.log(' after isexistinvoice');
      // console.log(isexistinvoice);
    } catch (er) {
      // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
      return res.status(400).json("error in updating" + er);
    }
  }
  return res.status(200).json("estimated invoice saved");
};

const deleteInvoice = async (req, res, next) => {
  console.log("req.params");
  console.log(req.params);
  console.log(req.body);
  let singleinvoice = req.body.invoice;
  console.log(req.body);
  let userid = req.params.userid;

  let isexistinvoice, updatesexistinvoice, beforeisexistsalestock;
  // console.log('singleinvoice');
  // console.log(singleinvoice);
  // return res
  //   .status(200)
  //   .json({ message: "Invoice deleted successfully", deleteinv });
  try {
    updatesexistinvoice = await InvoiceDetail.find({
      userid: userid,
      invoiceid: singleinvoice.invoiceid,
    });
  } catch (er) {
    throw new HttpError("error in exist search", 400);
  }

  console.log("updatesexistinvoice 22");
  console.log(updatesexistinvoice);

  if (updatesexistinvoice.length !== 0) {
    isexistinvoice = updatesexistinvoice[0];
    beforeisexistsalestock = JSON.parse(JSON.stringify(isexistinvoice));
    console.log("beforeisexistsalestock 22");
    console.log(beforeisexistsalestock);
    let responseDeleteInvoice = await addOrUpdateStock(
      beforeisexistsalestock.list,
      userid,
      "deleteinvoice"
    );
    console.log("responseDeleteInvoice 22");
    console.log(responseDeleteInvoice);

    if (responseDeleteInvoice != "updated")
      return res.status(400).json("error in " + responseDeleteInvoice);

    try {
      // If 'id' is a string or number, no need to cast it to ObjectId
      const deleteinv = await InvoiceDetail.findOneAndDelete({
        productid: isexistinvoice.productid, // Custom field 'id' in the query
        userid: userid, // Custom field 'userid' in the query
      });
      console.log("deleteinv");
      console.log(deleteinv);
      if (!deleteinv) {
        return res.status(404).json({ message: "Stock not found" });
      }
      return res
        .status(200)
        .json({ message: "Invoice deleted successfully", deleteinv });
    } catch (error) {
      console.error(error); // For debugging purposes
      return res.status(400).json({ message: error.message });
    }
  }
};

exports.getInvoiceid = getInvoiceid;
exports.incremeantinvoiceid = incremeantinvoiceid;
exports.createorupdateinvoice = createorupdateinvoice;
exports.getallestimateinvoice = getallestimateinvoice;
exports.createorupdateestimateinvoice = createorupdateestimateinvoice;
exports.getallinvoice = getallinvoice;
exports.deleteInvoice = deleteInvoice;
