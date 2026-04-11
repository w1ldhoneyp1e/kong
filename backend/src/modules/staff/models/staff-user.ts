import {model} from '@medusajs/framework/utils'

const StaffUser = model
	.define('staff_user', {
		id: model.id().primaryKey(),
		email: model.text().unique(),
		password_hash: model.text(),
		first_name: model.text().nullable(),
		last_name: model.text().nullable(),
	})

export default StaffUser

