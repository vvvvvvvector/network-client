import { GetServerSideProps } from 'next';

import { NextPageWithLayout } from '../_app';

import { Main } from '@/layouts/Main';

import { Authorized } from '@/layouts/Authorised';

import { getUserPublicAvailableDataByUsername } from '@/api/users';
import { Separator } from '@/components/ui/separator';

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
      <h2 className='text-lg font-bold'>Someone profile</h2>
      <Separator className='mt-4 mb-4' />
      <ul className='flex flex-col gap-5'>
        <li>{`username: ${'x'}`}</li>
        <li>{`is profile activated: ${'x'}`}</li>
        <li>{`profile created at: ${'x'}`}</li>
        <li>{`email: ${'x'}`}</li>
        <li>{`is email public: ${'x'}`}</li>
      </ul>
    </div>
  );
};

Index.getLayout = (page) => (
  <Main title='Someone profile'>
    <Authorized>{page}</Authorized>
  </Main>
);

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const user = await getUserPublicAvailableDataByUsername(
      params?.username as string
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
