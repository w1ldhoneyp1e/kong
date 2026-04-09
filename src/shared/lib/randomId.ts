function randomId(): string {
	const cryptoRef = globalThis.crypto as {randomUUID?: () => string} | undefined

	return cryptoRef?.randomUUID?.() ?? `id_${Date.now()}_${Math.random()}`
}

export {randomId}
