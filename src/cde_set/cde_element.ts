import { z } from "zod";
import { versionSchema, contributorsSchema, eventSchema, specialtySchema } from './common.js';
import {
	deserialize,
	serializable,
	serialize,
	validateWith,
} from "typesafe-class-serializer";

//Want cdElement or cdeElement? 
export const cdeElementBaseSchema = z.object({
    id: z.string(),
    parent_id: z.number(),
    name: z.string(),
    short_name: z.string().optional(),
    editor: z.string().optional(),
    instructions: z.string().optional(),
    synonyms: z.string().optional(), // TODO: Looks like this is a string, should change to array of strings
    definition: z.string().optional(),
    question: z.string().optional(),
    version: versionSchema,
    index_codes: z.array(indexCodeSchema).optional(), //TODO: Add indexCodes to common? 
    contributors: contributorsSchema.optional(),
    history: z.array(eventSchema).optional(),
    specialty: z.array(specialtySchema).optional(),
    references: z.array(referenceSchema).optional(), //TODO: Add referencesSchema to common?
    source: z.string().optional(),
  });

  export type cdeElementBase = z.infer<typeof cdeElementBaseSchema>;

  class CdElement {
    public readonly SCHEMA = cdeElementBaseSchema;

    @serializable("id")
    accessor id: string;

    constructor (params: z.infer<typeof cdeElementBaseSchema>){
        this.id = params.id;
    }

  }

  
