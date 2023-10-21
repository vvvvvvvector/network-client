import { useCombain } from '@/hooks/use-combain';

import { PAGES } from '@/lib/constants';

export const useCommonActions = () => {
  const { router } = useCombain();

  const onClickGoToProfile = (username: string) => () => {
    router.push(`/${username}`);
  };

  const onClickWriteMessage = (username: string) => () => {
    router.push(PAGES.MESSENGER);
  };

  return {
    goToProfile: onClickGoToProfile,
    writeMessage: onClickWriteMessage
  };
};
