import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';

const Profile: NextPageWithLayout = () => {
  return <div className='bg-white p-5 rounded-lg'>Profile</div>;
};

Profile.getLayout = (page) => (
  <Main title='Authorised / Profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Profile;
