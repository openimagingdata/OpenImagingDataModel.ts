import { z } from "zod";
export declare const systemCodeSchema: z.ZodObject<{
    system: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    display: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    system: string;
    code?: string | undefined;
    display?: string | undefined;
}, {
    system: string;
    code?: string | undefined;
    display?: string | undefined;
}>;
export declare const codeableConceptValueSchema: z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    value: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[] | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[] | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>;
export declare const stringValueSchema: z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: string | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: string | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>;
export declare const integerValueSchema: z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>;
export declare const floatValueSchema: z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>;
export declare const componentSchema: z.ZodUnion<[z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    value: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[] | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[] | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>, z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: string | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: string | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>, z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>, z.ZodObject<{
    code: z.ZodArray<z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>, "many">;
    value: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}, {
    value: number | null;
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }[];
}>]>;
export declare const observationSchema: z.ZodObject<{
    resourceType: z.ZodLiteral<"Observation">;
    id: z.ZodOptional<z.ZodString>;
    code: z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>;
    bodySite: z.ZodOptional<z.ZodObject<{
        code: z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    }, {
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    }>>;
    component: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        code: z.ZodArray<z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>, "many">;
        value: z.ZodNullable<z.ZodArray<z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        value: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[] | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }, {
        value: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[] | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }>, z.ZodObject<{
        code: z.ZodArray<z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>, "many">;
        value: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        value: string | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }, {
        value: string | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }>, z.ZodObject<{
        code: z.ZodArray<z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>, "many">;
        value: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }, {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }>, z.ZodObject<{
        code: z.ZodArray<z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>, "many">;
        value: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }, {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    };
    resourceType: "Observation";
    component: ({
        value: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[] | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    } | {
        value: string | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    } | {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    } | {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    })[];
    id?: string | undefined;
    bodySite?: {
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    } | undefined;
}, {
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    };
    resourceType: "Observation";
    component: ({
        value: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[] | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    } | {
        value: string | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    } | {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    } | {
        value: number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }[];
    })[];
    id?: string | undefined;
    bodySite?: {
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    } | undefined;
}>;
declare const ObservationFunctionParams: z.ZodObject<{
    resourceType: z.ZodLiteral<"Observation">;
    id: z.ZodOptional<z.ZodString>;
    code: z.ZodObject<{
        system: z.ZodString;
        code: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }, {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    }>;
    bodySite: z.ZodOptional<z.ZodObject<{
        code: z.ZodOptional<z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        code?: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        } | undefined;
    }, {
        code?: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        } | undefined;
    }>>;
    component: z.ZodArray<z.ZodObject<{
        code: z.ZodObject<{
            system: z.ZodString;
            code: z.ZodOptional<z.ZodString>;
            display: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }, {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        }>;
        value: z.ZodNullable<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    }, {
        value: string | number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    };
    resourceType: "Observation";
    component: {
        value: string | number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    }[];
    id?: string | undefined;
    bodySite?: {
        code?: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        } | undefined;
    } | undefined;
}, {
    code: {
        system: string;
        code?: string | undefined;
        display?: string | undefined;
    };
    resourceType: "Observation";
    component: {
        value: string | number | null;
        code: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        };
    }[];
    id?: string | undefined;
    bodySite?: {
        code?: {
            system: string;
            code?: string | undefined;
            display?: string | undefined;
        } | undefined;
    } | undefined;
}>;
export type ObservationResult = z.infer<typeof ObservationFunctionParams>;
export {};
//# sourceMappingURL=observation.d.ts.map