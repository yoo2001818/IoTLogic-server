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
    notEmpty: true
  },
  email: {
    isEmail: true
  }
};

export const Article = {
  name: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 256]
    },
    notEmpty: true
  },
  photo: {
    isURL: true
  },
  description: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 32767]
    },
    notEmpty: true
  },
  price: {
    isInt: {
      key: 'FIELD_INT_ONLY'
    },
    notEmpty: true
  }
}
