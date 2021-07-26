import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('records', (table: Knex.TableBuilder) => {
        table.increments('id', { primaryKey: true });
        table.string('hash').unique();
        table.string('url');
        table.integer('visits').defaultTo(0);
        table.timestamps(true, true); // adds created_at and updated_at timestamp columns
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('records');
}
