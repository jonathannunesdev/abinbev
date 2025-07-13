/* eslint-disable */
require('dotenv').config({
  path: '.env',
});

export const apps = [{
  name: 'backend',
  script: 'dist/main.js',
  env: {
    NODE_ENV: process.env.NODE_ENV ?? 'PROD',
  },
}];
