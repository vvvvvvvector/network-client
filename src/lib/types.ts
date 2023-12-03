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

export type NetworkUser = NetworkUserProfile &
  Contacts &
  User & {
    extendedFriendRequestStatus: ExtendedFriendRequestStatus;
  };

export type AuthorisedUser = AuthorisedUserProfile & Contacts & User;

export type User = {
  username: string;
};

export type Avatar = {
  name: string;
  likes: number;
};

type Profile = {
  uuid: string;
  isActivated: boolean;
  createdAt: string;
  bio: string | null;
};

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

export type ChatFromListOfChats = {
  id: string;
  friendUsername: string;
  friendAvatar: string | null;
  lastMessageContent: string | null;
  lastMessageSentAt: string | null;
};

export type Message = {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    username: string;
  };
};

export type Chat = {
  id: string;
  authorizedUserUsername: string;
  friendUsername: string;
  friendAvatar: string | null;
  messages: Message[];
};
