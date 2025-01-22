
const { v4: uuidv4 } = require("uuid");

const { CompanyUser, CompanBankDetail, CompanyBasicDetail, CompanyTermsAndConditionDetail, CompanyUserTokenCheck } = require('../Module/CompanyDetailModel');

// const  =  require('../Module/CompanyDetailModel');
const HttpError = require("../Module/httpError");
const findUser = async (req, res, next) => {
    //console.log('req the user');
    // res.json({ userList });
    // let userlist;
    // try{
    //     userlist = await User.find({},'-passwords');
    //     console.log(userlist.length + ' userlist');
    // }catch(e){
    //     next (new HttpError ((e),244));
    // }
    // if(userlist.length > 0 )
    //     return res.status(200).json({users:userlist.map(user => user.toObject({getters: true}))});
    // next (new HttpError (('No Values'),244));
    return res.status(200).json('got user request');
}

const validateUser = (userid) => {
    var datetime = new Date();
    console.log("inside Validator123");
    console.log(userid[0].enddate + " , " + datetime + " :" + userid[0].enddate <= datetime);
    console.log(userid);
    if (userid[0].enddate != null && userid[0].enddate <= datetime) {
        return true;
    }
    else return false;
}
const fetchUserDetail = async (userid) => {
    let isUserexit;
    console.log("inside fetchUserDetail" + userid);
    if (userid.length > 0) {
        try {
            isUserexit = await CompanyUser.find({ userid: userid });
            // isUserexit = finduserpass(username, password);
            //console.log('req the isUserexit find ' + isUserexit);
        } catch (er) {
            throw new HttpError('User find', 400);
        }

        if (isUserexit.length > 0) {
            user = isUserexit[0];
            if (validateUser(isUserexit)) {
                return true
            }
            else return false;
        }
    }

}
const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    console.log('details ' + username + password);

    // finduser = userLoginname.find(item => {
    //     if (item.username === username) {
    //         if (item.password === password)
    //             return item;
    //     }

    // });

    let finduser;
    // console.log('user');

    try {
        finduser = await CompanyUser.find({ username: username, password: password });

    } catch (er) {
        throw new HttpError('error in login user' + er, 400);
    }
    console.log(finduser);
    console.log("finduser");
    let isValidUser = validateUser(finduser);
    console.log(isValidUser + " isValidUser ");
    if (finduser.length === 0) {
        //console.log('undefined');
        res.status(224).json('not found');
    } else if (validateUser(finduser)) {
        console.log("inside validateUser login");
        res.status(250).json('User account Expired');
    }
    else {
        let tier = finduser[0].tier ? finduser[0].tier : null;

        let message = {
            userid: finduser[0].userid,
            tier: tier
        }
        res.status(200).json(message);
    }
};

