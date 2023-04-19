import { cleanEnv, str, port } from "envalid";

function validateEnv() {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ["development", "production"],
        }),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port({ default: 3000}),
    });
}

export default validateEnv;