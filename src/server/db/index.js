import Sequelize from 'sequelize';
import sequelize from './init';
import * as validations from '../../validation/schema';
import inject from '../../validation/sequelize';

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
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: Sequelize.TEXT,
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
}, validations.Device), {
  indexes: [{
    unique: true,
    fields: ['name', 'userId']
  }],
  instanceMethods: {
    toJSON: function() {
      let obj = this.get({
        plain: true
      });
      delete obj.token;
      return obj;
    }
  }
});

export const Document = sequelize.define('document', inject({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.ENUM('start', 'stop'),
    defaultValue: 'start'
  },
  payload: Sequelize.TEXT,
  payloadTemp: Sequelize.TEXT,
  visibility: {
    type: Sequelize.ENUM('private', 'public'),
    defaultValue: 'private'
  }
}, validations.Document), {
  instanceMethods: {
    toJSON: function() {
      let obj = this.get({
        plain: true
      });
      delete obj.payload;
      delete obj.payloadTemp;
      return obj;
    }
  }
});

export const DeviceDocumentLink = sequelize.define('deviceDocumentLink', {
  position: Sequelize.INTEGER
});

User.hasMany(Device);
User.hasMany(Document);

Device.belongsTo(User);
Document.belongsTo(User);

Document.belongsToMany(Device, {through: 'deviceDocumentLink'});
Device.belongsToMany(Document, {through: 'deviceDocumentLink'});

sequelize.sync();
