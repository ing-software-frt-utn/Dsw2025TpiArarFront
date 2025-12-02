import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RegexMap, Valid, Validator } from "../helpers/passwordValidation";

const useValidation = (): [
  Valid[],
  (field: string, validation: RegexMap) => void,
] => {
  const [validationResults, setValidationResults] = useState<Valid[]>();

  const { t } = useTranslation();
  const validatePassword = (field: string, validations: RegexMap) => {
    const validator = new Validator(validations);
    let valids = validator.validation(field);
    valids = valids.map((valid) => {
      const translated = t(valid.message) ? t(valid.message) : valid.message;
      return { message: translated, isValid: valid.isValid };
    });
    setValidationResults(valids);
  };
  const valid = validationResults ?? [];
  return [valid, validatePassword];
};
export { useValidation };
