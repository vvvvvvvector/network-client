import { FC } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { avatarSource, cn } from '@/lib/utils';

import {
  Avatar as AvatarFromUI,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';

const avatarVariants = cva('', {
  variants: {
    size: {
      small: 'h-10 w-10',
      medium: 'w-[4.5rem] h-[4.5rem]',
      large: 'w-36 h-36'
    }
  },
  defaultVariants: {
    size: 'small'
  }
});

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  username: string;
  avatar: string | undefined;
  className?: string;
}

export const Avatar: FC<AvatarProps> = ({
  size,
  username,
  avatar,
  className
}) => {
  const uppercaseFirstLetterFallback = username[0].toLocaleUpperCase();

  return (
    <AvatarFromUI className={cn(avatarVariants({ size }), className)}>
      <AvatarImage src={avatarSource(avatar)} />
      <AvatarFallback>{uppercaseFirstLetterFallback}</AvatarFallback>
    </AvatarFromUI>
  );
};
