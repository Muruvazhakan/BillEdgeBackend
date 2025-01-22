const express = require('express');
const router =express();

const userRoute = require('../controler/userController');

router.get('/',userRoute.findUser);
router.post('/login',userRoute.loginUser);
router.post('/signin',userRoute.signIn);
router.post('/passwordReset',userRoute.passwordReset);
router.get('/getcompanybasic/:userid',userRoute.getCompanyBasicDetails);
router.get('/gettermsandconditioncompany/:userid',userRoute.getCompanyTermsAndConditionDetail);
router.get('/getcompanybank/:userid',userRoute.getCompanyBankDetails);
router.post('/savecompanybasic/:userid',userRoute.addOrModifyCompanyBasicDetails);
router.post('/savetermsandconditioncompany/:userid',userRoute.addOrModifyCompanyTermsAndConditionDetail);
router.post('/savecompanybank/:userid',userRoute.addOrModifyCompanyBankDetails);

module.exports=router;