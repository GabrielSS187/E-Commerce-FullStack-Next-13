import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_shopper", (table) => {
    table.increments("id_user").primary();
    table.string("user_name", 100).notNullable();
    table.string("user_email", 255).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.dateTime("created_at", { useTz: false }).defaultTo(knex.fn.now(0));
    table.dateTime("updated_at", { useTz: false }).defaultTo(knex.fn.now(0));
  })
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_shopper")
};