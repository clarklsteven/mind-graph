import express from "express";
import graphsRouter from "./routes/graphs";
import healthcheckRouter from "./routes/healthcheck";
import userRouter from "./routes/user";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/graphs", graphsRouter);
app.use("/healthcheck", healthcheckRouter);
app.use("/user", userRouter);

const port = 3000;

app.listen(port, () => {
    console.info(`Mind Graph server listening on ${port}`);
});