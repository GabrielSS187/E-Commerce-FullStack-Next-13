import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("order_shopper", (table) => {
    table.string("id_order", 255).primary();
    table.integer("id_owner_order").notNullable();
    table.integer("id_product_order").notNullable();
    table.dateTime("created_at", { useTz: false })
    .defaultTo(knex.fn.now(0)).notNullable();
    table.foreign("id_owner_order")
    .references("user_shopper.id_user")
    .onDelete("CASCADE");
    table.foreign("id_product_order")
    .references("product_shopper.id_product");
  });
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("order_shopper");
};

