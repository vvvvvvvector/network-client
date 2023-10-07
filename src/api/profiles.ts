import { axiosApiInstance } from '@/axios';

const uploadAvatar = () => {};

const updateAvatar = () => {};

const deleteAvatar = async () => {
  await axiosApiInstance.delete('/profiles/remove-avatar');
};

export { uploadAvatar, deleteAvatar };
