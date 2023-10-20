export const SERVER_TYPE = process.env.SERVER_TYPE;
export const HASH_COIN = Number(process.env.HASH_COIN) || 7;
export const SERVICE_NAME = process.env.SERVICE_NAME || 'dstu-autumn-hack-2023';
export const SERVER_HOST = process.env.SERVER_HOST || '127.0.0.1';
export const SERVER_PORT = process.env.SERVER_PORT || '5100';
export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'COOKIE_OC_SECRET';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'JWT_REFRESH';
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'JWT_ACCESS';

export const SWIZE_AWS_BUCKET = process.env.SWIZE_AWS_BUCKET || 'inst-graphql-api';
export const SWIZE_AWS_ACCESS_KEY = process.env.SWIZE_AWS_ACCESS_KEY || 'AKIAUGSVZHSW2NPFJ3VS';
export const SWIZE_AWS_SECRET_KEY = process.env.SWIZE_AWS_SECRET_KEY || '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';
export const SWIZE_AWS_REGION = process.env.SWIZE_AWS_REGION || 'eu-west-2';
export const SWIZE_SIGNED_URL_EXPIRES = process.env.SWIZE_SIGNED_URL_EXPIRES || '3600';
