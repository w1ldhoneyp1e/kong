/* eslint-disable import/group-exports -- Next.js: segment config и route handler экспортируются отдельно */
import {randomUUID} from 'node:crypto'
import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {type NextRequest} from 'next/server'

const MAX_BYTES = 8 * 1024 * 1024

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	if (process.env.NODE_ENV !== 'development') {
		return Response.json(
			{error: 'Доступно только в development'},
			{status: 404},
		)
	}

	const formData = await request.formData()
	const files = formData.getAll('file').filter((entry): entry is File => entry instanceof File)

	if (files.length === 0) {
		return Response.json(
			{error: 'Нет файлов'},
			{status: 400},
		)
	}

	const dir = join(process.cwd(), 'public', 'dev-uploads', 'products')

	await mkdir(dir, {recursive: true})

	const urls: string[] = []

	for (const file of files) {
		if (!file.type.startsWith('image/')) {
			continue
		}

		const buffer = Buffer.from(await file.arrayBuffer())

		if (buffer.length > MAX_BYTES) {
			continue
		}

		const rawName = file.name.trim()
		const extFromName = rawName.includes('.')
			? rawName.split('.').pop()
				?.toLowerCase()
			: undefined
		const ext = extFromName && /^[a-z0-9]{1,8}$/.test(extFromName)
			? extFromName
			: 'bin'
		const name = `${randomUUID()}.${ext}`

		await writeFile(join(dir, name), buffer)

		urls.push(`/dev-uploads/products/${name}`)
	}

	if (urls.length === 0) {
		return Response.json(
			{error: 'Нет подходящих изображений'},
			{status: 400},
		)
	}

	return Response.json({urls})
}
