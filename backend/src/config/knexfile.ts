import { env } from "process";

const configKnex: Record<string, any> = {
  development: {
    client: "pg",
    connection: env.DATABASE_URL_LOCAL,
    useNullAsDefault: true,
    searchPath: ["knex", "public"],
    migrations: {
      tableName: "knex_migrations_shopper",
      extension: "ts",
    },
    seeds: {
      tableName: "knex_seeds_shopper",
      extension: "ts",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: "pg",
    connection: env.DATABASE_URL,
    useNullAsDefault: true,
    searchPath: ["knex", "public"],
    migrations: {
      tableName: "knex_migrations_ec",
      extension: "ts",
    },
    seeds: {
      tableName: "knex_seeds-ec",
      extension: "ts",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default configKnex;