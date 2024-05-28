import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import invoiceRoutes from "./routes/invoice.routes";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/", invoiceRoutes);

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

connectToDatabase();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send("Something broke!");
});

export { app };
