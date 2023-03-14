import * as dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT,
    jwtSecret: process.env.JWT_SECRET,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}


export { config };