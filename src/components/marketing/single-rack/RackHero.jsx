'use client';

import { CheckCircleIcon } from '@heroicons/react/16/solid';
import {
	ChevronRightIcon,
	ClockIcon,
	CpuChipIcon,
	HomeIcon,
	ServerStackIcon,
} from '@heroicons/react/24/outline';
import {
	CheckCircleIcon as CheckCircleSolid,
	ClockIcon as ClockSolid,
} from '@heroicons/react/24/solid';
import React, { useState } from 'react';

// Mock data - in real app this would come from props/API
const rackData = {
	id: 'single',
	title: 'Single Pod',
	tagline: '2 Leafs · 1 Spine · 1 APIC',
	description:
		'Perfect for CCNP study, foundational ACI labs, and quick proof-of-concepts. This single-pod rack pairs two enterprise Leaf switches with a Spine and full APIC, mirroring a production fabric—L3-Out connectivity included. Spin up tenants, policies, and external BGP/OSPF links exactly as you would in the data center, but without the overhead.',
	status: 'available', // available, busy, maintenance
	nextAvailable: null, // or timestamp if busy
	tokenRate: 225,
	hardware: {
		leafs: 2,
		spines: 1,
		apics: 1,
		total: 4,
	},
	availableAciVersions: ['5.2(1g)', '6.0(2h)', '6.0(3c)', '6.1(1a)'],
	location: 'Data Center A, Row 5',
	lastWiped: '2 hours ago',
	features: [
		'L3-Out (OSPF/BGP)',
		'VPN jump host included',
		'Console + GUI access',
		'One-click power cycle',
		'Multi-version ACI images (5.x & 6.x)',
		'Clean-wipe reset after each session',
		'Snapshot & instant revert support',
		'24×7 self-service booking calendar',
	],
};

// Mock booking data for the next 7 days
const mockBookings = {
	'2025-07-12': [
		{ startHour: 9, duration: 2, user: 'john.doe' },
		{ startHour: 14, duration: 3, user: 'jane.smith' },
		{ startHour: 18, duration: 1, user: 'bob.wilson' },
	],
	'2025-07-13': [
		{ startHour: 10, duration: 4, user: 'alice.brown' },
		{ startHour: 16, duration: 2, user: 'charlie.davis' },
	],
	'2025-07-14': [{ startHour: 8, duration: 8, user: 'diana.martinez' }],
	'2025-07-15': [
		{ startHour: 13, duration: 2, user: 'eve.taylor' },
		{ startHour: 20, duration: 3, user: 'frank.miller' },
	],
	'2025-07-16': [],
	'2025-07-17': [{ startHour: 11, duration: 5, user: 'grace.johnson' }],
	'2025-07-18': [{ startHour: 15, duration: 2, user: 'henry.wilson' }],
};

// Get available dates (next 7 days)
const getAvailableDates = () => {
	const dates = [];
	const today = new Date();
	for (let i = 0; i < 7; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() + i);
		dates.push({
			date: date.toISOString().split('T')[0],
			day: date.getDate(),
			weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
			isToday: i === 0,
		});
	}
	return dates;
};

// Generate hourly time slots
const generateTimeSlots = () => {
	const slots = [];
	for (let hour = 0; hour < 24; hour++) {
		const time12 =
			hour === 0
				? '12 AM'
				: hour < 12
				? `${hour} AM`
				: hour === 12
				? '12 PM'
				: `${hour - 12} PM`;
		slots.push({
			hour,
			time24: `${hour.toString().padStart(2, '0')}:00`,
			time12,
		});
	}
	return slots;
};

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

