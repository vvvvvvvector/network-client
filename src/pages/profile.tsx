import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import { getMyData } from '@/api/users';
import { Separator } from '@/components/ui/separator';
import { axiosApiInstance } from '@/axios';

import nookies from 'nookies';

interface Props {
  me: {
    id: number;
    username: string;
    profile: {
      uuid: string;
      isActivated: boolean;
      createdAt: string;
    };
    contacts: {
      id: number;
      email: {
        id: number;
        contact: string;
        isPublic: boolean;
      };
    };
  };
}

const Profile: NextPageWithLayout<Props> = ({ me }) => {
  return (
    <div className='bg-white p-5 rounded-lg'>
      <h2 className='text-lg font-bold'>My profile</h2>
      <Separator className='mt-4 mb-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`username: ${me?.username || 'x'}`}</li>
        <li>{`is profile activated: ${me?.profile.isActivated || 'x'}`}</li>
        <li>{`profile created at: ${me?.profile.createdAt || 'x'}`}</li>
        <li>{`email: ${me?.contacts.email.contact || 'x'}`}</li>
        <li>{`is email public: ${me?.contacts.email.isPublic || 'x'}`}</li>
      </ul>
    </div>
  );
};

Profile.getLayout = (page) => (
  <Main title='Authorised / My Profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const { token } = nookies.get(ctx); // get token from the request

    axiosApiInstance.defaults.headers.Authorization = 'Bearer ' + token; // set cookie / token on the server

    const me = await getMyData();

    return {
      props: {
        me,
      },
    };
  } catch (error) {
    return {
      props: {
        me: null,
      },
    };
  }
};

export default Profile;
