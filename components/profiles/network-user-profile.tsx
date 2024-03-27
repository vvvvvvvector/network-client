import { NetworkUser } from '@/lib/types';

import { FriendProfile } from '@/components/profiles/friend-profile';
import { DefaultProfile } from '@/components/profiles/default-profile';

export const NetworkUserProfile = ({ user }: { user: NetworkUser }) => {
  const commonProps = {
    username: user.username,
    profile: user.profile,
    lastSeen: user.lastSeen,
    contacts: user.contacts
  };

  if (user.extendedFriendRequestStatus === 'friend')
    return <FriendProfile {...commonProps} />;

  return (
    <DefaultProfile
      extendedFriendRequestStatus={user.extendedFriendRequestStatus}
      {...commonProps}
    />
  );
};
