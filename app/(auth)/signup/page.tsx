// import nookies from 'nookies';

import { SignUpForm } from '@/components/forms/signup-form';

import { type Metadata } from 'next';

// import { axiosApiInstance } from '@/axios';

// import { getAuthorizedUserUsername } from '@/api-calls/users';

// import { PAGES, TOKEN_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Auth / Sign Up'
};

export default async function SignUpPage() {
  return <SignUpForm />;
}

// export const getServerSideProps = (async (context) => {
//   const token = nookies.get(context)[TOKEN_NAME];

//   axiosApiInstance.defaults.headers.Authorization = `Bearer ${token}`;

//   try {
//     await getAuthorizedUserUsername();

//     return {
//       redirect: {
//         destination: PAGES.MY_PROFILE,
//         permanent: false
//       }
//     };
//   } catch (error) {
//     return {
//       props: {}
//     };
//   }
// }) satisfies GetServerSideProps;
