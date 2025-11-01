import { z } from "zod";

/**
 * Validation schemas för admin-formulär
 * Implementerar input-validering enligt säkerhetsbest practices
 */

// ============================================================
// RIKSDAGEN DATA FETCH SCHEMAS
// ============================================================

export const riksdagenFetchSchema = z.object({
  dataType: z.enum(['anforanden', 'voteringar', 'dokument', 'ledamoter'], {
    errorMap: () => ({ message: "Ogiltig datatyp vald" })
  }),
  rm: z.string()
    .regex(/^\d{4}\/\d{2}$/, "Riksmöte måste vara format YYYY/YY (t.ex. 2024/25)")
    .optional()
    .or(z.literal('')),
  parti: z.enum(['S', 'M', 'SD', 'C', 'V', 'KD', 'L', 'MP', ''], {
    errorMap: () => ({ message: "Ogiltigt parti valt" })
  }).optional(),
  iid: z.string()
    .max(20, "Ledamots-ID får max vara 20 tecken")
    .regex(/^[0-9]*$/, "Ledamots-ID får endast innehålla siffror")
    .optional()
    .or(z.literal('')),
  from: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum måste vara format YYYY-MM-DD")
    .optional()
    .or(z.literal('')),
  tom: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum måste vara format YYYY-MM-DD")
    .optional()
    .or(z.literal('')),
  sz: z.string()
    .refine((val) => {
      const num = parseInt(val);
      return num >= 1 && num <= 500;
    }, "Antal resultat måste vara mellan 1 och 500")
    .optional(),
  doktyp: z.string().max(10, "Dokumenttyp får max vara 10 tecken").optional(),
}).refine((data) => {
  // Validera att "från"-datum inte är efter "till"-datum
  if (data.from && data.tom && data.from !== '' && data.tom !== '') {
    return new Date(data.from) <= new Date(data.tom);
  }
  return true;
}, {
  message: "Från-datum kan inte vara senare än till-datum",
  path: ["from"]
});

export type RiksdagenFetchInput = z.infer<typeof riksdagenFetchSchema>;

// ============================================================
// BATCH OPERATIONS SCHEMAS
// ============================================================

export const batchOperationSchema = z.object({
  selectedTable: z.string().min(1, "Du måste välja en tabell"),
  selectedOperation: z.enum([
    'fetch_missing_attachments',
    'cleanup_old_files'
  ], {
    errorMap: () => ({ message: "Ogiltig operation vald" })
  }),
});

export type BatchOperationInput = z.infer<typeof batchOperationSchema>;

// ============================================================
// REGERINGSKANSLIET DATA FETCH SCHEMAS
// ============================================================

const regeringskanslientDocumentTypes = [
  'propositioner',
  'pressmeddelanden',
  'sou',
  'departementsserien',
  'kommittedirektiv',
  'lagradsremiss',
  'remisser',
  'skrivelse',
  'tal',
  'artiklar',
  'debattartiklar',
  'faktapromemoria',
  'rapporter',
  'regeringsarenden',
  'regeringsuppdrag',
  'sakrad',
  'internationella_overenskommelser',
  'overenskommelser_avtal',
  'mr_granskningar',
  'bistands_strategier',
  'forordningsmotiv',
  'informationsmaterial',
  'dagordningar',
  'arendeforteckningar',
  'ud_avrader'
] as const;

export const regeringskanslientFetchSchema = z.object({
  dataType: z.enum(regeringskanslientDocumentTypes, {
    errorMap: () => ({ message: "Ogiltig dokumenttyp vald" })
  }),
  from: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum måste vara format YYYY-MM-DD")
    .optional()
    .or(z.literal('')),
  tom: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum måste vara format YYYY-MM-DD")
    .optional()
    .or(z.literal('')),
  maxPages: z.number()
    .int("Antal sidor måste vara ett heltal")
    .min(1, "Minst 1 sida")
    .max(100, "Max 100 sidor per körning")
    .optional(),
}).refine((data) => {
  // Validera datumintervall
  if (data.from && data.tom && data.from !== '' && data.tom !== '') {
    return new Date(data.from) <= new Date(data.tom);
  }
  return true;
}, {
  message: "Från-datum kan inte vara senare än till-datum",
  path: ["from"]
});

export type RegeringskanslientFetchInput = z.infer<typeof regeringskanslientFetchSchema>;

// ============================================================
// FILE QUEUE SCHEMAS
// ============================================================

export const fileQueueFilterSchema = z.object({
  status: z.enum(['all', 'pending', 'processing', 'completed', 'failed'], {
    errorMap: () => ({ message: "Ogiltig status vald" })
  }),
  bucket: z.enum(['all', 'riksdagen-images', 'regeringskansliet-files'], {
    errorMap: () => ({ message: "Ogiltig bucket vald" })
  }),
});

export type FileQueueFilterInput = z.infer<typeof fileQueueFilterSchema>;

// ============================================================
// STORAGE CLEANUP SCHEMAS
// ============================================================

export const storageCleanupSchema = z.object({
  bucket: z.enum(['riksdagen-images', 'regeringskansliet-files'], {
    errorMap: () => ({ message: "Du måste välja en bucket" })
  }),
  olderThanDays: z.number()
    .int("Antal dagar måste vara ett heltal")
    .min(30, "Minst 30 dagar för säkerhet")
    .max(3650, "Max 10 år (3650 dagar)"),
  dryRun: z.boolean().default(true),
});

export type StorageCleanupInput = z.infer<typeof storageCleanupSchema>;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Validation result type with proper discriminated union
 * This ensures TypeScript can correctly narrow types
 */
export type ValidationResult<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Validerar input och returnerar typade data eller error
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `${firstError.path.join('.')}: ${firstError.message}` 
      };
    }
    return { success: false, error: "Valideringsfel" };
  }
}

/**
 * Returnerar alla valideringsfel som en array
 */
export function getAllValidationErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): string[] {
  try {
    schema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
    }
    return ["Okänt valideringsfel"];
  }
}
