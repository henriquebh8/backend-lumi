import { readFileSync, existsSync } from "fs";
import pdf from "pdf-parse";

interface FaturaData {
  clienteId: string;
  mesReferencia: string;
  energiaKWh: number;
  energiaValor: number;
  sceeKWh: number;
  sceeValor: number;
  compensadaKWh: number;
  compensadaValor: number;
  contribIlum: number;
  pdfPath: string;
}

export async function extractDataFromPDF(
  filePath: string
): Promise<FaturaData> {
  if (!existsSync(filePath)) {
    throw new Error(`Arquivo PDF não localizado: ${filePath}`);
  }

  const pdfData = readFileSync(filePath);
  const data = await pdf(Buffer.from(pdfData));

  const lines = data.text.split("\n");
  let clienteId = "";
  let mesReferencia = "";
  let energiaKWh = 0;
  let energiaValor = 0;
  let sceeKWh = 0;
  let sceeValor = 0;
  let compensadaKWh = 0;
  let compensadaValor = 0;
  let contribIlum = 0;
  const mesAnoPattern =
    /(?:JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/\d{4}/g;

  lines.forEach((line, index) => {
    if (line.includes("Nº DO CLIENTE")) {
      const nextLine = lines[index + 1] || "";
      clienteId = (nextLine.match(/\d{10}/) || [""])[0];
    }

    const mesAnoMatches = line.match(mesAnoPattern);
    if (mesAnoMatches) {
      mesReferencia = mesAnoMatches[0];
    }

    if (line.includes("Energia até 30")) {
      const values = extractValuesAfterPattern(line, "Energia até 30 kWh");
      const newValues = extractSingleValueAfterPatternValue(line);
      energiaKWh += parseValue(newValues);
      energiaValor += parseValue(values[1]);
    }

    if (line.includes("Energia de 31 a 100")) {
      const values = extractValuesAfterPattern(line, "Energia de 31 a 100 kWh");
      const newValues = extractSingleValueAfterPatternValue(line);
      energiaKWh += parseValue(newValues);
      energiaValor += parseValue(values[1]);
    }

    if (line.includes("Energia de 101 a 220")) {
      const values = extractValuesAfterPattern(
        line,
        "Energia de 101 a 220 kWh"
      );
      const newValues = extractSingleValueAfterPatternValue(line);
      energiaKWh += parseValue(newValues);
      energiaValor += parseValue(values[1]);
    }

    if (line.includes("Energia acima de 221")) {
      const values = extractValuesAfterPattern(
        line,
        "Energia acima de 221 kWh"
      );
      const newValues = extractSingleValueAfterPatternValue(line);
      energiaKWh += parseValue(newValues);
      energiaValor += parseValue(values[1]);
    }
    if (line.includes("Energia SCEE s/ ICMS")) {
      const value = extractSingleValueAfterPattern(line);
      sceeKWh = parseValue(value);
      const values = extractValuesAfterPattern(line, "Energia SCEE s/ ICMS");
      sceeValor = parseValue(values[1]);
    }
    if (line.includes("Subsídio tarifa líquida")) {
      const value = extractSingleValueAfterPattern(line);
      compensadaValor = parseValue(value);
      console.log(`Subsídio tarifa líquida: ${value}`);
    }

    if (line.includes("Contrib Ilum Publica Municipal")) {
      const value = extractSingleValueAfterPattern(line);
      contribIlum = parseValue(value);
      console.log(`Extracted Contrib Ilum Publica Municipal: ${value}`);
    }
  });

  energiaKWh += sceeKWh;
  energiaKWh -= compensadaKWh;

  return {
    clienteId,
    mesReferencia,
    energiaKWh,
    energiaValor,
    sceeKWh,
    sceeValor,
    compensadaKWh,
    compensadaValor,
    contribIlum,
    pdfPath: filePath,
  };
}

function extractValuesAfterPattern(line: string, pattern: string): string[] {
  const words = line.trim().split(/\s+/);
  const index = words.findIndex(word => word.includes(pattern.split(" ")[0]));
  const values = words.slice(index + 2, index + 5);
  return values;
}

function extractSingleValueAfterPattern(line: string): string {
  const words = line.trim().split(/\s+/);
  const value = words[words.length - 1];
  console.log(`Extracting single value: ${value}`);
  return value;
}
function extractSingleValueAfterPatternValue(line: string): string {
  const words = line.trim().split(/\s+/);
  const value = words[words.length - 4];
  return value;
}

function parseValue(value: string): number {
  if (value === undefined) {
    console.error(`Value is undefined`);
    return 0;
  }
  const parsedValue = parseFloat(value.replace(",", "."));
  if (isNaN(parsedValue)) {
    console.error(`Erro ao converter valor: ${value}`);
    return 0;
  }
  return parsedValue;
}
