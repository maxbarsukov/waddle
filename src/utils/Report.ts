import ErrorMessage from '../interfaces/ErrorMessage';

export default class Report {
  static error(error: ErrorMessage): string {
    if (!error.pos.line || !error.pos.column) {
      return error.message;
    }
    return `${error.pos.line + 1}:${error.pos.column + 1}: ${error.message}`;
  }
}
