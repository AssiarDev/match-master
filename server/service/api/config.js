import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"});

export const urlAPI = process.env.URL_API;
export const token = process.env.API_TOKEN;

export const requestOption = {
    method: "GET",
    headers: {
        "X-Auth-Token": token,
        "Content-Type": "application/json"
    }
};