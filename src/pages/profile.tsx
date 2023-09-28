import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { NextPageWithLayout } from './_app';

import { Main } from '@/layouts/Main';
import { Authorized } from '@/layouts/Authorised';

import { getMyData } from '@/api/users';
import { Separator } from '@/components/ui/separator';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { isAuthorized } from '@/lib/auth';

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
      <div className='flex gap-3 items-center'>
        <Avatar>
          <AvatarImage src='https://avatars.githubusercontent.com/u/57532024?v=4' />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <span className='text-2xl font-semibold'>{`${
          me?.username || 'x'
        } (My Profile)`}</span>
      </div>
      <Separator className='mt-4 mb-4' />
      <ul className='flex flex-col gap-5'>
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
    const res = await isAuthorized(ctx);

    if (res && 'redirect' in res) return res;

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
