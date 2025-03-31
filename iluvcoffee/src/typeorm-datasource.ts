import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: 'pass123',
    database: "postgres",
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/migrations/*.js"],  // 또는 "dist/src/migrations/*.js"
    migrationsTableName: "migrations_typeorm",
    synchronize: false,
});

export default AppDataSource;