const signIn = async (req, res, next) => {
    const { username, password, role, type, oraganisationName, tokenid } = req.body;
    console.log(req.body);
    //console.log('get ' + username + password);
    // let finduser = finduserpass(username, password);
    // if (finduser == undefined) {
    //     console.log('undefined');
    //     res.status(200).json('created');
    // } else {
    //     res.status(224).json('User alreay exist');
    // }

    let isUserexit, user, isValidToken, validtokendet;

    try {
        isValidToken = await CompanyUserTokenCheck.find({ tokenid: tokenid, tokentype: type });
        // isUserexit = finduserpass(username, password);
        console.log('req the isValidToken find ' + isValidToken);
    } catch (er) {
        throw new HttpError('User find', 400);
    }
    if (isValidToken.length === 0) {
        return res.status(250).json("Invalid token");
    }
    else if (isValidToken[0].tokenstatus != "Active") {
        return res.status(250).json("Token id " + tokenid + " already used.");
    }
    else {
        validtokendet = isValidToken[0];

        try {
            isUserexit = await CompanyUser.find({ username: username });
            // isUserexit = finduserpass(username, password);
            console.log('req the isUserexit find ' + isUserexit);
        } catch (er) {
            throw new HttpError('User find', 400);
        }
        if (isUserexit.length === 0) {
            console.log('isUserexit');
            try {

                let registerdates, enddates;
                let datetime = new Date();
                let nexttime = new Date();
                registerdates = datetime;

                if (type == "temp") {
                    enddates = nexttime.setDate(nexttime.getDate() + 1);
                }
                else {
                    enddates = nexttime.setDate(nexttime.getDate() + 100000);
                }
                console.log('datetime ' + registerdates + enddates);
                user = new CompanyUser({
                    userid: uuidv4(),
                    username: username,
                    password: password,
                    type: type,
                    role: role,
                    tier: validtokendet.tier,
                    oraganisationName: oraganisationName,
                    registerdate: registerdates,
                    enddate: enddates
                });
                console.log('req user input ' + user);
                await user.save();

                console.log('req the isUserexit ' + isUserexit);
                validtokendet.tokenstatus = "Used";
                var activatedTime = new Date();
                validtokendet.activatedTimeStamp = activatedTime;
                try {
                    await validtokendet.save();
                } catch (er) {
                    // return next(new HttpError('error in DB connection in CompanyBasicDetails process'+er,404));
                    return res.status(400).json("error in updating token status " + er);
                }
                // validtokendet
            } catch (er) {
                // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
                return res.status(400).json("error in user creation " + er);
            }
            return res.status(201).json(user.userid);
        }

        else {
            res.status(200).json('User already exist');
        }
    }

}

const passwordReset = async (req, res, next) => {
    const { username, password, tokenid } = req.body;
    console.log(req.body);
    let isUserexit, user, isValidToken, validtokendet;

    try {
        isValidToken = await CompanyUserTokenCheck.find({ tokenid: tokenid, tokentype: "reset" });
        // isUserexit = finduserpass(username, password);
        console.log('req the isValidToken find ' + isValidToken);
    } catch (er) {
        throw new HttpError('User find', 400);
    }
    if (isValidToken.length === 0) {
        return res.status(250).json("Invalid token");
    }
    else if (isValidToken[0].tokenstatus != "Active") {
        return res.status(250).json("Token id " + tokenid + " already used.");
    }
    else {
        validtokendet = isValidToken[0];

        try {
            isUserexit = await CompanyUser.find({ username: username });
            // isUserexit = finduserpass(username, password);
            console.log('req the isUserexit find ' + isUserexit);
        } catch (er) {
            throw new HttpError('User find', 400);
        }
        if (isUserexit.length !== 0) {
            console.log('isUserexit');
            try {
                user=isUserexit[0];
                user.password=password;
                validtokendet.tokenstatus = "Used";
                var activatedTime = new Date();
                validtokendet.activatedTimeStamp = activatedTime;
                try {
                    await validtokendet.save();
                    await user.save();
                } catch (er) {
                    // return next(new HttpError('error in DB connection in CompanyBasicDetails process'+er,404));
                    return res.status(400).json("error in updating token status " + er);
                }
                // validtokendet
            } catch (er) {
                // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
                return res.status(400).json("error in user creation " + er);
            }
            return res.status(201).json("Password changed");
        }

        else {
            res.status(400).json('User does not exist');
        }
    }

}

const getCompanyBankDetails = async (req, res, next) => {
    const userid = req.params.userid;
    let isCompanyBankDetails;
    try {
        isCompanyBankDetails = await CompanBankDetail.find({ userid: userid });
        // isCompanyBankDetails = finduserpass(username, password);
        //console.log('req the isCompanyBankDetails find ' + isCompanyBankDetails);
    } catch (er) {
        throw new HttpError('User find', 400);
    }
    if (isCompanyBankDetails.length === 0) {
        //console.log('undefined');
        res.status(224).json('Company Bank Details not found');
    }
    else {
        res.status(200).json(isCompanyBankDetails);
    }

}

