import {Knex} from 'knex';

const ON_UPDATE_TIMESTAMP_FUNCTION = `
        CREATE OR REPLACE FUNCTION on_update_timestamp()
        RETURNS trigger AS $$
        BEGIN
            NEW.updated_at = now();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    `;

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `
        DROP FUNCTION on_update_timestamp
    `;

const onVisitTrigger = (tableName: string) => `
        CREATE TRIGGER ${tableName}_visted_at
        AFTER UPDATE OF visits
        ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE on_update_timestamp();
    `;

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('records', (table) => {
        table.increments('id', {primaryKey: true});
        table.string('hash').unique();
        table.string('url');
        table.integer('visits');
        table.timestamps(true, true); // adds created_at and updated_at timestamp columns

    });
    knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
    knex.raw(onVisitTrigger('records'));
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('records');
    knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
