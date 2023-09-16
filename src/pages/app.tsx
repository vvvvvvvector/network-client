import { NextPageWithLayout } from './_app';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Main } from '@/layouts/Main';

import * as Api from '@/api';

const App: NextPageWithLayout = () => {
  const { toast } = useToast();

  return (
    <Button
      variant='destructive'
      onClick={() => {
        Api.auth.signOut();

        toast({
          description: 'You have successfully signed out.',
        });

        location.href = '/';
      }}
    >
      Sign out
    </Button>
  );
};

App.getLayout = (page) => <Main title='Signed in user profile'>{page}</Main>;

export default App;
