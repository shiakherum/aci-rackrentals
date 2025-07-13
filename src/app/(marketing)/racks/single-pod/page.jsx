import CallToAction from '@/components/marketing/single-rack/CallToAction';
import MoreDetails from '@/components/marketing/single-rack/MoreDetails';
import PlatformFeatures from '@/components/marketing/single-rack/PlatformFaqs';
import RackHero from '@/components/marketing/single-rack/RackHero';

export default function SinglePod() {
	return (
		<>
			<RackHero />
			<MoreDetails />
			<PlatformFeatures />
			<CallToAction />
		</>
	);
}
