import { useEffect, useState } from "react";
import { FormInputs, FormControl, InputStates } from "../models/form.model";

export const useForm = (formInputs: FormInputs) => {

    const inputStates: InputStates = {};
    const [valid, setValid] = useState<boolean>(false);
    
    Object.keys(formInputs).forEach(inputName => {
        const input = formInputs[inputName];
        const [value, setValue] = useState<any>(input.value);
        const [errors, setErrors] = useState<string[]>([]);
        inputStates[inputName] = { value, setValue, errors, setErrors };
    });
    
    useEffect(() => {
        Object.keys(formInputs).forEach(inputName => {
            const errors = validateInput(inputName, formInputs[inputName].value)
            inputStates[inputName].setErrors(errors);
        });
    }, []);

    useEffect(() => {
        const formHasErrors = !!Object.keys(inputStates).find(inputName => !!inputStates[inputName].errors.length) 
        setValid(!formHasErrors)
    }, Object.keys(inputStates).map(inputName => inputStates[inputName].errors));

    useEffect(() => {
        Object.keys(formInputs).forEach(inputName => {
            const dependentInputNames = formInputs[inputName].dependentInputValidations;
            if (!dependentInputNames?.length) return;
            validateDependentInputs(inputName);
        });
    }, Object.keys(inputStates).map(inputName => inputStates[inputName].value));

    const setInputValue = (inputName: string, value: any) => {
        const input = inputStates[inputName]
        if (!input) console.error(`setInputValue: input ${inputName} does not exist`);
        input.setValue(value);
        const errors = validateInput(inputName, value);
        input.setErrors(errors);
        return errors;
    };
    
    const validateInput = (inputName:string, value: any): string[] => {
        const validator = formInputs[inputName].validator;
        if(!validator) return [];
        const validators = Array.isArray(validator)
            ? validator
            : [ validator ];
        const validationErrors: string[] = [];
        validators.forEach(v => {
            if(!v.validate(value, getFormValue())) validationErrors.push(v.errorMessage);
        });
        return validationErrors;
    };
    
    const validateDependentInputs = (inputName: string) => {
        const dependentInputNames = formInputs[inputName].dependentInputValidations;
        if (!dependentInputNames?.length) return;
        dependentInputNames.forEach(inputName => {
            const input = inputStates[inputName];
            if (!input) return;
            const errors = validateInput(inputName, input.value)
            input.setErrors(errors);
        });
    }

    const getFormValue = () => {
        const formValue: {[inputName: string]: any} = {};
        Object.keys(inputStates).forEach(inputName => {
            formValue[inputName] = inputStates[inputName].value;
        });
        return formValue;
    };

    const getFormErrors = () => {
        const formErrors: {[inputName: string]: any} = {};
        Object.keys(inputStates).forEach(inputName => {
            formErrors[inputName] = inputStates[inputName].errors;
        });
        return formErrors;
    };

    const getInputValid = (inputName: string): boolean => {
        const input = inputStates[inputName];
        if (!input) console.error(`getInputValid: intput ${inputName} does not exist`);
        
        return !input.errors.length
        
    }
    
    const form: FormControl = {
        value: getFormValue(),
        valid,
        errors: getFormErrors(),
        set: setInputValue,
        inputValid: getInputValid
    };
    return form;
}
