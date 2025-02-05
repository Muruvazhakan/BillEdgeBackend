const mongoose = require("mongoose");
const uniquevalidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const invoiceDetailSchema = new schema({
  columns: { type: Array },
  userid: { type: String, required: true },
  invoiceid: { type: String },
  invoicedate: { type: String },
  invoicedate1: { type: String },
  paymentdate: { type: String },
  paymentdate1: { type: String },
  paymentmode: { type: String },
  list: { type: Array },
  hsnlist: { type: Array },
  otherchargedetail: { type: Array },
  totalcentaxamt: { type: String },
  totalstatetaxamt: { type: String },
  totalsubamt: { type: String },
  totalamt: { type: String },
  totalamtwords: { type: String },
  totaltaxvalueamt: { type: String },
  totalhsnamt: { type: String },
  totalhsnamtwords: { type: String },
  clientName: { type: String },
  clientPhno: { type: String },
  clientAdd: { type: String },
  clientGST: { type: String },
  ctrate: { type: String },
  strate: { type: String },
});

const invoiceDetailCounterSchema = new schema({
  userid: { type: String, required: true },
  invoicedeatilcount: { type: String, required: true },
  date: { type: Date },
});
invoiceDetailSchema.plugin(uniquevalidator);
module.exports.InvoiceDetail = mongoose.model(
  "InvoiceDetail",
  invoiceDetailSchema
);
module.exports.InvoiceDetailCounter = mongoose.model(
  "InvoiceDetailCounter",
  invoiceDetailCounterSchema
);
