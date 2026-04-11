import {Migration} from '@medusajs/framework/mikro-orm/migrations'

export class Migration20260411210000 extends Migration {
	override async up(): Promise<void> {
		this.addSql(`
			DO $$
			DECLARE
				rec RECORD;
				new_id text;
			BEGIN
				FOR rec IN
					SELECT id FROM staff_user WHERE position('@' in id) > 0
				LOOP
					new_id := gen_random_uuid()::text;
					UPDATE rbac_actor_role
					SET actor_id = new_id, updated_at = now()
					WHERE actor_type = 'staff' AND actor_id = rec.id;
					UPDATE staff_user
					SET id = new_id, updated_at = now()
					WHERE id = rec.id;
				END LOOP;
			END $$;
		`)
	}

	override async down(): Promise<void> {
	}
}
