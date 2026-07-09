import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import { authRoute } from "./module/auth/auth.route";

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome To The Fixit Now Server");
});
