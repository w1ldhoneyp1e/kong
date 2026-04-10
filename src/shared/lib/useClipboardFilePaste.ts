'use client'

import {useEffect, useRef} from 'react'

type UseClipboardFilePasteParams = {
	enabled: boolean,
	disabled: boolean,
	acceptFile: (file: File) => boolean,
	onFiles: (files: File[]) => void | Promise<void>,
}

function collectFilesFromClipboardData(data: DataTransfer | null): File[] {
	if (!data) {
		return []
	}

	const fromItems: File[] = []
	const {items} = data

	if (items) {
		for (const item of Array.from(items)) {
			if (item.kind !== 'file') {
				continue
			}

			const file = item.getAsFile()
			if (file) {
				fromItems.push(file)
			}
		}
	}

	if (fromItems.length > 0) {
		return fromItems
	}

	const {files} = data
	if (files?.length) {
		return Array.from(files)
	}

	return []
}

function isEditableTarget(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) {
		return false
	}

	if (target.isContentEditable) {
		return true
	}

	const {tagName} = target
	if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
		return true
	}

	return false
}

function useClipboardFilePaste({
	enabled,
	disabled,
	acceptFile,
	onFiles,
}: UseClipboardFilePasteParams) {
	const onFilesRef = useRef(onFiles)
	const acceptFileRef = useRef(acceptFile)

	onFilesRef.current = onFiles
	acceptFileRef.current = acceptFile

	useEffect(() => {
		if (!enabled || disabled) {
			return
		}

		const onPaste = async (event: ClipboardEvent) => {
			if (isEditableTarget(event.target)) {
				return
			}

			const raw = collectFilesFromClipboardData(event.clipboardData)
			const accepted = raw.filter(file => acceptFileRef.current(file))

			if (accepted.length === 0) {
				return
			}

			event.preventDefault()

			await onFilesRef.current(accepted)
		}

		window.addEventListener('paste', onPaste)

		return () => {
			window.removeEventListener('paste', onPaste)
		}
	}, [enabled, disabled])
}

export {useClipboardFilePaste}
export type {UseClipboardFilePasteParams}
