import { z } from 'zod';
import { personSchema } from './person';

const organization  = z.object({
    name: z.string(),
    abbreviation: z.string().optional(),
    url: z.string().url().optional(),
    comment: z.string().optional(),
    role: z.enum(["author", "sponsor", "translator", "reviewer", "contributor"]).optional(),
 
})


export const authorSchema = z.object({
    person: z.array(personSchema), //person object or type?
    organization: z.array(organization),  
                                        
});


export type authorData = z.infer<typeof authorSchema>;
