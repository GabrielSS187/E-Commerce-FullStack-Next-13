import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("cart_shopper", (table) => {
    table.integer("owner_id").primary().notNullable();
    table.integer("id_product_cart").notNullable();
    table.integer("quantity_product").notNullable();
    table.float("total_product_price").notNullable();
    table.foreign("owner_id")
    .references("user_shopper.id_user")
    .onDelete("CASCADE");
    table.foreign("id_product_cart")
    .references("product_shopper.id_product")
    .onDelete("CASCADE")
    .onUpdate("CASCADE");
  })
};


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("cart_shopper");
};

