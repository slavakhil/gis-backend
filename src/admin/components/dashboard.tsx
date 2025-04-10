import { FC, useEffect } from 'react';

const Dashboard: FC = () => {
  useEffect(() => {
    window.location.href = '/admin/resources/Новости';
  });

  return null;
};

export { Dashboard };
export default Dashboard;
