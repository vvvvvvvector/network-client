import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';

import { getUserPublicAvailableDataByUsername } from '@/api/users';
import { Separator } from '@/components/ui/separator';
import { axiosApiInstance } from '@/axios';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import nookies from 'nookies';

interface Props {
  user: {
    username: string;
    profile: {
      isActivated: boolean;
      createdAt: string;
    };
    contacts: {
      email: {
        isPublic: boolean;
        contact: string;
      };
    };
  };
}

const Index: NextPageWithLayout<Props> = ({ user }) => {
  return (
    <div className='bg-white p-5 rounded-lg'>
      <div className='flex gap-3 items-center'>
        <Avatar>
          <AvatarImage src='' />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <span className='text-2xl font-semibold'>{`${
          user?.username || 'x'
        } (Public Profile)`}</span>
      </div>
      <Separator className='mt-4 mb-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`is profile activated: ${user?.profile.isActivated || 'x'}`}</li>
        <li>{`profile created at: ${user?.profile.createdAt || 'x'}`}</li>
        <li>{`email: ${user?.contacts.email.contact || 'x'}`}</li>
        <li>{`is email public: ${user?.contacts.email.isPublic || 'x'}`}</li>
      </ul>
    </div>
  );
};

Index.getLayout = (page) => (
  <Main title='Someone profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const { token } = nookies.get(ctx); // get token from the request

    axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`; // set cookie / token on the server

    const user = await getUserPublicAvailableDataByUsername(
      ctx.query.username as string
    );

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        user: null,
      },
    };
  }
};

export default Index;
