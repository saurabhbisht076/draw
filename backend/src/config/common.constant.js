const DEFAULT_ROOM_SETTINGS = {
    maxPlayers: 6,
    roundTime: 90,
    rounds :3
};

const ROOM_STATE = {
    LOBBY:'lobby',
    IN_GAME:'in-game',
    FINISHED: 'finished'
};

const PLAYER_ROLE = {
    HOST: 'host',
    PLAYER: 'player'
};

const ROOM_CODE_LENGTH = 6;

const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const VARIABLE = {
  STATUS: 'status',
  MESSAGE: 'message',
  SUCCESS: 'success',
  CODE: 'code',
  FAIL: 'fail',
  DATA: 'data',
  ERROR: 'error'
};

// Common response messages
const MESSAGES = {
  SUCCESS: 'Success',
  ERROR: 'Error',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation error'
  
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  build({ total, page, limit }) {
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      current_page: page,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1)  // <-- FIX
    };
  }
};

// Time constants in milliseconds
const TIME = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000
};

const MAIL_CONFIG = {
  HOST: 'smtp.gmail.com',
  PORT: 465,
  SECURE: true, // true for 465, false for other ports
  AUTH: {
    USER: 'whizzactsolution@gmail.com',
    PASS: 'bpvgfrvcirpvqyak',
  }
};
module.exports = {
DEFAULT_ROOM_SETTINGS,
ROOM_CODE_LENGTH,
ROOM_STATE,
PLAYER_ROLE,
STATUS_CODES,
MESSAGES,
PAGINATION,
TIME,
VARIABLE,
MAIL_CONFIG
}