
import { ZodSchema, ZodError } from "zod";

export function validate<T>(schema: ZodSchema<T>, data: unknown): T | null {
  try {
    const result = schema.parse(data);
    console.log("✅ Validation successful:", result);
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("❌ Validation failed:");
      error.errors.forEach((err) => {
        console.error(
          `Path: ${err.path.join('.')} - Issue: ${err.message}`
        );
      });
    } else {
      console.error("❌ Unknown error during validation:", error);
    }
    return null;
  }
}
