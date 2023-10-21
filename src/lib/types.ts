export type FriendRequestStatus =
  | 'friend'
  | 'pending:sender'
  | 'pending:receiver'
  | 'rejected:sender'
  | 'none';

export interface NetworkUser extends NetworkUserProfile, Contacts, User {
  friendRequestStatus: FriendRequestStatus;
}

export interface AuthorisedUser extends AuthorisedUserProfile, Contacts, User {}

export interface User {
  username: string;
}

interface Avatar {
  avatar?: string;
}

interface Profile extends Avatar {
  uuid: string;
  isActivated: boolean;
  createdAt: string;
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
  contact: string;
  isPublic: boolean;
};
