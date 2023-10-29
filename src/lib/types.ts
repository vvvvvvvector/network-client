export type BaseRequestStatus = 'rejected' | 'accepted' | 'pending';

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

export interface Avatar {
  avatar: string | null;
}

interface Profile extends Avatar {
  uuid: string;
  isActivated: boolean;
  createdAt: string;
  bio: string | null;
}

type CreateProfile<T> = {
  profile: T;
};

export type ProfileWithAvatar = CreateProfile<Avatar>;

type NetworkUserProfile = CreateProfile<Omit<Profile, 'uuid'>>;
type AuthorisedUserProfile = CreateProfile<Profile>;

type Contacts = {
  contacts: {
    email: Email;
  };
};

type Email = {
  isPublic: boolean;
  contact?: string;
};
