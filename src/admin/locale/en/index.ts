import common from './common.json' assert { type: 'json' };
import User from './user.json' assert { type: 'json' };

const enLocale = {
  ...common,
  resources: {
    User,
  },
};

export default enLocale;
