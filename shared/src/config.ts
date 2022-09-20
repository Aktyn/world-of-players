const SERVER_PORT = 5348 as const

export const Config = {
  SERVER_PORT,

  MAX_USER_NAME_LENGTH: 24,

  /** 7 days before access token expires */
  LOGIN_SESSION_LIFETIME: 604800000,

  /** Value in bytes */
  MAXIMUM_IMAGE_FILE_SIZE: 2097152, // 2MB

  TABLE: {
    DEFAULT_PAGE_SIZE: 20,
  },
} as const
