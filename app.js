const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const path = require("path");
const projectId = process.env.PROJECT_ID;
const secrectfolder = process.env.SECRECT_FOLDER;
const stockRoute = require("./router/stockRoute");
// const keyFilename = process.env.KEYFILENAME;
const keyFilename = path.join(
  "/etc/secrets",
  "helpone-9bf33-64e48296ae59.json"
);
const storage = new Storage({ projectId, keyFilename });
console.log("keyFilename");
console.log(keyFilename);
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const { mongoose } = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });
const datas = process.env.MONGO_URI;
const bucket = storage.bucket(process.env.BUCKET_NAME);

const userRoure = require("./router/userRoute");
const userImageRoute = require("./controler/userController");
const expenseRoute = require("./router/expenseRoute");
// const invoicegen = require('./router/invoicegenRoute');
const invoicegenRoute = require("./router/invoicegenRoute");
const estimategenRoute = require("./router/estimateRoute");

app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  // console.log(req);
  next();
});

app.get("/", (req, res, next) => {
  //console.log("app inside");
  res.status(200).json("got request");
});

const multerMid = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
});
// app.use(multerMid.single('file'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post(
  "/uploadCompanyLogo",
  upload.single("file"),
  async (req, res, next) => {
    //console.log("app inside");
    console.log("intering123");
    // const body = req.body;
    // const userid = req.params.userid;
    // console.log(res);
    // console.log(userid);
    const myFile = req.file;

    console.log(myFile);
    console.log("req.body.filename " + req.body.filename);
    try {
      // Get a reference to the specified bucket
      const bucket = storage.bucket(process.env.BUCKET_NAME);
      const storagepath = `BillEdge/CompanyLogo/${req.body.filename}`;

      const blob = bucket.file(storagepath);
      console.log("storagepath ");
      console.log(storagepath);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
        resumable: false,
      });
      // console.log("blobStream ");
      // console.log(blobStream);
      blobStream.on("error", (err) => {
        next(err);
        console.log(err);
        return;
      });
      blobStream.on("finish", () => {
        res.status(200).send(storagepath);
      });
      blobStream.end(req.file.buffer);
      // Upload the specified file to the bucket with the given destination namE
      // const ret = await bucket.upload(file, { // ORG CODE WORKING
      //     destination: storagepath,

      // });
    } catch (error) {
      // Handle any errors that occur during the upload process
      console.error("Error:", error);
    }
  }
);

//  app.post("/upload", upload.single("file"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   const file = req.file;
//   const fileName = `${Date.now()}-${file.originalname}`; // Use current timestamp to avoid name clashes
//   const storagePath = `uploads/${fileName}`;  // This is the path inside your GCS bucket

//   try {

//     const blob = bucket.file(fileName);
//     const blobStream = blob.createWriteStream();
//     blobStream.on('finish',() =>{
//       res.status(200).send("Sucsess");
//     })
//     blobStream.end(req.file.buffer);
//     // Upload the file to Google Cloud Storage using bucket.upload()
//     // const ret = await bucket.upload(file.buffer, {
//     //   destination: storagePath,  // Set the destination path in your bucket
//     //   metadata: {
//     //     contentType: file.mimetype,
//     //   },
//     // });

//     // Generate a public URL for the uploaded file
//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

//     // res.status(200).send({
//     //   message: "File uploaded successfully!",
//     //   fileUrl: publicUrl,  // Return the URL of the uploaded file
//     // });
//   } catch (err) {
//     console.error("Error uploading file:", err);
//     res.status(500).send("Error uploading file.");
//   }
// });
app.use(
  cors({
    origin: ["http://localhost:3000", "https://billedge.netlify.app"],
  })
);
app.use("/user/", userRoure);
app.use("/expense/", expenseRoute);
app.use("/invoice/", invoicegenRoute);
app.use("/estimate/", estimategenRoute);
app.use("/stock/", stockRoute);
app.use((req, res, next) => {
  res.status(400);
  res.json("No data found");
});

mongoose
  .connect(datas)
  .then(() => {
    app.listen(port, () => {
      console.log(`BillEdge app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
// app.listen(6000);
