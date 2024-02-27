import { type ComponentProps, useContext, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';

import { Icons } from '@/components/icons';

import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

const PagesContext = createContext<{
  totalPages: number;
  currentPage: number;
} | null>(null);

const usePages = () => {
  const context = useContext(PagesContext);

  if (!context) {
    throw new Error('usePages must be used within a PagesProvider');
  }

  return context;
};

const Pagination = ({
  totalPages,
  className,
  children,
  ...props
}: { totalPages: number } & ComponentProps<'nav'>) => {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString());

  if (totalPages <= 1) return null;

  return (
    <PagesContext.Provider
      value={{ currentPage: Number(params.get('page')), totalPages }}
    >
      <nav className={cn('mt-4', className)} {...props}>
        {children}
      </nav>
    </PagesContext.Provider>
  );
};

const PaginationContent = ({ children, ...props }: ComponentProps<'ul'>) => {
  return (
    <ul className='flex items-center justify-center gap-1' {...props}>
      {children}
    </ul>
  );
};

Pagination.Content = PaginationContent;

type PaginationItemProps = {
  disabled?: boolean;
  selected?: number;
} & ComponentProps<'li'>;

const PaginationItem = ({
  disabled = false,
  selected,
  className,
  children,
  ...props
}: PaginationItemProps) => {
  const { currentPage } = usePages();

  const { push } = useRouter();

  return (
    <li
      onClick={() => push(`${PAGES.FRIENDS_FIND}?page=${selected}`)}
      className={cn(
        'cursor-pointer',
        buttonVariants({
          variant: currentPage === selected ? 'secondary' : 'ghost',
          size: 'icon'
        }),
        {
          'pointer-events-none opacity-50': disabled
        },
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
};

const PaginationNext = () => {
  const { currentPage, totalPages } = usePages();

  const { push } = useRouter();

  const disabled = currentPage === totalPages;

  return (
    <PaginationItem
      onClick={() => push(`${PAGES.FRIENDS_FIND}?page=${currentPage + 1}`)}
      disabled={disabled}
    >
      <Icons.arrowRight />
    </PaginationItem>
  );
};

const PaginationPrevious = () => {
  const { currentPage } = usePages();

  const { push } = useRouter();

  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString());

  const disabled = params.get('page') === '1';

  return (
    <PaginationItem
      onClick={() => push(`${PAGES.FRIENDS_FIND}?page=${currentPage - 1}`)}
      disabled={disabled}
    >
      <Icons.arrowLeft />
    </PaginationItem>
  );
};

PaginationItem.Next = PaginationNext;
PaginationItem.Previous = PaginationPrevious;

export { Pagination, PaginationContent, PaginationItem };
