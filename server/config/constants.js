export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '30d';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const POINTS = {
  WATCH_CONTENT: 5,
  SHARE_CONTENT: 3,
  SAVE_CONTENT: 1,
  REPORT_CONTENT: 2,
  DAILY_LOGIN: 2
};