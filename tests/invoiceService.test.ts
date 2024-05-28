import { InvoiceService } from "../src/service/invoiceService";
import { prismaMock } from "../singleton";
import mockFs from "mock-fs";
import path from "path";
import fs from "fs";

jest.mock("../src/utils/extractorPDF", () => ({
  extractDataFromPDF: jest.fn(),
}));

import { extractDataFromPDF } from "../src/utils/extractorPDF";

describe("InvoiceService", () => {
  const invoiceService = new InvoiceService();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs({
      "tmp/uploads": {
        "test.pdf": "PDF content",
      },
      "src/uploads": {},
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  test("should upload an invoice", async () => {
    const invoiceData = {
      clienteId: "123",
      mesReferencia: "2024-05",
      energiaKWh: 100,
      energiaValor: 200,
      sceeKWh: 50,
      sceeValor: 100,
      compensadaKWh: 10,
      compensadaValor: 20,
      contribIlum: 30,
    };

    (extractDataFromPDF as jest.Mock).mockResolvedValue(invoiceData);

    const filePath = "tmp/uploads/test.pdf";
    const targetPath = path.join(
      __dirname,
      "../src/uploads",
      path.basename(filePath)
    );

    prismaMock.invoice.create.mockResolvedValue({
      id: 1,
      ...invoiceData,
      pdfPath: targetPath,
    });

    await expect(invoiceService.processInvoicePdf(filePath)).resolves.toEqual({
      id: 1,
      ...invoiceData,
      pdfPath: targetPath,
    });

    expect(prismaMock.invoice.create).toHaveBeenCalledWith({
      data: {
        ...invoiceData,
        pdfPath: targetPath,
      },
    });
  });

  test("should return all invoices", async () => {
    const invoices = [
      {
        id: 1,
        clienteId: "123",
        mesReferencia: "2024-05",
        energiaKWh: 100,
        energiaValor: 200,
        sceeKWh: 50,
        sceeValor: 100,
        compensadaKWh: 10,
        compensadaValor: 20,
        contribIlum: 30,
        pdfPath: "path/to/pdf",
      },
    ];

    prismaMock.invoice.findMany.mockResolvedValue(invoices);

    await expect(invoiceService.getAllInvoices()).resolves.toEqual(invoices);
  });

  test("should return an invoice by id", async () => {
    const invoice = {
      id: 1,
      clienteId: "123",
      mesReferencia: "2024-05",
      energiaKWh: 100,
      energiaValor: 200,
      sceeKWh: 50,
      sceeValor: 100,
      compensadaKWh: 10,
      compensadaValor: 20,
      contribIlum: 30,
      pdfPath: "path/to/pdf",
    };

    prismaMock.invoice.findUnique.mockResolvedValue(invoice);

    await expect(invoiceService.getInvoiceById(1)).resolves.toEqual(invoice);
  });

  test("should throw an error if invoice not found", async () => {
    prismaMock.invoice.findUnique.mockResolvedValue(null);

    await expect(invoiceService.getInvoiceById(1)).rejects.toThrow(
      "Invoice not found"
    );
  });
  test("should delete an invoice by id", async () => {
    const invoice = {
      id: 1,
      clienteId: "123",
      mesReferencia: "2024-05",
      energiaKWh: 100,
      energiaValor: 200,
      sceeKWh: 50,
      sceeValor: 100,
      compensadaKWh: 10,
      compensadaValor: 20,
      contribIlum: 30,
      pdfPath: "tmp/uploads/test.pdf",
    };

    prismaMock.invoice.findUnique.mockResolvedValue(invoice);
    prismaMock.invoice.delete.mockResolvedValue(invoice);

    await expect(invoiceService.deleteInvoiceById(1)).resolves.toEqual({
      message: "Invoice deleted successfully",
    });

    expect(prismaMock.invoice.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { pdfPath: true },
    });

    expect(prismaMock.invoice.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(() => fs.readFileSync(invoice.pdfPath)).toThrow();
  });
});
