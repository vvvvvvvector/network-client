import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authorised / Photos'
};

export default function PhotosPage() {
  return <div className='rounded-lg bg-background p-5'>My photos</div>;
}
