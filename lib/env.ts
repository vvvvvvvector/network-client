import { z } from 'zod';

// todo: BASE_URL: string | undefined, but i don't how to create such a type with zod
// not: BASE_URL?: string | undefined

const envVariablesSchema = z.object({
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
});

export const env = envVariablesSchema.parse(process.env);

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv extends z.infer<typeof envVariablesSchema> {}
//   }
// }
