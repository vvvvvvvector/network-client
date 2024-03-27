import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authorised / News'
};

export default function NewsPage() {
  return <div className='rounded-lg bg-background p-5'>News</div>;
}
