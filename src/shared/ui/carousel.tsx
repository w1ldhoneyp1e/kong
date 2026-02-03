'use client'

import useEmblaCarousel from 'embla-carousel-react'
import {
	createContext,
	type CSSProperties,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {Button} from './button'
import {cn} from '../lib/utils'

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1]
type CarouselContextValue = {
	api: CarouselApi | undefined
	canScrollPrev: boolean
	canScrollNext: boolean
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel() {
	const ctx = useContext(CarouselContext)
	if (!ctx) {
		throw new Error('useCarousel must be used within Carousel')
	}
	return ctx
}

type CarouselProps = {
	opts?: Parameters<typeof useEmblaCarousel>[0]
	plugins?: Parameters<typeof useEmblaCarousel>[1]
	orientation?: 'horizontal' | 'vertical'
	className?: string
	setApi?: (api: CarouselApi | undefined) => void
	children: ReactNode
}

function Carousel({
	opts,
	plugins,
	orientation = 'horizontal',
	className,
	setApi: setApiProp,
	children,
}: CarouselProps) {
	const [api, setApi] = useState<CarouselApi>()
	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(false)
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			...opts,
			axis: orientation === 'horizontal' ? 'x' : 'y',
		},
		plugins,
	)

	useEffect(() => {
		setApi(emblaApi)
		setApiProp?.(emblaApi)
		return () => setApiProp?.(undefined)
	}, [emblaApi, setApiProp])

	useEffect(() => {
		if (!emblaApi) return
		const onSelect = () => {
			setCanScrollPrev(emblaApi.canScrollPrev())
			setCanScrollNext(emblaApi.canScrollNext())
		}
		onSelect()
		emblaApi.on('select', onSelect)
		
		return () => {
			emblaApi.off('select', onSelect)
		}
	}, [emblaApi])

	return (
		<CarouselContext.Provider value={{api, canScrollPrev, canScrollNext}}>
			<div
				ref={emblaRef}
				className={cn('overflow-hidden', className)}
			>
				{children}
			</div>
		</CarouselContext.Provider>
	)
}

type CarouselContentProps = {
	className?: string
	style?: CSSProperties
	children: ReactNode
}

function CarouselContent({className, style, children}: CarouselContentProps) {
	const orientation = 'horizontal'
	return (
		<div
			className={cn(
				'flex',
				orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
				className,
			)}
			style={style}
		>
			{children}
		</div>
	)
}

type CarouselItemProps = {
	className?: string
	children: ReactNode
}

function CarouselItem({className, children}: CarouselItemProps) {
	const orientation = 'horizontal'
	return (
		<div
			className={cn(
				'min-w-0 shrink-0 grow-0 basis-full',
				orientation === 'horizontal' ? 'pl-4' : 'pt-4',
				className,
			)}
		>
			{children}
		</div>
	)
}

type CarouselPreviousProps = {
	className?: string
}

function CarouselPrevious({className}: CarouselPreviousProps) {
	const {api, canScrollPrev} = useCarousel()
	const scrollPrev = useCallback(() => {
		api?.scrollPrev()
	}, [api])
	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			className={cn('absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full', className)}
			onClick={scrollPrev}
			disabled={!canScrollPrev}
			aria-label="Предыдущий слайд"
		>
			<ChevronLeft className="size-6" />
		</Button>
	)
}

type CarouselNextProps = {
	className?: string
}

function CarouselNext({className}: CarouselNextProps) {
	const {api, canScrollNext} = useCarousel()
	const scrollNext = useCallback(() => {
		api?.scrollNext()
	}, [api])
	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			className={cn('absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full', className)}
			onClick={scrollNext}
			disabled={!canScrollNext}
			aria-label="Следующий слайд"
		>
			<ChevronRight className="size-6" />
		</Button>
	)
}

export type {CarouselApi}
export {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	useCarousel,
}
