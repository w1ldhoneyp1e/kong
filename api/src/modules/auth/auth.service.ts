import {Injectable} from '@nestjs/common'
import {StaffLoginDto} from './dto/staff-login.dto'

@Injectable()
export class AuthService {
	login(input: StaffLoginDto): {message: string, email: string} {
		return {
			message: 'Staff auth migration is not implemented yet',
			email: input.email,
		}
	}
}
