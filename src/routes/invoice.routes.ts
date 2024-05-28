import { Router } from "express";
import { InvoiceController } from "../controller/invoiceController";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = Router();
const invoiceController = new InvoiceController();

router.get("/invoices", invoiceController.getInvoices.bind(invoiceController));
router.get(
  "/invoices/:id",
  invoiceController.getInvoiceById.bind(invoiceController)
);
router.post(
  "/upload",
  upload.single("file"),
  invoiceController.uploadInvoice.bind(invoiceController)
);
router.get(
  "/invoices/:id/pdf",
  invoiceController.getInvoicePdf.bind(invoiceController)
);
router.delete(
  "/invoices/:id",
  invoiceController.deleteInvoice.bind(invoiceController)
);

export default router;
