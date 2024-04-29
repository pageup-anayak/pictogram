import express, { Request, Response } from "express";
import { config } from "dotenv";
import { authenticateJwt } from "./middleware/auth";
import proxy from "proxy-agent";
import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";

config();
console.log("region", process.env.REGION);
let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.REGION,
  endpoint: "http://localhost:8000",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
AWS.config.update(serviceConfigOptions);

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const app = express();

app.use(express.urlencoded());
app.use(express.json());

app.get("/hello", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.header);
  res.send("Hello");
});

app.get("/hi", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.header);
  res.send("hi");
});
app.get("/listTables", authenticateJwt, (req: Request, res: Response) => {
  dynamoDB
    .scan({
      TableName: "users",
    })
    .promise()
    .then((data) => console.log("listing tables", data.Items))
    .catch(console.error);
  res.send("listing Tables");
  // dynamoDB.
  //   .listTables()
  //   .promise()
  //   .then(() => {
  //     console.log("Table has been listed");
  //   });
});

app.get("/", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.header);
  res.send("home route");
});

app.get("/data", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.header);
  res.send("home route");
});

app.get("/putData", authenticateJwt, (req: Request, res: Response) => {
  console.log(req.header);
  dynamoDB
    .put({
      Item: {
        name: "ankish nayak",
        firstname: "ankish",
      },
      TableName: "Users",
    })
    .promise()
    .then((res) => {
      console.log("done putting data", res);
    })
    .catch((err) => {
      console.log("error accountered", err);
    });
  res.send("home route");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("live at ", `http://localhost:${process.env.PORT || 3000}`);
});
