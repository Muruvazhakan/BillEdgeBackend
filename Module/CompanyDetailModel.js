const mongooes = require("mongoose");

const uniquevalidator = require("mongoose-unique-validator");

const schema = mongooes.Schema;

const companyUserSchema = new schema({
    userid: {type:String, required: true},
    username: {type:String, required: true},
    password: {type:String, required: true},
    role:{type:String},
    type:{type:String},
    tier:{type:String},
    registerdate:{type:Date},
    enddate:{type:Date},
    oraganisationName:{type:String}
},{
    strictPopulate: false
});

const companyUserTokenCheckSchema = new schema({
    tokenid:{type:String, required: true},
    tokentype:{type:String, required: true},
    tokenstatus:{type:String},
    activatedTimeStamp:{type:Date},
    tier:{type:String},
    dummy1:{type:String},
    dummy2:{type:String},
    dummy3:{type:String},
})
const companyBasicDetailSchema = new schema({
    userid:{type:String, required: true},
    companyName: {type:String, required: true},
    companyTagLine: {type:String},
    companyAddress: {type:String},
    companyPhno: {type:String},
    companymailid: {type:String},
    companyGstin: {type:String},
    companyGstinStatename: {type:String},
    companyOwner: {type:String, required: true},
    companyDeleration: {type:String},
    companythankyou: {type:String},
    companyImage: {type:String},
    companymsme:{type:String},
});

const companyTermsAndConditionDetailSchema = new schema({
    userid:{type:String, required: true},
    id:{type:String, required: true},
    title:{type:String},
    isvisible:{type:String, required: true},
    desc:{type:String, required: true},
    order:{type:String}
})

const companyBankDetailSchema = new schema({
    userid:{type:String, required: true},
    id:{type:String, required: true},
    title:{type:String, required: true},
    isvisible:{type:String, required: true},
    value:{type:String, required: true},
    order:{type:String}
});

companyUserSchema.plugin(uniquevalidator);
module.exports.CompanyUser = mongooes.model('CompanyUser',companyUserSchema);
module.exports.CompanyBasicDetail = mongooes.model('companyBasicDetail',companyBasicDetailSchema);
module.exports.CompanBankDetail = mongooes.model('CompanBankDetail',companyBankDetailSchema);
module.exports.CompanyTermsAndConditionDetail = mongooes.model('CompanyTermsAndConditionDetail',companyTermsAndConditionDetailSchema);
module.exports.CompanyUserTokenCheck = mongooes.model('CompanyUserTokenCheck',companyUserTokenCheckSchema);