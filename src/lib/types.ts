export type BaseFriendRequestStatus = 'rejected' | 'accepted' | 'pending';

export type ExtendedFriendRequestStatus =
  | 'friend'
  | 'pending:sender'
  | 'pending:receiver'
  | 'rejected:sender'
  | 'none';

export interface NetworkUser extends NetworkUserProfile, Contacts, User {
  extendedFriendRequestStatus: ExtendedFriendRequestStatus;
}

export interface AuthorisedUser extends AuthorisedUserProfile, Contacts, User {}

export interface User {
  username: string;
}

type CreateAvatar<T> = {
  avatar: T | null;
};

type CreateProfile<T> = {
  profile: T;
};

interface Profile {
  uuid: string;
  isActivated: boolean;
  createdAt: string;
  bio: string | null;
}

export type ProfileWithAvatarWithoutLikes = CreateProfile<
  CreateAvatar<{
    name: string;
  }>
>;

type NetworkUserProfile = CreateProfile<
  Omit<Profile, 'uuid'> &
    CreateAvatar<{
      name: string;
      likes: number;
    }>
>;

type AuthorisedUserProfile = CreateProfile<
  Profile &
    CreateAvatar<{
      name: string;
      likes: number;
    }>
>;

type Contacts = {
  contacts: {
    email: Email;
  };
};

type Email = {
  isPublic: boolean;
  contact?: string;
};
