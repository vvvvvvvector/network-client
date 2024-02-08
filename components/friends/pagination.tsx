import { type ComponentProps, useContext, createContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { PAGES } from '@/lib/constants';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

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
  const { router } = useFrequentlyUsedHooks();

  if (totalPages <= 1) return null;

  return (
    <PagesContext.Provider
      value={{ currentPage: +(router.query.page as string), totalPages }}
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

  const { router } = useFrequentlyUsedHooks();

  return (
    <li
      onClick={() =>
        router.push({ pathname: PAGES.FRIENDS_FIND, query: { page: selected } })
      }
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

  const { router } = useFrequentlyUsedHooks();

  const disabled = currentPage === totalPages;

  return (
    <PaginationItem
      onClick={() =>
        router.push({
          pathname: PAGES.FRIENDS_FIND,
          query: { page: currentPage + 1 }
        })
      }
      disabled={disabled}
    >
      <ChevronRight />
    </PaginationItem>
  );
};

const PaginationPrevious = () => {
  const { currentPage } = usePages();

  const { router } = useFrequentlyUsedHooks();

  const disabled = router.query.page === '1';

  return (
    <PaginationItem
      onClick={() =>
        router.push({
          pathname: PAGES.FRIENDS_FIND,
          query: { page: currentPage - 1 }
        })
      }
      disabled={disabled}
    >
      <ChevronLeft />
    </PaginationItem>
  );
};

PaginationItem.Next = PaginationNext;
PaginationItem.Previous = PaginationPrevious;

export { Pagination, PaginationContent, PaginationItem };
