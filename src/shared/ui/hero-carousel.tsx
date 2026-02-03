'use client'

import {useEffect, useState} from 'react'
import type {CarouselApi} from './carousel'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from './carousel'

const SLIDES = [
	{bg: '#9333ea', label: 'Акция'},
	{bg: '#2563eb', label: 'Новая коллекция'},
	{bg: '#059669', label: 'Скидки'},
	{bg: '#dc2626', label: 'Хит продаж'},
	{bg: '#ea580c', label: 'Распродажа'},
]

const AUTOPLAY_DELAY_MS = 4000

function HeroCarousel() {
	const [api, setApi] = useState<CarouselApi>()

	useEffect(() => {
		if (!api) return
		const id = setInterval(() => {
			api.scrollNext()
		}, AUTOPLAY_DELAY_MS)
		
		return () => clearInterval(id)
	}, [api])

	return (
		<div className="relative w-full group">
			<Carousel
				opts={{loop: true, align: 'start'}}
				setApi={setApi}
				className="w-full"
			>
				<CarouselContent className="-ml-0">
					{SLIDES.map((slide, i) => (
						<CarouselItem key={i} className="pl-0">
							<div
								className="flex items-center justify-center min-h-[280px] md:min-h-[360px]"
								style={{backgroundColor: slide.bg}}
							>
								<span className="text-white text-2xl md:text-4xl font-semibold drop-shadow-md">
									{slide.label}
								</span>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="left-2 border-0 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
				<CarouselNext className="right-2 border-0 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
			</Carousel>
		</div>
	)
}

export {HeroCarousel}
