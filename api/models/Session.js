const { Model } = require('objection');

class Session extends Model {
    static get tableName() {
        return 'sessions';
    }

    static get relationMappings() {
        const User = require('./User');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'sessions.user_id',
                    to: 'users.id'
                }
            }
        }
    };
}

module.exports = Session;