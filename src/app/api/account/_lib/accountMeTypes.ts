type AccountMe = {
	authenticated: boolean,
	actorType: 'guest' | 'customer' | 'staff',
	email?: string | null,
	roleCode?: string | null,
	permissions?: string[],
}

type AccountMeSuccessResponse = {
	ok: true,
	actorType: AccountMe['actorType'],
	account: AccountMe,
}

type AccountMeErrorResponse = {
	ok: false,
	error: string,
}

type AccountMeResponse = AccountMeSuccessResponse | AccountMeErrorResponse

export type {
	AccountMe,
	AccountMeErrorResponse,
	AccountMeResponse,
	AccountMeSuccessResponse,
}

