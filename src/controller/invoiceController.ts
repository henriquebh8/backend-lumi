import { Request, Response } from "express";
import { InvoiceService } from "../service/invoiceService";

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  public async getInvoices(req: Request, res: Response): Promise<any> {
    try {
      const invoices = await this.invoiceService.getAllInvoices();
      if (!invoices) {
        return res.status(404).send("Invoices not found.");
      }
      res.json(invoices);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async getInvoiceById(req: Request, res: Response): Promise<any> {
    try {
      const invoiceId = parseInt(req.params.id);
      if (isNaN(invoiceId)) {
        return res.status(400).send("Invalid invoice ID.");
      }
      const invoice = await this.invoiceService.getInvoiceById(invoiceId);
      if (!invoice) {
        return res.status(404).send("Invoice not found.");
      }
      res.json(invoice);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async uploadInvoice(req: Request, res: Response): Promise<any> {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    try {
      const file = req.file;
      const invoiceData = await this.invoiceService.processInvoicePdf(
        file.path
      );
      res.status(201).json(invoiceData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async getInvoicePdf(req: Request, res: Response): Promise<any> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).send("Invalid ID format");
      }

      const pdfPath = await this.invoiceService.getInvoicePdfPath(id);
      if (!pdfPath) {
        return res
          .status(404)
          .send("Invoice not found or file does not exist.");
      }
      res.download(pdfPath);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      }
    }
  }

  public async deleteInvoice(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const result = await this.invoiceService.deleteInvoiceById(Number(id));
      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      }
    }
  }
}
