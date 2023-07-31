import { Dispatch } from "react";

export interface FormInputs { [inputName: string]: FormInput; };

interface FormInput {
    value?: any;
    validator?: InputValidator | InputValidator[];
    dependentInputValidations?: string[]
}

interface InputValidator {
    validate: (value: any, formValue: {[inputName: string]: any}) => boolean;
    errorMessage: string;
}

export interface FormControl {
    value: {[inputName:string]: any};
    valid: boolean;
    errors: {[inputName:string] : string[]};
    set: (inputName: string, value: any) => void;
    inputValid: (inputName: string) => boolean;
}

export interface InputStates {
    [inputName: string]: {
        value: any;
        setValue: Dispatch<any>;
        errors: string[];
        setErrors: Dispatch<string[]>;
    };
}
