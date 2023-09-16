export type SignInFormDto = {
  username: string;
  password: string;
};

export type SignUpFormDto = SignInFormDto & {
  email: string;
};

export type SignInResponse = {
  token: string;
};

export type SignUpResponse = {
  message: string;
  statusCode: number;
  receiver: string;
  link: string;
};
