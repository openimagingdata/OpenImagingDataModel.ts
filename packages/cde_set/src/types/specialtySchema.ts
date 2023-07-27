import { z } from 'zod';

/*
"Specialty": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "name": {
                    "type": "string"
                },
                "abbreviation": {
                    "type": "string",
                    "enum": ["BR", "BQ", "CA", "CH", "ER", "GI", "GU", "HN", "IR", "MI", "MK", "NR", "OB", "OI", "OT", "PD", "QI", "RS", "VA", "CT", "MR", "NM", "US", "AI", "ED", "HP", "IN", "LM", "PH", "PR", "RO", "SQ"]
                }
            },
            "required": ["name", "abbreviation"],
            "title": "Specialty"
        }
*/

export const specialty = z.object({
    name: z.string(),
    abbreviation: z.enum(["BR","BQ","CA","CH","ER","GI",
    "GU","HN","IR","MI","MK","NR","OB","OI","OT","PD",
    "QI","RS","VA","CT","MR","NM","US","AI","ED","HP",
    "IN","LM","PH","PR","RO","SQ"])
})

    