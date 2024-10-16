const { EstimateDetails } = require("../Module/EstimateDetailModel");
const HttpError = require("../Module/httpError");
const { InvoiceDetail,InvoiceDetailCounter } = require("../Module/InvoiceDetailModel");

const getInvoicedata = async(req,res,next) =>{

    // console.log('get invoice');
    
    res.status(200).json('get invoice');
}

const getInvoiceid = async(req,res,next) =>{
    let inputuserid = req.params.userid;
    let headertext = req.body.headertext;
    let invoiceid;
    try{
        invoiceid = await InvoiceDetailCounter.find({userid:inputuserid});

        if(invoiceid.length !==0){
            return res.status(200).json(invoiceid[0].invoicedeatilcount);
        }
        else{
            return res.status(204).json('No invoice count is registered');
        }
    }catch (er) {
        throw new HttpError('error in search user', 400);
    }

   
    // console.log('get invoice');
}

const incremeantinvoiceid = async (req, res, next) => {
    let inputeuserid = req.params.userid;
    let invoiceids = req.body.invoicecount;
    let headertext = req.body.headertext;
    console.log('invoiceids');
    console.log(invoiceids);
    let invoiceidvalue, finalsave;
    try {
        invoiceidvalue = await InvoiceDetailCounter.find({ userid: inputeuserid });
    } catch (er) {
        throw new HttpError('error in search user', 400);
    }
    console.log('invoiceidvalue');
    console.log(invoiceidvalue);
    if (invoiceidvalue.length > 0) {
        finalsave = invoiceidvalue[0];
        console.log('inside');
        finalsave.invoicedeatilcount = invoiceids;
        //console.log(finalsave);
        try {
            await finalsave.save({ upsert: true });
        } catch (er) {
            // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
            return res.status(400).json("error " + er);
        }
    }
    else {
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
}

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
        throw new HttpError('error in search user', 400);
    }
    console.log(filteruserinvoice);
    if (filteruserinvoice.length === 0) {
        return res.status(401).json('No invoice for this user');
    }
    else {
        return res.status(200).json(filteruserinvoice);
    }

}

const createorupdateinvoice = async (req, res, next) => {

    let allinvoice = req.body.invoice;
    let headertext = req.body.invoice.authorization;
    if(headertext !=="invoicerequest"){
        return res.status(400).json("Authorization restricted");
    }
    // console.log("req.body");
    // console.log(req.body);
    let userid = req.params.userid;
    let singleinvoice = null;
    // console.log("allinvoice ");
    // console.log(singleinvoice);
        singleinvoice = allinvoice;
        let invoice = null, isexistinvoice, updatesexistinvoice;
        // console.log('singleinvoice');
        // console.log(singleinvoice);
        try {
            updatesexistinvoice = await InvoiceDetail.find({userid:userid,invoiceid: singleinvoice.invoiceid });

        } catch (er) {
            throw new HttpError('error in exist search', 400);
        }
        // console.log('updatesexistinvoice');
        // console.log(updatesexistinvoice);
        // console.log(updatesexistinvoice.length);
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
                ctrate: singleinvoice.ctrate,
                strate: singleinvoice.strate,
            });
            // console.log('invoice');
            // console.log(invoice);
            try {

                await invoice.save({ upsert: true });
            } catch (er) {
                // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
                return res.status(400).json("error in new saving" + er);
            }

        }
        else {
            isexistinvoice = updatesexistinvoice[0];
            //  console.log('isexistinvoice');
            //  console.log(isexistinvoice);
            isexistinvoice.columns=singleinvoice.columns;           
            isexistinvoice.invoicedate=singleinvoice.invoicedate;
            isexistinvoice.invoicedate1=singleinvoice.invoicedate1;
            isexistinvoice.paymentdate=singleinvoice.paymentdate;
            isexistinvoice.paymentdate1=singleinvoice.paymentdate1;
            isexistinvoice.paymentmode=singleinvoice.paymentmode;
            isexistinvoice.list=singleinvoice.list;
            isexistinvoice.hsnlist=singleinvoice.hsnlist;
            isexistinvoice.otherchargedetail=singleinvoice.otherchargedetail;
            isexistinvoice.totalcentaxamt=singleinvoice.totalcentaxamt;
            isexistinvoice.totalstatetaxamt=singleinvoice.totalstatetaxamt;
            isexistinvoice.totalsubamt=singleinvoice.totalsubamt;        
            isexistinvoice.totalamt=singleinvoice.totalamt;
            isexistinvoice.totalamtwords=singleinvoice.totalamtwords;
            isexistinvoice.totaltaxvalueamt=singleinvoice.totaltaxvalueamt;
            isexistinvoice.totalhsnamt=singleinvoice.totalhsnamt;
            isexistinvoice.totalhsnamtwords=singleinvoice.totalhsnamtwords;
            isexistinvoice.clientAdd=singleinvoice.clientAdd;
            isexistinvoice.clientName=singleinvoice.clientName;
            isexistinvoice.clientPhno=singleinvoice.clientPhno;
            isexistinvoice.ctrate=singleinvoice.ctrate;
            isexistinvoice.strate=singleinvoice.strate;

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


    return res.status(200).json('invoice saved');

}

exports.getInvoiceid=getInvoiceid;
exports.incremeantinvoiceid=incremeantinvoiceid;
exports.createorupdateinvoice=createorupdateinvoice;
exports.getallinvoice=getallinvoice;