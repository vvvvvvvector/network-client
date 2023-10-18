import { useRouter } from 'next/router';

import { useToast } from '../components/ui/use-toast';

export const useCombain = () => {
  const router = useRouter();
  const { toast } = useToast();

  return { router, toast };
};