const addOrModifyCompanyBankDetails = async (req, res, next) => {
    const allbankdetails = req.body;
    const userid = req.params.userid;
    // console.log('get addOrModifyCompanyBankDetails');
    // console.log(allbankdetails);
    // console.log(allbankdetails.bankdetails);
    let singlebankdetail;
    try {
        updatebankdet = await CompanBankDetail.deleteMany({ userid: userid });

    } catch (er) {
        throw new HttpError('error addOrModifyCompanyBankDetails exist search', 400);
    }
    // console.log('updatebankdet');
    // console.log(updatebankdet);

    for (let i = 0; i < allbankdetails.length; i++) {
        singlebankdetail = allbankdetails[i];
        let newbankdetal;

        newbankdetal = new CompanBankDetail({
            id: singlebankdetail.id,
            userid: userid,
            title: singlebankdetail.title,
            value: singlebankdetail.value,
            isvisible: singlebankdetail.isvisible
        });
        try {
            await newbankdetal.save({ upsert: true });
        } catch (er) {
            // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
            return res.status(400).json("error " + er);
        }
    }
    res.status(200).json('Bank Details updated');
}

// const addOrModifyCompanyBankDetails = async (req, res, next) => {
//     const allbankdetails = req.body;
//     const userid = req.params.userid;
//     console.log('get addOrModifyCompanyBankDetails' );
//     console.log(allbankdetails);
//     // console.log(allbankdetails.bankdetails);
//     let singlebankdetail;
//     for (let i = 0; i < allbankdetails.length; i++) {
//         singlebankdetail = allbankdetails[i];
//         let existbankdet, updatebankdet, newbankdetal;
//         try {
//             updatebankdet = await CompanBankDetail.find({ id: singlebankdetail.id, userid: userid });
//             updatebankdet = await CompanBankDetail.deleteMany({ id: singlebankdetail.id, userid: userid });
//         } catch (er) {
//             throw new HttpError('error addOrModifyCompanyBankDetails exist search', 400);

//         }
//          console.log('updatebankdet');
//         console.log(updatebankdet);
//         if (updatebankdet.length === 0) {
//             try {
//                 newbankdetal = new CompanBankDetail({
//                     id: singlebankdetail.id,
//                     userid: userid,
//                     title: singlebankdetail.title,
//                     value: singlebankdetail.value,
//                     isvisible: singlebankdetail.isvisible
//                 });
//                 await newbankdetal.save({ upsert: true });

//             } catch (er) {
//                 // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
//                 return res.status(400).json("error " + er);
//             }
//         }
//         else {

//             existbankdet = updatebankdet[0];
//             // console.log('existbankdet');
//             // console.log(existbankdet);
//             existbankdet.title = singlebankdetail.title;
//             existbankdet.value = singlebankdetail.value;
//             existbankdet.isvisible = singlebankdetail.isvisible;

//             try {
//                 await existbankdet.save({ upsert: true });
//             } catch (er) {
//                 // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
//                 return res.status(400).json("error " + er);
//             }

//         }

//     }
//      res.status(200).json('Bank Details updated');
// }

const getCompanyBasicDetails = async (req, res, next) => {
    const userid = req.params.userid;
    let isCompanyBasicDetails;
    let checkUserExpiry = await fetchUserDetail(userid);
    console.log(" : checkUserExpiry inside getCompanyBasicDetails ");
    console.log(checkUserExpiry);
    if (checkUserExpiry) {
        res.status(250).json('User account Expired');
    }
    else if (userid.length > 0) {
        try {
            isCompanyBasicDetails = await CompanyBasicDetail.find({ userid: userid });
            // isCompanyBasicDetails = finduserpass(username, password);
            console.log('req the isCompanyBasicDetails find ' + isCompanyBasicDetails);
        } catch (er) {
            throw new HttpError('User find', 400);
        }

        if (isCompanyBasicDetails.length === 0) {
            //console.log('undefined');
            res.status(224).json('Company Basic Details not found');
        }
        else {
            res.status(200).json(isCompanyBasicDetails);
        }
    }


}

