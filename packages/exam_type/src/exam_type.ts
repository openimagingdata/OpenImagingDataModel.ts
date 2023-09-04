import { z } from 'zod';

const contrastEnum = z.enum(['W', 'WO', 'WWO']);
const modalityEnum = z.enum(['CT', 'MR', 'US', 'NM', 'XR', 'MG', 'PT+CT']);
type ContrastType = z.infer<typeof contrastEnum>;
type ModalityType = z.infer<typeof modalityEnum>;

export const examTypeSchema = z.object({
  loincId: z.string(),
  commonName: z.string(),
  playbookId: z.string().optional(),
  modality: modalityEnum,
  lateral: z.boolean(),
  contrast: contrastEnum.optional(),
  focusedBodyParts: z.array(z.string()),
  includedBodyParts: z.array(z.string()),
  focusedBodyPartsLeft: z.array(z.string()).optional(),
  focusedBodyPartsRight: z.array(z.string()).optional(),
  includedBodyPartsLeft: z.array(z.string()).optional(),
  includedBodyPartsRight: z.array(z.string()).optional(),
});

export type ExamTypeData = z.infer<typeof examTypeSchema>;

export default class ExamType {
  static VERSION = '0.0.1';

  private _data: ExamTypeData;

  public constructor(data: ExamTypeData | object | string) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
      if (typeof data !== 'object') {
        throw new Error('Invalid ExamTypeData');
      }
    }

    const parsed = examTypeSchema.safeParse(data);
    if (parsed.success === false) {
      throw new Error('Invalid ExamTypeData');
    }

    this._data = parsed.data;
  }

  public get loincId(): string {
    return this._data.loincId;
  }

  public get commonName(): string {
    return this._data.commonName;
  }

  public get playbookId(): string | undefined {
    return this._data.playbookId;
  }

  public get modality(): ModalityType {
    return this._data.modality;
  }

  public get lateral(): boolean {
    return this._data.lateral;
  }

  public get contrast(): ContrastType | undefined {
    return this._data.contrast;
  }

  public get focusedBodyParts(): string[] {
    return this._data.focusedBodyParts;
  }

  public get includedBodyParts(): string[] {
    return this._data.includedBodyParts;
  }

  public get focusedBodyPartsLeft(): string[] | undefined {
    return this._data.focusedBodyPartsLeft;
  }

  public get focusedBodyPartsRight(): string[] | undefined {
    return this._data.focusedBodyPartsRight;
  }

  public get includedBodyPartsLeft(): string[] | undefined {
    return this._data.includedBodyPartsLeft;
  }

  public get includedBodyPartsRight(): string[] | undefined {
    return this._data.includedBodyPartsRight;
  }
}
