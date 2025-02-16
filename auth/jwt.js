import jsonwebtoken from "jsonwebtoken"
import { configDotenv } from "dotenv"

configDotenv()
const SECRETKEY = process.env.SECRETKEY
const options = {
    expiresIn: "60m"
}

export const tokenBlacklist = new Set();


export const isTokenBlacklisted = (token) => {
    console.log(tokenBlacklist)
    return tokenBlacklist.has(token);
};


export const getToken = (payload) => {
    try {
        const token = jsonwebtoken.sign(payload, SECRETKEY, options);
        return token
    } catch (err) {
        throw err
    }
}

export const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken.verify(token, SECRETKEY);
        return decoded;
    } catch (err) {
        throw err
    }
}

