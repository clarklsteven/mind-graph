import express from "express";
import healthcheckRouter from "./routes/healthcheck";
import userRouter from "./routes/user";

const app = express();
app.use(express.json());

app.use("/healthcheck", healthcheckRouter);
app.use("/user", userRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Mind Graph server listening on ${port}`);
});