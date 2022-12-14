export enum ErrorCode {
  UNKNOWN = 1,
  EMAIL_SENDING_ERROR,
  DATABASE_SEARCH_ERROR,
  EMAIL_ALREADY_EXISTS,
  USERNAME_ALREADY_EXISTS,
  USERNAME_OR_EMAIL_DOES_NOT_EXIST,
  USER_NOT_FOUND,
  INCORRECT_PASSWORD,
  INVALID_ERROR_CONFIRMATION_CODE,
  SESSION_NOT_FOUND,
  NO_ACCESS_TOKEN_PROVIDED,
  INVALID_ACCESS_TOKEN,
  // CANNOT_OPEN_FILE,
  // FILE_TOO_LARGE,
}
