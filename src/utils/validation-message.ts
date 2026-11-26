const VALUE_MISSING_MESSAGE = 'Please fill out this field.';

interface ValidationState {
  required: boolean;
  empty: boolean;
  invalid?: boolean;
  errorMessage?: string;
}

interface ValidationResult {
  flags: ValidityStateFlags;
  message?: string;
}

/**
 * Turns a form control's state into the flags and message passed to
 * `ElementInternals.setValidity()`, so the six controls that mirror their
 * props into constraint validation cannot drift apart.
 *
 * A custom error wins over `valueMissing` for the message, matching the native
 * rule order, while both flags are reported when both apply.
 */
export function resolveValidity({ required, empty, invalid, errorMessage }: ValidationState): ValidationResult {
  const flags: ValidityStateFlags = {};
  if (required && empty) {
    flags.valueMissing = true;
  }
  if (invalid && errorMessage) {
    flags.customError = true;
  }
  return { flags, message: errorMessage || (flags.valueMissing ? VALUE_MISSING_MESSAGE : undefined) };
}
