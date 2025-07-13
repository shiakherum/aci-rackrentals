import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Cisco ACI Rack Management Portal',
	description: 'Book and manage your Cisco ACI lab racks.',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${inter.className} bg-gray-50`}>
				<div className='flex flex-col min-h-screen'>
					<Header />
					<div style={{ height: '64px' }} />
					<main className='flex-grow'>{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
