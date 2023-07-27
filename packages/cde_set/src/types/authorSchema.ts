import { z } from 'zod';
import { personSchema } from './person';

/**
 * organization obj used within authorSchema 
 */
const organization  = z.object({
    name: z.string(),
    abbreviation: z.string().optional(),
    url: z.string().url().optional(),
    comment: z.string().optional(),
    role: z.enum(["author", "sponsor", "translator", "reviewer", "contributor"]).optional(),
 
})


export const authorSchema = z.object({
    person: z.array(personSchema), //is person.ts completed and do we want this as type string or type person.
    organization: z.array(organization),  
                                        
});


/*
"Organization": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "name": {
                    "type": "string"
                },
                "abbreviation": {
                    "type": "string"
                },
                "url": {
                    "type": "string",
                    "format": "uri"
                },
                "comment": {
                    "type": "string"
                },
                "role": {
                    "type": "string",
                    "enum": ["author", "sponsor", "translator", "reviewer", "contributor"]
                }
            },
            "required": ["name"],
            "title": "Organization"
        }


*/

/*

//from rdes1.json
"authors": {
        "person": [],
        "organization": []
      },

*/
