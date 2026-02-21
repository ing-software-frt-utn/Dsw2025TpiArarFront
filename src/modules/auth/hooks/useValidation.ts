import { useState } from "react";
import { RegexMap, validGeneric } from "../helpers/passwordValidation";

export interface Valid {
  message: string;
  isValid: boolean;
}

const useValidation = (): [
  Valid[],
  (text: string, validations: [RegexMap, string][]) => void,
] => {
  const [validationResults, setValidationResults] = useState<Valid[]>([]);

  const validatePassword = (text: string, validations: [RegexMap, string][]) => {
    const validsTuple = validGeneric(text, validations);
    
    const valids = validsTuple.map(([message, isValid]) => ({
      message,
      isValid,
    }));
    
    setValidationResults(valids);
  };

  return [validationResults, validatePassword];
};

export { useValidation };
