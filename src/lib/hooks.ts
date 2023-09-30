import { useRouter } from 'next/router';

import { useToast } from './../components/ui/use-toast';

const useDefault = () => {
  const router = useRouter();

  const { toast } = useToast();

  return { router, toast };
};

export { useDefault };
