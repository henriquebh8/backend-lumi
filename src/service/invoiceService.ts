import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { extractDataFromPDF } from "../utils/extractorPDF";
import { Invoice } from "../interfaces/invoice.interface";
import prisma from "../../client";

export class InvoiceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public async processInvoicePdf(filePath: string) {
    try {
      const invoiceData = await extractDataFromPDF(filePath);
      const targetPath = path.join(
        __dirname,
        "../uploads",
        path.basename(filePath)
      );

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.rename(filePath, targetPath);

      return await prisma.invoice.create({
        data: {
          ...invoiceData,
          pdfPath: targetPath,
        },
      });
    } catch (error) {
      console.log(error, "error");
    }
  }

  public async getAllInvoices() {
    return await this.prisma.invoice.findMany({
      select: {
        id: true,
        clienteId: true,
        mesReferencia: true,
        energiaKWh: true,
        energiaValor: true,
        sceeKWh: true,
        sceeValor: true,
        compensadaKWh: true,
        compensadaValor: true,
        contribIlum: true,
      },
    });
  }

  public async getInvoiceById(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: {
        clienteId: true,
        mesReferencia: true,
        energiaKWh: true,
        energiaValor: true,
        sceeKWh: true,
        sceeValor: true,
        compensadaKWh: true,
        compensadaValor: true,
        contribIlum: true,
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  }

  public async getInvoicePdfPath(id: number): Promise<string | undefined> {
    const invoice: Partial<Invoice> | null =
      await this.prisma.invoice.findUnique({
        where: { id },
        select: {
          pdfPath: true,
        },
      });

    if (!invoice) throw new Error("Invoice not found");
    return invoice.pdfPath;
  }

  public async deleteInvoiceById(id: number) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: {
        pdfPath: true,
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    await prisma.invoice.delete({
      where: { id },
    });

    if (invoice.pdfPath) {
      await fs.unlink(invoice.pdfPath);
    }

    return { message: "Invoice deleted successfully" };
  }
}