const addOrModifyCompanyBasicDetails = async (req, res, next) => {
    const basicdetail = req.body;
    const userid = req.params.userid;
    let existCompanyBasicDetails, isCompanyBasicDetails;
    try {
        isCompanyBasicDetails = await CompanyBasicDetail.find({ userid: userid });
        // isCompanyBasicDetails = finduserpass(username, password);
        //console.log('req the isCompanyBasicDetails find ' + isCompanyBasicDetails);
    } catch (er) {
        throw new HttpError('User find', 400);
    }
    if (isCompanyBasicDetails.length === 0) {
        //console.log('undefined');
        try {
            isCompanyBasicDetails = new CompanyBasicDetail({
                userid: userid,
                companyName: basicdetail.companyName,
                companyTagLine: basicdetail.companyTagLine,
                companyAddress: basicdetail.companyAddress,
                companyPhno: basicdetail.companyPhno,
                companymailid: basicdetail.companymailid,
                companyGstin: basicdetail.companyGstin,
                companyGstinStatename: basicdetail.companyGstinStatename,
                companyOwner: basicdetail.companyOwner,
                companyDeleration: basicdetail.companyDeleration,
                companythankyou: basicdetail.companythankyou,
                invoiceidcount: basicdetail.invoiceidcount,
                estimateidcount: basicdetail.estimateidcount,
                companyImage: basicdetail.companyImage,
                companymsme: basicdetail.companymsme
            });
            //console.log('req user input ' + isCompanyBasicDetails);
            await isCompanyBasicDetails.save();
            //console.log('req the modified isCompanyBasicDetails ' + isCompanyBasicDetails);
        } catch (er) {
            // return next(new HttpError('error in DB connection in CompanyBasicDetails process'+er,404));
            return res.status(400).json("error " + er);
        }
        return res.status(201).json({ message: 'Company Basic Details Created' });
    }
    else {
        existCompanyBasicDetails = isCompanyBasicDetails[0];
        existCompanyBasicDetails.companyName = basicdetail.companyName;
        existCompanyBasicDetails.companyTagLine = basicdetail.companyTagLine;
        existCompanyBasicDetails.companyAddress = basicdetail.companyAddress;
        existCompanyBasicDetails.companyPhno = basicdetail.companyPhno;
        existCompanyBasicDetails.companymailid = basicdetail.companymailid;
        existCompanyBasicDetails.companyGstin = basicdetail.companyGstin;
        existCompanyBasicDetails.companyGstinStatename = basicdetail.companyGstinStatename;
        existCompanyBasicDetails.companyOwner = basicdetail.companyOwner;
        existCompanyBasicDetails.companyDeleration = basicdetail.companyDeleration;
        existCompanyBasicDetails.companythankyou = basicdetail.companythankyou;
        existCompanyBasicDetails.invoiceidcount = basicdetail.invoiceidcount;
        existCompanyBasicDetails.estimateidcount = basicdetail.estimateidcount;
        existCompanyBasicDetails.companyImage = basicdetail.companyImage;
        existCompanyBasicDetails.companymsme = basicdetail.companymsme;

        console.log('req the modified existCompanyBasicDetails ' + existCompanyBasicDetails);
        try {
            await existCompanyBasicDetails.save();
        } catch (er) {
            // return next(new HttpError('error in DB connection in CompanyBasicDetails process'+er,404));
            return res.status(400).json("error " + er);
        }
        res.status(200).json('Company Details Updated');
    }

}

const getCompanyTermsAndConditionDetail = async (req, res, next) => {
    const userid = req.params.userid;
    let isCompanyTermsAndConditionDetails;
    try {
        isCompanyTermsAndConditionDetails = await CompanyTermsAndConditionDetail.find({ userid: userid });
        // isCompanyTermsAndConditionDetails = finduserpass(username, password);
        //console.log('req the isCompanyTermsAndConditionDetails find ' + isCompanyTermsAndConditionDetails);
    } catch (er) {
        throw new HttpError('User find', 400);
    }
    if (isCompanyTermsAndConditionDetails.length === 0) {
        //console.log('undefined');
        res.status(224).json('Company TermsAndCondition Details not found');
    }
    else {
        res.status(200).json(isCompanyTermsAndConditionDetails);
    }

}

