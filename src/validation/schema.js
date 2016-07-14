export const User = {
  username: {
    is: {
      key: 'ErrorValidationUsernamePolicy',
      value: /^[a-zA-Z0-9]+$/
    },
    len: {
      key: 'ErrorValidationMaxLength',
      value: [1, 32]
    },
    notIn: {
      key: 'ErrorValidationUsernameReserved',
      value: ['login', 'signup', 'search', 'settings', 'new', 'admin', 'root',
        'help', 'about', 'contact', 'administrator', 'starred', 'notification',
        'form']
    },
    notEmpty: {
      key: 'ErrorValidationRequired',
      value: true
    }
  },
  name: {
    len: {
      key: 'ErrorValidationMaxLength',
      value: [0, 32]
    }
  },
  email: {
    isEmail: {
      key: 'ErrorValidationEmail',
      value: true
    },
    notEmpty: {
      key: 'ErrorValidationRequired',
      value: true
    }
  }
};

export const Password = {
  is: {
    key: 'ErrorValidationPasswordPolicy',
    // It's numbers and non-numbers. :P
    value: /^(?=.*[^0-9])(?=.*[0-9]).*$/
  },
  len: {
    key: 'ErrorValidationMinLength',
    value: [6]
  },
  notEmpty: {
    key: 'ErrorValidationRequired',
    value: true
  }
};

export const Device = {
  name: {
    is: {
      key: 'ErrorValidationDevicePolicy',
      // It's okay as long as it is a valid Scheme symbol
      value: /([^\s#()[\]'`0-9;"'.,]|\\x[0-9a-fA-F]+)([^\s#()[\]'`;"'])*$/
    },
    len: {
      key: 'ErrorValidationMaxLength',
      value: [1, 32]
    },
    notEmpty: {
      key: 'ErrorValidationRequired',
      value: true
    }
  },
  alias: {
    len: {
      key: 'ErrorValidationMaxLength',
      value: [0, 48]
    }
  }
};

export const Document = {
  name: {
    len: {
      key: 'ErrorValidationMaxLength',
      value: [1, 48]
    },
    notEmpty: {
      key: 'ErrorValidationRequired',
      value: true
    }
  }
};
