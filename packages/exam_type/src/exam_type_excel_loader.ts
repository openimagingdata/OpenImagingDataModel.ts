import { parse } from 'node-xlsx';

const EXAM_TYPE_WORKSHEET_NAME = 'Exam Types';
const MACROS_WORKSHEET_NAME = 'Macros';

const LOINC_ID_COLUMN = 0;
const COMMON_NAME_COLUMN = 1;
const PLAYBOOK_ID_COLUMN = 2;
const MODALITY_COLUMN = 3;
const LATERAL_COLUMN = 4;
const CONTRAST_COLUMN = 5;
const FOCUSED_BODY_PARTS_COLUMN = 6;
const INCLUDED_BODY_PARTS_COLUMN = 7;
const FOCUSED_BODY_PARTS_LEFT_COLUMN = 8;
const FOCUSED_BODY_PARTS_RIGHT_COLUMN = 9;
const INCLUDED_BODY_PARTS_LEFT_COLUMN = 10;
const INCLUDED_BODY_PARTS_RIGHT_COLUMN = 11;
const LOCAL_ID_COLUMN = 12;

type ExamTypeModality = 'CT' | 'MR' | 'US' | 'NM' | 'XR' | 'MG' | 'PT+CT';
type ContrastType = 'W' | 'WO' | 'WWO';

interface ExamTypeData {
  loincId: string;
  commonName: string;
  playbookId?: string;
  modality: ExamTypeModality;
  lateral: boolean;
  contrast?: ContrastType;
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

    const loadMacros = (worksheet: Worksheet) => {
      worksheet.data.forEach((row: unknown[], rowNumber: number) => {
        if (rowNumber === 0 || !row[0] || !row[1]) {
          return;
        }
        const name = row[0].toString().trim();
        const bodyPartIdString = row[1].toString().trim();
        const bodyPartIds = bodyPartIdString.split(/\s+/);
        const expandedBodyPartIds = expandMacros(bodyPartIds);
        if (expandedBodyPartIds && expandedBodyPartIds.length > 0)
          this.macros.set(name, expandedBodyPartIds);
      });
    };

    const loadExamTypes = (worksheet: Worksheet) => {
      worksheet.data.forEach((row: unknown[], rowNumber: number) => {
        if (rowNumber === 0 || !row[0]) {
          return;
        }
        const rowStrings = row as string[];
        const loincId = rowStrings[LOINC_ID_COLUMN].toString().trim();
        const commonName = rowStrings[COMMON_NAME_COLUMN].toString().trim();
        const playbookId = rowStrings[PLAYBOOK_ID_COLUMN]?.toString().trim();
        const modality = rowStrings[
          MODALITY_COLUMN
        ]?.toString().trim() as ExamTypeModality;
        const lateral = rowStrings[LATERAL_COLUMN] ? true : false;
        const contrast = rowStrings[
          CONTRAST_COLUMN
        ]?.toString().trim() as ContrastType;
        const focusedBodyParts = rowStrings[
          FOCUSED_BODY_PARTS_COLUMN
        ]?.toString()
          .trim()
          .split(/\s+/);
        const includedBodyParts = rowStrings[
          INCLUDED_BODY_PARTS_COLUMN
        ]?.toString()
          .trim()
          .split(/\s+/);
        const focusedBodyPartsLeft = rowStrings[
          FOCUSED_BODY_PARTS_LEFT_COLUMN
        ]?.toString()
          .trim()
          .split(/\s+/);
        const focusedBodyPartsRight = rowStrings[
          FOCUSED_BODY_PARTS_RIGHT_COLUMN
        ]?.toString()
          .trim()
          .split(/\s+/);
        const includedBodyPartsLeft = rowStrings[
          INCLUDED_BODY_PARTS_LEFT_COLUMN
        ]?.toString()
          .trim()
          .split(/\s+/);
        const includedBodyPartsRight = rowStrings[
          INCLUDED_BODY_PARTS_RIGHT_COLUMN
        ]?.toString()
          .trim()
          .split(/\s+/);
        const examType: ExamTypeData = {
          loincId,
          commonName,
          playbookId,
          modality,
          lateral,
          contrast,
          focusedBodyParts: expandMacros(focusedBodyParts),
          includedBodyParts: expandMacros(includedBodyParts),
          focusedBodyPartsLeft: expandMacros(focusedBodyPartsLeft),
          focusedBodyPartsRight: expandMacros(focusedBodyPartsRight),
          includedBodyPartsLeft: expandMacros(includedBodyPartsLeft),
          includedBodyPartsRight: expandMacros(includedBodyPartsRight),
        };
        this.examTypes.push(examType);
        if (row[LOCAL_ID_COLUMN]) {
          const localId = rowStrings[LOCAL_ID_COLUMN].toString().trim();
          this.localMappings.push({ loincId, localId });
        }
      });
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const loader = new ExamTypeExcelLoader('data/Exam Types.xlsx');
  loader.printExamTypes();
}
