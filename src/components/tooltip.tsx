import { FC, PropsWithChildren } from 'react';

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface Props {
  text: string;
}

const Tooltip: FC<PropsWithChildren<Props>> = ({ children, text }) => {
  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

export { Tooltip };
