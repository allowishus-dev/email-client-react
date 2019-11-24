exports.up = function(knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id');
            table.string('username', 190).unique();
            table.string('firstname');
            table.string('lastname');
            table.string('password');
            table.string('email', 190).unique();
            table.boolean('active');
            table.string('key');
            table.timestamp('key_created_at').defaultTo(knex.fn.now());
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('emails', (table) => {
            table.increments('id');
            table.integer('user_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.string('to_address');
            table.string('content');
            table.timestamp('sent_at').defaultTo(knex.fn.now());
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('emails')
        .dropTableIfExists('users');
};
