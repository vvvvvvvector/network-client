import { FC } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { avatarSource, cn, getFirstLetterInUpperCase } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const avatarVariants = cva('', {
  variants: {
    size: {
      small: 'h-10 w-10',
      medium: 'w-[4.5rem] h-[4.5rem]',
      large: 'w-36 h-36',
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

interface AProps extends VariantProps<typeof avatarVariants> {
  username: string;
  avatar?: string;
}

export const A: FC<AProps> = ({ size, username, avatar }) => {
  return (
    <Avatar className={cn(avatarVariants({ size }))}>
      <AvatarImage src={avatarSource(avatar)} />
      <AvatarFallback>{getFirstLetterInUpperCase(username)}</AvatarFallback>
    </Avatar>
  );
};
