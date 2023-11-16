import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

import { PAGES } from '@/lib/constants';

export const useCommonActions = () => {
  const { router } = useFrequentlyUsedHooks();

  const onClickGoToProfile = (username: string) => () => {
    router.push(`/${username}`);
  };

  const onClickWriteMessage = (username: string) => () => {
    router.push(PAGES.MESSENGER);
  };

  const onClickOpenPhoto = (avatarName: string | undefined) => () => {
    location.href = `${process.env.NEXT_PUBLIC_API_URL}/uploads/avatars/${avatarName}`;
  };

  return {
    goToProfile: onClickGoToProfile,
    writeMessage: onClickWriteMessage,
    openPhoto: onClickOpenPhoto
  };
};
