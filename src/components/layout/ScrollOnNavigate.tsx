'use client'

import {usePathname} from 'next/navigation'
import {useEffect} from 'react'
import {scrollToTop} from '../../lib/scrollToTop'

function ScrollOnNavigate() {
	const pathname = usePathname()

	useEffect(() => {
		scrollToTop('auto')
	}, [pathname])

	return null
}

export {ScrollOnNavigate}
