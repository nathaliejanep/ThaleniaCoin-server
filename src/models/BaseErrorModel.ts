// https://medium.com/@xiaominghu19922/proper-error-handling-in-express-server-with-typescript-8cd4ffb67188
// https://dev.to/valentinkuharic/beginner-friendy-guide-to-error-handling-in-typescript-nodejs-expressjs-api-design-432i

// type BaseErrorData = {
//   message: string;
//   context?: { [key: string]: any };
//   stack?: string;
// };

// class BaseError extends Error {
//   statusCode: number;
//   //  isOperational: boolean;
//   //   abstract readonly errors: BaseErrorData[];
//   //   abstract readonly logging: boolean; /* indicating if logging error */

//   constructor(statusCode: number, message: string) {
//     super(message); /* calls constructor of parent class */

//     // Extended builtin class - ensures corrrect inheritance and prototype chain
//     Object.setPrototypeOf(this, new.target.prototype);
//     this.name = Error.name;
//     this.statusCode = statusCode;
//     // this.isOperational = this.isOperational;
//     // captures and assigns current call stack
//     Error.captureStackTrace(this);
//   }
// }
class BaseError extends Error {
  status: number;
  filePath?: string;

  constructor(message: string, status: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;

    Error.captureStackTrace(this);

    const stackLines = this.stack?.split('\n') || [];
    const callerLine = stackLines[1] || ''; // Typically the first line after the error message
    const match = callerLine.match(/\(([^)]+)\)/); // Extract the content within parentheses
    if (match && match[1]) {
      this.filePath = match[1];
    }
  }
}

class AuthenticationError extends BaseError {}

// 404 error class
class NotFoundError extends BaseError {
  propertyName: string;

  constructor(propertyName: string) {
    super(`Property '${propertyName}' not found.`, 404);

    this.propertyName = propertyName;
  }
}

// validation error class
class ValidationError extends BaseError {
  errorData: Record<string, string>[];
  constructor(data: Record<string, string>[]) {
    super('Validation Error', 400);
    this.errorData = data;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class SyntaxError extends BaseError {
  errorData: Record<string, string>[];
  constructor(data: Record<string, string>[]) {
    super('Syntax Error', 400);
    this.errorData = data;
    Object.setPrototypeOf(this, SyntaxError.prototype);
  }
}

export { BaseError, NotFoundError, ValidationError, SyntaxError };
// class NotFoundError extends BaseError {
//   constructor(message: string) {
//     super(404, message);
//     Object.setPrototypeOf(this, NotFoundError.prototype);
//   }
// }

// class NotFoundError extends BaseError {
//   propertyName: string;

//   constructor(propertyName: string) {
//     super(404, `Property '${propertyName}' not found.`);

//     this.propertyName = propertyName;
//   }
// }

// class ValidationError extends BaseError{
//     readonly statusCode: number=400;
//     readonly errors:BaseErrorData[]

//     constructor(message:string,errors:BaseErrorData[]){
//         super(message)
//         this.errors=errors
//         this.logging=true
//     }
// }
// https://mirzaleka.medium.com/build-a-global-exception-handler-using-express-js-typescript-b9bb2f521e5e
