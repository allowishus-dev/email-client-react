const { Model } = require('objection');

class Email extends Model {
    static get tableName() {
        return 'emails';
    }

    static get relationMappings() {
        const User = require('./User');
        return {
            sender: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'users.id',
                    to: 'emails.user_id'
                }
            }
        }
    };
}

module.exports = Email;