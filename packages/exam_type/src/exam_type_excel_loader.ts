import { parse } from 'node-xlsx';

const EXAM_TYPE_WORKSHEET_NAME = 'Exam Types';
const MACROS_WORKSHEET_NAME = 'Macros';

type ExamTypeModality = 'CT' | 'MR' | 'US' | 'NM' | 'XR' | 'MG';

interface ExamTypeData {
  loincId: string;
  commonName: string;
  playbookId?: string;
  modality: ExamTypeModality;
  lateral: boolean;
  focusedBodyParts?: string[];
  includedBodyParts?: string[];
  focusedBodyPartsLeft?: string[];
  focusedBodyPartsRight?: string[];
  includedBodyPartsLeft?: string[];
  includedBodyPartsRight?: string[];
}

interface LocalMapping {
  loincId: string;
  localId: string;
}

interface Worksheet {
  name: string;
  data: unknown[][];
}

export class ExamTypeExcelLoader {
  private macros: Map<string, string[]>;
  private examTypes: ExamTypeData[];
  private localMappings: LocalMapping[];

  public constructor(private filePath: string) {
    this.macros = new Map();
    this.examTypes = [];
    this.localMappings = [];
    this.load();
  }

  private load(): void {
    const loadMacros = (worksheet: Worksheet) => {
      worksheet.data.forEach((row: unknown[], rowNumber: number) => {
        if (rowNumber === 0 || !row[0] || !row[1]) {
          return;
        }
        const name = row[0].toString().trim();
        const bodyPartIdString = row[1].toString().trim();
        const bodyPartIds = bodyPartIdString.split(/\s+/);
        this.macros.set(name, bodyPartIds);
      });
    };

    const loadExamTypes = (worksheet: Worksheet) => {
      worksheet.data.forEach((row: unknown[], rowNumber: number) => {
        if (rowNumber === 0 || !row[0]) {
          return;
        }
        const rowStrings = row as string[];
        const loincId = rowStrings[0].toString().trim();
        const commonName = rowStrings[1].toString().trim();
        const playbookId = rowStrings[2]?.toString().trim();
        const modality = rowStrings[3]?.toString().trim() as ExamTypeModality;
        const lateral = rowStrings[4] ? true : false;
        const focusedBodyParts = rowStrings[5]?.toString().trim().split(/\s+/);
        const includedBodyParts = rowStrings[6]?.toString().trim().split(/\s+/);
        const focusedBodyPartsLeft = rowStrings[7]
          ?.toString()
          .trim()
          .split(/\s+/);
        const focusedBodyPartsRight = rowStrings[8]
          ?.toString()
          .trim()
          .split(/\s+/);
        const includedBodyPartsLeft = rowStrings[9]
          ?.toString()
          .trim()
          .split(/\s+/);
        const includedBodyPartsRight = rowStrings[10]
          ?.toString()
          .trim()
          .split(/\s+/);
        const examType: ExamTypeData = {
          loincId,
          commonName,
          playbookId,
          modality,
          lateral,
          focusedBodyParts: expandMacros(focusedBodyParts),
          includedBodyParts: expandMacros(includedBodyParts),
          focusedBodyPartsLeft: expandMacros(focusedBodyPartsLeft),
          focusedBodyPartsRight: expandMacros(focusedBodyPartsRight),
          includedBodyPartsLeft: expandMacros(includedBodyPartsLeft),
          includedBodyPartsRight: expandMacros(includedBodyPartsRight),
        };
        this.examTypes.push(examType);
        if (row[11]) {
          const localId = rowStrings[11].toString().trim();
          this.localMappings.push({ loincId, localId });
        }
      });
    };

    const expandMacros = (rawBodyParts: string[] | undefined) => {
      if (!rawBodyParts || this.macros.size === 0) {
        return rawBodyParts;
      }
      const expandedBodyParts: string[] = [];
      rawBodyParts.forEach((bodyPartId) => {
        const macro = this.macros.get(bodyPartId);
        if (macro) {
          expandedBodyParts.push(...macro);
        } else {
          expandedBodyParts.push(bodyPartId);
        }
      });
      return expandedBodyParts;
    };

    const workbook = parse(this.filePath);
    const macroWorksheet = workbook.find((worksheet: Worksheet) => {
      return worksheet.name === MACROS_WORKSHEET_NAME;
    });
    if (macroWorksheet) {
      loadMacros(macroWorksheet);
    }
    const examTypeWorksheet = workbook.find((worksheet: Worksheet) => {
      return worksheet.name === EXAM_TYPE_WORKSHEET_NAME;
    });
    if (examTypeWorksheet) {
      loadExamTypes(examTypeWorksheet);
    }
  }

  public printMacros(): void {
    this.macros.forEach((value: string[], key: string) => {
      console.log(`${key}: ${value}`);
    });
  }

  public printExamTypes(): void {
    console.log(JSON.stringify(this.examTypes, null, 2));
  }
}

if (require.main === module) {
  const loader = new ExamTypeExcelLoader('data/Exam Types.xlsx');
  loader.printExamTypes();
}
