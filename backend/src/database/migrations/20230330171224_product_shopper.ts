import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("product_shopper", (table) => {
    table.increments("id_product").primary();
    table.string("image_url").notNullable();
    table.string("name", 255).notNullable().unique();
    table.float("value").notNullable();
  })
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("product_shopper")
};

