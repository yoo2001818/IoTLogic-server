import Sequelize from 'sequelize';
import sequelize from './init.js';
import * as validations from '../validation/schema.js';
import inject from '../validation/sequelize.js';

export { sequelize };

export const User = sequelize.define('user', inject({
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, validations.User), {
  instanceMethods: {
    toJSON: function() {
      let obj = this.get({
        plain: true
      });
      delete obj.password;
      delete obj.updatedAt;
      // Get rid of sensitive information
      delete obj.email;
      return obj;
    }
  }
});

export const Session = sequelize.define('session', {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  expires: {
    type: Sequelize.DATE,
    allowNull: true
  },
  data: Sequelize.TEXT
});


sequelize.sync();
