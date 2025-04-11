import common from './common.json' with { type: 'json' };
import User from './user.json' with { type: 'json' };
const enLocale = {
    ...common,
    resources: {
        User,
    },
};
export default enLocale;
