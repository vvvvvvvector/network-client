import { axiosApiInstance } from '@/axios';

const uploadAvatar = async (avatar: File) => {
  const formData = new FormData();

  formData.append('file', avatar);

  await axiosApiInstance.post('/profiles/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateAvatar = async (avatar: File) => {
  const formData = new FormData();

  formData.append('file', avatar);

  await axiosApiInstance.put('/profiles/update-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const deleteAvatar = async () => {
  await axiosApiInstance.delete('/profiles/remove-avatar');
};

export { uploadAvatar, updateAvatar, deleteAvatar };
