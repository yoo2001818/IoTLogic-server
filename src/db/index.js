import Sequelize from 'sequelize';
import sequelize from './init.js';
import * as validations from '../validation/schema.js';
import inject from '../validation/sequelize.js';

export { sequelize };

export const User = sequelize.define('user', inject({
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
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

export const Device = sequelize.define('device', inject({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  alias: Sequelize.STRING,
  // We don't know what's gonna be in there
  type: Sequelize.STRING,
  data: Sequelize.TEXT,
  token: Sequelize.STRING
}, validations.Device), {
  indexes: [{
    unique: true,
    fields: ['name', 'userId']
  }]
});

export const Document = sequelize.define('document', inject({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: Sequelize.ENUM('start', 'stop'),
  payload: Sequelize.TEXT,
  payloadTemp: Sequelize.TEXT,
  visibility: Sequelize.ENUM('private', 'public')
}, validations.Document));

User.hasMany(Device);
User.hasMany(Document);

Device.belongsTo(User);
Document.belongsTo(User);

Document.belongsToMany(Device, {through: 'DeviceDocument'});
Device.belongsToMany(Document, {through: 'DeviceDocument'});

sequelize.sync();
