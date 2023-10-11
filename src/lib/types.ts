export interface NetworkUser extends NetworkUserProfile, Contacts, User {
  isFriend: boolean;
}

export interface AuthorisedUser extends AuthorisedUserProfile, Contacts, User {}

interface User {
  username: string;
}

interface Avatar {
  avatar?: string;
}

interface Profile {
  profile: {
    uuid: string;
    isActivated: boolean;
    createdAt: string;
  } & Avatar;
}

type NetworkUserProfile = { profile: Omit<Profile['profile'], 'uuid'> };
type AuthorisedUserProfile = Profile;

type Contacts = {
  contacts: Email;
};

interface Email {
  email: {
    contact: string;
    isPublic: boolean;
  };
}
