import "dotenv/config";

export const envVariables = {
  PORT: process.env.PORT,
  SQL_USERNAME: process.env.SQL_USERNAME,
  SQL_PASSWORD: process.env.SQL_PASSWORD,
  SQL_DATABASE: process.env.SQL_DATABASE,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
};
