
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_MAX_LENGTH = 100;

export const PASSWORD_ERROR_MSG =
  "Password must contain letters, numbers, and special characters.";

export const PASSWORD_LENGTH_MSG = "Password must be at least 8 characters.";
