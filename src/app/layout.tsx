import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Indigenious - Connect. Verify. Prosper.',
  description: 'The definitive Indigenous business verification platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}