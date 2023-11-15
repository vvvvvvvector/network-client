type CreateAvatar<T> = {
  avatar: T | null;
};

type CreateProfile<T> = {
  profile: T;
};

export type BaseFriendRequestStatus = 'rejected' | 'accepted' | 'pending';

export type ExtendedFriendRequestStatus =
  | 'friend'
  | 'pending:sender'
  | 'pending:receiver'
  | 'rejected:sender'
  | 'none';

export type UserFromListOfUsers = User & ProfileWithAvatarWithoutLikes;

export interface NetworkUser extends NetworkUserProfile, Contacts, User {
  extendedFriendRequestStatus: ExtendedFriendRequestStatus;
}

export interface AuthorisedUser extends AuthorisedUserProfile, Contacts, User {}

export interface User {
  username: string;
}

export interface Avatar {
  name: string;
  likes: number;
}

interface Profile {
  uuid: string;
  isActivated: boolean;
  createdAt: string;
  bio: string | null;
}

export type AvatarWithoutLikes = CreateAvatar<Pick<Avatar, 'name'>>;

export type ProfileWithAvatarWithoutLikes = CreateProfile<AvatarWithoutLikes>;

type NetworkUserProfile = CreateProfile<
  Omit<Profile, 'uuid'> & CreateAvatar<Avatar>
>;

type AuthorisedUserProfile = CreateProfile<Profile & CreateAvatar<Avatar>>;

type Contacts = {
  contacts: {
    email: Email;
  };
};

type Email = {
  isPublic: boolean;
  contact: string | undefined;
};
