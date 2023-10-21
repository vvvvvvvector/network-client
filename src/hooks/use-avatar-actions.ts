import { ChangeEvent } from 'react';
import { useSWRConfig } from 'swr';
import axios from 'axios';

import { deleteAvatar, updateAvatar, uploadAvatar } from '@/api/profiles';

import { useCombain } from '@/hooks/use-combain';

export const useAvatarActions = (
  controlDropdown?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast, router } = useCombain();

  const { mutate } = useSWRConfig();

  const revalidate = () => {
    mutate('/users/me/username-avatar');

    router.replace(router.asPath, undefined, { scroll: false });

    controlDropdown && controlDropdown(false);
  };

  const onAvatarUpdate = () => {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files instanceof FileList) {
          await updateAvatar(e.target.files[0]);
        }

        toast({
          description: 'An avatar was successfully updated.'
        });

        e.target.value = '';

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  const onAvatarUpload = () => {
    return async (e: ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files instanceof FileList) {
          await uploadAvatar(e.target.files[0]);
        }

        toast({
          description: 'An avatar was successfully uploaded.'
        });

        e.target.value = '';

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  const onAvatarDelete = () => {
    return async () => {
      try {
        await deleteAvatar();

        toast({
          description: 'An avatar was successfully deleted.'
        });

        revalidate();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            variant: 'destructive',
            description: `${error.response?.data.message}`
          });
        }
      }
    };
  };

  return {
    updateAvatar: onAvatarUpdate,
    uploadAvatar: onAvatarUpload,
    deleteAvatar: onAvatarDelete
  };
};
