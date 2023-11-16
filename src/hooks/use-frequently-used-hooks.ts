import { useRouter } from 'next/router';

import { useToast } from '@/components/ui/use-toast';

export const useFrequentlyUsedHooks = () => ({
  router: useRouter(),
  toast: useToast()['toast']
});