export default function RackHero() {
	const [selectedAciVersion, setSelectedAciVersion] = useState(
		rackData.availableAciVersions[1]
	); // Default to 6.0(2h)
	const [selectedDate, setSelectedDate] = useState(getAvailableDates()[0].date);
	const [selectedTime, setSelectedTime] = useState(null);
	const [selectedDuration, setSelectedDuration] = useState(1);

	const getStatusDisplay = () => {
		switch (rackData.status) {
			case 'available':
				return {
					icon: CheckCircleSolid,
					text: 'Available now',
					color: 'text-emerald-600',
					bgColor: 'bg-emerald-50',
					ringColor: 'ring-emerald-200',
				};
			case 'busy':
				return {
					icon: ClockSolid,
					text: 'Next slot: 15:30 IST',
					color: 'text-amber-600',
					bgColor: 'bg-amber-50',
					ringColor: 'ring-amber-200',
				};
			case 'maintenance':
				return {
					icon: ClockSolid,
					text: 'Under maintenance',
					color: 'text-gray-500',
					bgColor: 'bg-gray-50',
					ringColor: 'ring-gray-200',
				};
			default:
				return {
					icon: ClockIcon,
					text: 'Checking...',
					color: 'text-gray-500',
					bgColor: 'bg-gray-50',
					ringColor: 'ring-gray-200',
				};
		}
	};

	const isTimeSlotBooked = (hour) => {
		const bookings = mockBookings[selectedDate] || [];
		return bookings.some((booking) => {
			return (
				hour >= booking.startHour && hour < booking.startHour + booking.duration
			);
		});
	};

	const canBookDuration = (startHour, duration) => {
		const bookings = mockBookings[selectedDate] || [];
		for (let i = 0; i < duration; i++) {
			const checkHour = startHour + i;
			if (checkHour >= 24) return false; // Can't book past midnight
			const hasConflict = bookings.some((booking) => {
				return (
					checkHour >= booking.startHour &&
					checkHour < booking.startHour + booking.duration
				);
			});
			if (hasConflict) return false;
		}
		return true;
	};

	const status = getStatusDisplay();
	const StatusIcon = status.icon;
	const availableDates = getAvailableDates();
	const timeSlots = generateTimeSlots();
	const isLoggedIn = false; // This would come from your auth state

	return (
		<div className='bg-gray-100'>
			<div className='relative isolate overflow-hidden'>
				{/* Background gradients */}
				<div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
					/>
				</div>

				<div className='mx-auto max-w-7xl px-6 py-16 sm:py-16 sm:pb-20 lg:px-8'>
					{/* Breadcrumb */}
					<nav className='flex mb-10'>
						<ol role='list' className='flex items-center space-x-4'>
							<li>
								<div>
									<a href='#' className='text-gray-400 hover:text-gray-500'>
										<HomeIcon aria-hidden='true' className='size-5 shrink-0' />
										<span className='sr-only'>Home</span>
									</a>
								</div>
							</li>
							<li>
								<div className='flex items-center'>
									<ChevronRightIcon
										aria-hidden='true'
										className='size-5 shrink-0 text-gray-400'
									/>
									<a
										href='#'
										className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
										Racks
									</a>
								</div>
							</li>
							<li>
								<div className='flex items-center'>
									<ChevronRightIcon
										aria-hidden='true'
										className='size-5 shrink-0 text-gray-400'
									/>
									<a
										href='#'
										className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'>
										Single Pod
									</a>
								</div>
							</li>
						</ol>
					</nav>

					<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
						{/* Left column - Main content */}
						<div className='lg:col-span-7'>
							{/* Rack title & status */}
							<div className='flex items-start justify-between mb-6'>
								<div>
									<div className='flex items-start gap-3 mb-2'>
										<div className='flex h-12 w-12 mt-1.5 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600'>
											<ServerStackIcon className='h-6 w-6 text-white' />
										</div>
										<div>
											<h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-1'>
												{rackData.title}
											</h1>
											<p className='text-lg text-gray-600'>
												{rackData.tagline}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Description */}
							<p className='mt-6 max-w-2xl text-base/7 text-gray-600 mb-5'>
								{rackData.description}
							</p>
							<p className='mt-2 max-w-2xl text-base/7 text-gray-600 mb-8'>
								You get two production-grade Leaf switches, a Spine, and a fully
								licensed APIC controller, so you can rehearse tenant
								segmentation, contracts, and policy-based routing exactly as you
								would in the data center. Built-in L3-Out connectivity lets you
								test external integrations (OSPF, BGP, or static) without extra
								hardware, while full GUI and out-of-band console access mean you
								can flip between quick demos and deep-dive troubleshooting on
								the fly.
							</p>

							{/* Quick specs - using cleaner card style */}
							<div className='mb-8'>
								<h3 className='text-base font-semibold text-gray-900 mb-3'>
									Rack Specifications
								</h3>

								<div>
									<dl className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
										<div className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm '>
											<dt className='truncate text-sm font-medium text-gray-500'>
												Total Hardware
											</dt>
											<dd className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
												4 Nodes
											</dd>
										</div>
										<div className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm '>
											<dt className='truncate text-sm font-medium text-gray-500'>
												Location
											</dt>
											<dd className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
												Mum DC A
											</dd>
										</div>
										<div className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm'>
											<dt className='truncate text-sm font-medium text-gray-500'>
												Total Hardware
											</dt>
											<dd className='mt-1 text-2xl font-semibold tracking-tight text-gray-900'>
												4 Nodes
											</dd>
										</div>
									</dl>
								</div>
							</div>

							{/* ACI Version Selector */}
							<div className='mb-8'>
								<h3 className='text-base font-semibold text-gray-900 mb-3'>
									Select ACI Version
								</h3>
								<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
									{rackData.availableAciVersions.map((version) => (
										<button
											key={version}
											onClick={() => setSelectedAciVersion(version)}
											className={`relative rounded-lg cursor-pointer p-4 text-left transition-all ${
												selectedAciVersion === version
													? 'border-indigo-600 bg-indigo-50 border ring-1 ring-indigo-600'
													: 'border-gray-300 border bg-white hover:border-gray-300'
											}`}>
											<div className='flex items-center justify-between'>
												<span
													className={`text-sm font-medium ${
														selectedAciVersion === version
															? 'text-indigo-900'
															: 'text-gray-900'
													}`}>
													{version}
												</span>
												{selectedAciVersion === version && (
													<CheckCircleIcon className='h-4 w-4 text-indigo-600' />
												)}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Features list */}
							<div className='mb-8 mt-10'>
								<h3 className='text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide'>
									Included Features
								</h3>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
									{rackData.features.map((feature, index) => (
										<div key={index} className='flex items-center gap-2'>
											<CheckCircleIcon className='h-4 w-4 text-indigo-500 flex-shrink-0' />
											<span className='text-sm text-gray-700'>{feature}</span>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Right column - Booking card */}
						<div className='lg:col-span-5'>
							<div className='sticky top-8'>
								<div className='rounded-2xl border shadow-xs border-gray-200 bg-white p-6'>
									{/* Pricing */}
									<div className='text-center mb-6 pb-6 border-b border-gray-200'>
										<div className='flex items-baseline justify-center gap-2'>
											<span className='text-4xl font-bold tracking-tight text-gray-900'>
												<span className='opacity-35'>T</span>
												{rackData.tokenRate}
											</span>
											<span className='text-lg font-medium text-gray-600'>
												/hour
											</span>
										</div>
										<p className='text-sm text-gray-500 mt-1'>
											≈{' '}
											<strong className='font-medium text-indigo-700'>
												₹{(rackData.tokenRate * 4).toFixed(2)}
											</strong>{' '}
											per hour
										</p>
									</div>

									{/* Selected ACI version display */}
									<div className='mb-6'>
										<div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
											<CpuChipIcon className='h-4 w-4' />
											Selected ACI Version
										</div>
										<div className='bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2'>
											<span className='text-lg font-semibold text-indigo-900'>
												{selectedAciVersion}
											</span>
										</div>
									</div>

									{/* Calendar section */}
									<div className='mb-6'>
										<h4 className='text-sm font-medium text-gray-900 mb-3'>
											Select Date
										</h4>
										<div className='grid grid-cols-7 gap-px rounded-md bg-gray-200 text-center text-xs shadow-xs ring-1 ring-gray-200'>
											{availableDates.map((dateInfo, index) => (
												<button
													key={dateInfo.date}
													onClick={() => setSelectedDate(dateInfo.date)}
													className={classNames(
														'p-2 focus:z-10',
														selectedDate === dateInfo.date
															? 'bg-indigo-600 text-white font-semibold'
															: 'bg-white text-gray-900 hover:bg-gray-100',
														dateInfo.isToday && selectedDate !== dateInfo.date
															? 'text-indigo-600 font-semibold'
															: '',
														index === 0 && 'rounded-l-md',
														index === availableDates.length - 1 &&
															'rounded-r-md'
													)}>
													<div className='font-medium'>{dateInfo.weekday}</div>
													<div className='mt-1'>{dateInfo.day}</div>
												</button>
											))}
										</div>
									</div>

									{/* Time slots */}
									<div className='mb-6'>
										<h4 className='text-sm font-medium text-gray-900 mb-3'>
											Available Time Slots
										</h4>
										<div className='max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2'>
											<div className='grid grid-cols-6 gap-1'>
												{timeSlots.map((slot) => {
													const isBooked = isTimeSlotBooked(slot.hour);
													const canSelect =
														!isBooked &&
														canBookDuration(slot.hour, selectedDuration);

													return (
														<button
															key={slot.hour}
															onClick={() =>
																canSelect && setSelectedTime(slot.hour)
															}
															disabled={isBooked || !canSelect}
															className={classNames(
																'p-2 text-xs rounded border transition-all',
																isBooked
																	? 'bg-red-50 border-red-200 text-red-600 cursor-not-allowed'
																	: selectedTime === slot.hour
																	? 'border-indigo-600 bg-indigo-50 text-indigo-900'
																	: canSelect
																	? 'border-gray-200 hover:border-gray-300 text-gray-700'
																	: 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
															)}>
															<div className='font-medium'>{slot.time12}</div>
															{isBooked && (
																<div className='text-xs text-red-500 mt-1'>
																	Booked
																</div>
															)}
														</button>
													);
												})}
											</div>
										</div>
									</div>

									{/* Duration selector */}
									<div className='mb-6'>
										<h4 className='text-sm font-medium text-gray-900 mb-3'>
											Duration (Hours)
										</h4>
										<div className='flex gap-px bg-gray-200 shadow-xs ring-1 ring-gray-200 rounded-md overflow-hidden'>
											{[1, 2, 3, 4, 6, 8].map((hours) => (
												<button
													key={hours}
													onClick={() => setSelectedDuration(hours)}
													className={classNames(
														'px-3 py-2 text-sm font-semibold transition-all flex-1',
														selectedDuration === hours
															? 'bg-indigo-600 text-white'
															: 'bg-white text-gray-700 hover:bg-gray-50'
													)}>
													{hours}h
												</button>
											))}
										</div>
									</div>

									{/* Token balance - Login required */}
									<div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
										<div className='flex items-center justify-between'>
											<div className='text-sm font-medium text-gray-900'>
												Token Balance
											</div>
											<div className='text-xs text-indigo-600 hover:text-indigo-500 cursor-pointer'>
												Login to see balance
											</div>
										</div>
										<div className='text-xs text-gray-500 mt-1'>
											Sign in to view your available tokens and booking capacity
										</div>
									</div>

									{/* Selection summary */}
									{selectedTime !== null && (
										<div className='mb-6 p-3 bg-green-50 border border-green-200 rounded-lg'>
											<div className='text-sm font-medium text-green-900'>
												Booking Summary
											</div>
											<div className='text-sm text-green-700 mt-1'>
												{
													availableDates.find((d) => d.date === selectedDate)
														?.weekday
												}
												,{' '}
												{
													availableDates.find((d) => d.date === selectedDate)
														?.day
												}{' '}
												• {timeSlots[selectedTime].time12} • {selectedDuration}{' '}
												hour{selectedDuration > 1 ? 's' : ''}
											</div>
											<div className='text-xs text-green-600 mt-1'>
												Total cost: T{rackData.tokenRate * selectedDuration}
											</div>
										</div>
									)}

									{/* Book button */}
									<button
										disabled={!isLoggedIn || selectedTime === null}
										className={classNames(
											'w-full rounded-lg px-4 py-3 text-base font-semibold shadow-sm transition-all',
											!isLoggedIn || selectedTime === null
												? 'bg-gray-100 text-gray-400 cursor-not-allowed'
												: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
										)}>
										{!isLoggedIn
											? 'Login Required to Book'
											: selectedTime === null
											? 'Select Time Slot to Book'
											: 'Book This Rack'}
									</button>

									{/* Login prompt */}
									{!isLoggedIn && (
										<div className='mt-4 text-center'>
											<button className='text-sm cursor-pointer text-indigo-600 hover:text-indigo-500 font-medium'>
												Sign in to your account
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom gradient */}
				<div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className='relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
					/>
				</div>
			</div>
		</div>
	);
}
