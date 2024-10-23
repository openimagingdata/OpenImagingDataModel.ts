import { type StatusOptions } from "./common.js";
import { CdeSet } from "./cde_set.js";
import { IntegerElement, FloatElement, BooleanElement, ValueSetElement } from "./cde_element.js";
import { FindingModel } from "../finding_model/finding_model.js";
export interface ValueArgs {
    name: string;
    value?: string;
}
export declare const createSet: (name: string, description?: string | null, addPresenceElement?: boolean) => CdeSet;
export declare const defaultElementMetadata: (name: string) => {
    id: string;
    name: string;
    definition: string;
    question: string;
    values: never[];
    parent_set: string;
    element_version: {
        number: number;
        date: string;
    };
    schema_version: string;
    status: {
        date: string;
        name: StatusOptions;
    };
};
export declare const createIntegerElement: (name: string, min?: number | null, max?: number | null, step?: number | null, unit?: string | null) => IntegerElement;
export declare const createFloatElement: (name: string, min?: number | null, max?: number | null, step?: number | null, unit?: string | null) => FloatElement;
export declare const createBooleanElement: (name: string) => BooleanElement;
export declare const createValueSetElement: (name: string, values: ValueArgs[], definition?: string | null, question?: string | null, min_cardinality?: number, max_cardinality?: number) => ValueSetElement;
export declare const createPresenceElement: (findingName?: string | null, definition?: string | null, question?: string | null) => ValueSetElement;
export declare const createSetFromFindingModel: (model: FindingModel) => CdeSet;
export declare const createElement: (inData: unknown) => ValueSetElement | IntegerElement | FloatElement | BooleanElement | null;
//# sourceMappingURL=factory.d.ts.map