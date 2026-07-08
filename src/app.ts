import express, { type Application, type Request, type Response } from "express";

export const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome To The Fixit Now Server");
});
