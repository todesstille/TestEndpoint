import { Result, ValidationError } from 'express-validator';

export const processErrors = (errors: Result<ValidationError>) => {
    return {
        errorsMessages: errors.array({onlyFirstError: true}).map((err: any) => {
            return {
                message: "error!",
                field: err.path
            }
        })
    }
}
