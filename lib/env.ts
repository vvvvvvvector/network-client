import { z } from 'zod';

const envVariablesSchema = z
  .object({
    BASE_URL: z
      .string()
      .min(1, { message: 'env variable BASE_URL is required' })
      .url({ message: 'Invalid BASE_URL' })
      .optional(),
    NEXT_PUBLIC_SIGN_IN_PASSWORD: z.string().optional(),
    NEXT_PUBLIC_API_URL: z
      .string()
      .min(1, { message: 'env variable NEXT_PUBLIC_API_URL is required' })
      .url({ message: 'Invalid NEXT_PUBLIC_API_URL' })
      .optional(),
    NEXT_PUBLIC_TOKEN_NAME: z
      .custom<`${string}.token`>(
        (val) => (typeof val === 'string' ? /^.+.token$/.test(val) : false),
        {
          message:
            'Invalid token name, must be: [whatever at least one symbol].token'
        }
      )
      .optional()
  })
  .passthrough();

// export const env = envVariablesSchema.parse(process.env) // this will not work. you can't destruct process.env as a regular object. only used env variables (like below) are included in the build

export const env = envVariablesSchema.parse({
  BASE_URL: process.env.BASE_URL,
  NEXT_PUBLIC_SIGN_IN_PASSWORD: process.env.NEXT_PUBLIC_SIGN_IN_PASSWORD,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_TOKEN_NAME: process.env.NEXT_PUBLIC_TOKEN_NAME
});
