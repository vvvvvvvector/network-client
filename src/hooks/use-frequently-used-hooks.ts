import { useRouter } from 'next/router';

import { toast as sonnerToast } from 'sonner';

export const useFrequentlyUsedHooks = () => ({
  router: useRouter(),
  toast: sonnerToast
});
