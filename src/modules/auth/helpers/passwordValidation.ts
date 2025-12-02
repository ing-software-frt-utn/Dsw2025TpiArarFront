
export interface RegexMap {
    [key: string]: RegExp;
}

function validGeneric(text: string, map : [RegexMap, string][]): [string, boolean][]{
    let result: [string,boolean][] = [];
    for (const [regexMap, errorMessage] of map) {
        for (const key in regexMap) {
            const regex = regexMap[key];
            result = [...result, [errorMessage, !regex.test(text)]];
        }
    }
    return result;
}
function validPassword(text: string): [string,boolean][] {
    const regexMap: [RegexMap, string][] = [
        [{ '.*[a-z].*': /^(?=.*[a-z]).*$/ }, "Debe contener al menos una letra minúscula."],
        [{ '.*[A-Z].*': /^(?=.*[A-Z]).*$/ }, "Debe contener al menos una letra mayúscula."],
        [{ '.*\d.*': /^(?=.*\d).*$/ }, "Debe contener al menos un número."],
        [{ '.*[!@#$%^&*].*': /^(?=.*[!@#$%^&*]).*$/ }, "Debe contener al menos un símbolo (!@#$%^&*)."],
        [{ '.{8,}': /^.{8,}$/ }, "Debe tener al menos 8 caracteres de longitud."],
        [{ '.*\s.*': /^(?!.*\s).*$/ }, "No debe contener espacios."]
    ];
    return validGeneric(text, regexMap);
}

export { validPassword };
export { validGeneric };