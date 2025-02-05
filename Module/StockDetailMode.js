const mongoose = require("mongoose");
const uniquevalidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const stockDetailSchema = new schema({
  userid: { type: String, required: true },
  rows: { type: Array, required: true },
  totalamt: { type: String },
  clientName: { type: String },
  clientPhno: { type: String },
  clientAdd: { type: String },
  stockid: { type: String },
  clientid: { type: String },
  stockdate: { type: String },
  lastupdatedstockdate: { type: String },
});

const clientDetailsSchema = new schema({
  userid: { type: String, required: true },
  clientid: { type: String },
  clientName: { type: String },
  clientPhno: { type: String },
  clientAdd: { type: String },
  clientGST: { type: String },
  lastupdatedclientdate: { type: String },
});

const allStockDetailSchema = new schema({
  productid: { type: String },
  hsn: { type: String },
  desc: { type: String },
  status: { type: String },
  quantity: { type: Number },
  totalquantity: { type: Number },
  soldquantity: { type: Number },
  rate: { type: Number },
  salerate: { type: Number },
  amount: { type: Number },
  userid: { type: String, required: true },
  lastupdatedstockdate: { type: String },
});

const stockDetailCounterSchema = new schema({
  userid: { type: String, required: true },
  stockdeatilcount: { type: String, required: true },
  date: { type: Date },
});
const saleStockDetailSchema = new schema({
  userid: { type: String, required: true },
  rows: { type: Array, required: true },
  totalsalesamt: { type: String },
  salestockid: { type: String },
  clientid: { type: String },
  salestockdate: { type: String },
  lastupdatedsalestockdate: { type: String },
});
const allSalesStockDetailSchema = new schema({
  productid: { type: String },
  desc: { type: String },
  quantity: { type: Number },
  rate: { type: Number },
  userid: { type: String, required: true },
  lastupdatedstockdate: { type: String },
});

const salestockDetailCounterSchema = new schema({
  userid: { type: String, required: true },
  salestockdeatilcount: { type: String, required: true },
  date: { type: Date },
});

stockDetailSchema.plugin(uniquevalidator);
module.exports.StockDetails = mongoose.model("StockDetails", stockDetailSchema);
module.exports.StockDeatailCounter = mongoose.model(
  "StockDeatailCounter",
  stockDetailCounterSchema
);
module.exports.SalestockDetailCounter = mongoose.model(
  "SalestockDetailCounter",
  salestockDetailCounterSchema
);
module.exports.AllStockDetailSchema = mongoose.model(
  "AllStockDetailSchema",
  allStockDetailSchema
);
module.exports.SaleStockDetailSchema = mongoose.model(
  "SaleStockDetailSchema",
  saleStockDetailSchema
);
module.exports.AllSalesStockDetailSchema = mongoose.model(
  "AllSalesStockDetailSchema",
  allSalesStockDetailSchema
);
module.exports.ClientDetailsSchema = mongoose.model(
  "ClientDetailsSchema",
  clientDetailsSchema
);