const addOrModifyCompanyTermsAndConditionDetail = async (req, res, next) => {
    const allTermsAndConditionDetails = req.body;
    const userid = req.params.userid;
    //console.log(allTermsAndConditionDetails);

    try {
        updateTermsAndConditiondet = await CompanyTermsAndConditionDetail.deleteMany({ userid: userid });

    } catch (er) {
        throw new HttpError('error addOrModifyCompanyTermsAndConditionDetails exist search', 400);
    }
    //console.log('updateTermsAndConditiondet');
    //console.log(updateTermsAndConditiondet);

    let singleTermsAndConditionDetails;
    for (let i = 0; i < allTermsAndConditionDetails.length; i++) {
        singleTermsAndConditionDetails = allTermsAndConditionDetails[i];
        let newTermsAndConditiondetal;
        //console.log('updateTermsAndConditiondet');
        //console.log(updateTermsAndConditiondet);
        try {
            newTermsAndConditiondetal = new CompanyTermsAndConditionDetail({
                id: singleTermsAndConditionDetails.id,
                userid: userid,
                title: singleTermsAndConditionDetails.title,
                desc: singleTermsAndConditionDetails.desc,
                isvisible: singleTermsAndConditionDetails.isvisible
            });
            await newTermsAndConditiondetal.save({ upsert: true });
        } catch (er) {
            // return next(new HttpError('error in DB connection in isUserexit process'+er,404));
            return res.status(400).json("error " + er);
        }
    }
    res.status(200).json('TermsAndCondition Details updated');
}

const uploadCompanyLogo = async (req, res, next) => {
    console.log("intering");
    const allTermsAndConditionDetails = req.body;
    const userid = req.params.userid;
    console.log(allTermsAndConditionDetails);
    res.status(200).json('Image updated');
}

// const uploadCompanyLogo = async (req, res, next) => {
//     // const companylogo = req.body;
//     // const userid = req.params.userid;
//     //  console.log(companylogo);//
//     res.set('Access-Control-Allow-Origin', '*');
//      console.log(req);

//     //  async function uploadFile(bucketName, file, fileOutputName) {
//     //     try {
//     //         // Get a reference to the specified bucket
//     //         const bucket = storage.bucket(bucketName);
//     //         const storagepath = `BillEdge/CompanyLogo/${fileOutputName}`;
//     //         // Upload the specified file to the bucket with the given destination name
//     //         const ret = await bucket.upload(file, {
//     //             destination: storagepath
//     //         });

//     //         // Return the result of the upload operation
//     //         return ret;
//     //     } catch (error) {
//     //         // Handle any errors that occur during the upload process
//     //         console.error('Error:', error);
//     //     }
//     // }

//     // // Use an immediately-invoked function expression (IIFE) to call the uploadFile function
//     // (async () => {
//     //     // Call the uploadFile function with the specified parameters
//     //     const ret = await uploadFile(process.env.BUCKET_NAME, 'test.txt', 'CodingWithAdo.txt');

//     //     // Log the result of the upload operation to the console
//     //     console.log(ret);
//     // })();

//     res.status(200).json('got the request');
// }
exports.uploadCompanyLogo = uploadCompanyLogo;
exports.findUser = findUser;
exports.loginUser = loginUser;
exports.signIn = signIn;
exports.passwordReset = passwordReset;
exports.getCompanyTermsAndConditionDetail = getCompanyTermsAndConditionDetail;
exports.getCompanyBasicDetails = getCompanyBasicDetails;
exports.getCompanyBankDetails = getCompanyBankDetails;

exports.addOrModifyCompanyTermsAndConditionDetail = addOrModifyCompanyTermsAndConditionDetail;
exports.addOrModifyCompanyBankDetails = addOrModifyCompanyBankDetails;
exports.addOrModifyCompanyBasicDetails = addOrModifyCompanyBasicDetails;
