const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        const Email = require('./Email');
        return {
            emails: {
                relation: Model.HasManyRelation,
                modelClass: Email,
                join: {
                    from: 'emails.user_id',
                    to: 'users.id'
                }
            }
        }
    };
}

module.exports = User;