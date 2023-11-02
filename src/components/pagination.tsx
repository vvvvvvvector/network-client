import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
  display: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: FC<Props> = ({
  display,
  totalPages,
  currentPage,
  setCurrentPage
}) => {
  const router = useRouter();

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

  const onClickPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const onClickNextPage = () => {
    if (totalPages > currentPage) setCurrentPage((prev) => prev + 1);
  };

  if (!display) return null;

  return (
    <div className='mt-4 flex justify-center gap-1'>
      <Button
        variant='ghost'
        size='icon'
        disabled={currentPage === 1}
        onClick={onClickPrevPage}
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
        onClick={onClickNextPage}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export { Pagination };
