import { FC, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useFrequentlyUsedHooks } from '@/hooks/use-frequently-used-hooks';

interface Props {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: FC<Props> = ({ totalPages, currentPage, setCurrentPage }) => {
  const { router } = useFrequentlyUsedHooks();

  useEffect(() => {
    if (router.query.username) {
      router.push({
        query: {
          page: currentPage,
          username: router.query.username
        }
      });
    } else {
      router.push({
        query: {
          page: currentPage
        }
      });
    }
  }, [currentPage]);

  return (
    <div className='mt-4 flex justify-center gap-1'>
      <Button
        variant='ghost'
        size='icon'
        disabled={currentPage === 1}
        onClick={() => {
          if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        }}
      >
        <ChevronLeft />
      </Button>
      {[...Array(totalPages)].map((_, index) => (
        <Button
          key={index + 1}
          onClick={() => setCurrentPage(index + 1)}
          variant={index + 1 === currentPage ? 'secondary' : 'ghost'}
        >
          {index + 1}
        </Button>
      ))}
      <Button
        variant='ghost'
        size='icon'
        disabled={currentPage === totalPages}
        onClick={() => {
          if (totalPages > currentPage) setCurrentPage((prev) => prev + 1);
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export { Pagination };
