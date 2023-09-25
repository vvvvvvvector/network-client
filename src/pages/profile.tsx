import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';

const Profile: NextPageWithLayout = () => {
  return <div className='w-full h-full bg-emerald-200'>Profile</div>;
};

Profile.getLayout = (page) => (
  <Main title='Authorised / Profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export default Profile;
