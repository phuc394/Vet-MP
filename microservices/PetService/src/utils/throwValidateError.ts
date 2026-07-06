import {ValidationError} from "../errors/validation.error";

const throwIfvalidateError = ( error : string | null) : void =>{
    if(error){
        throw new ValidationError(error);
    }
}

export { throwIfvalidateError }