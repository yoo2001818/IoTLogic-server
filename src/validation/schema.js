export const User = {
  username: {
    is: {
      key: 'AUTH_USERNAME_POLICY',
      value: /^[a-zA-Z0-9]+$/
    },
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 32]
    },
    notIn: {
      key: 'FIELD_RESERVED',
      value: ['login', 'signup', 'search', 'settings', 'new', 'admin', 'root',
        'help', 'about', 'contact', 'administrator', 'starred', 'notification',
        'form']
    },
    notEmpty: {
      key: 'FIELD_REQUIRED',
      value: true
    }
  },
  name: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 32]
    }
  },
  email: {
    isEmail: {
      key: 'FIELD_EMAIL_REQUIRED',
      value: true
    },
    notEmpty: {
      key: 'FIELD_REQUIRED',
      value: true
    }
  }
};

export const Password = {
  password: {
    is: {
      key: 'AUTH_PASSWORD_POLICY',
      // It's numbers and non-numbers. :P
      value: /^(?=.*[^0-9])(?=.*[0-9]).*$/
    },
    len: {
      key: 'AUTH_PASSWORD_SHORT',
      value: [6]
    },
    notEmpty: {
      key: 'FIELD_REQUIRED',
      value: true
    }
  }
};

export const Device = {
  name: {
    is: {
      key: 'DEVICE_NAME_POLICY',
      // It's okay as long as it is a valid Scheme symbol
      value: /([^\s#()[\]'`0-9;"'.,]|\\x[0-9a-fA-F]+)([^\s#()[\]'`;"'])*$/
    },
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 32]
    },
    notEmpty: {
      key: 'FIELD_REQUIRED',
      value: true
    }
  },
  alias: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 48]
    }
  }
};

export const Document = {
  name: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 48]
    },
    notEmpty: {
      key: 'FIELD_REQUIRED',
      value: true
    }
  }
};
