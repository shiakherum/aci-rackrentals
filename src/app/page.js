import CTA from '@/components/marketing/home-page/CTA';
import Features from '@/components/marketing/home-page/Features';
import Hero from '@/components/marketing/home-page/Hero';
import POC from '@/components/marketing/home-page/POC';
import RackCards from '@/components/marketing/home-page/RacksSection';
import TokenPacks from '@/components/marketing/home-page/TokenPacks';

export default function HomePage() {
	return (
		<>
			<Hero />
			<RackCards />
			<Features />
			<POC />
			<TokenPacks />
			<CTA />
		</>
	);
}
