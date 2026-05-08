import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import {ValidationPipe} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from '@nestjs/platform-fastify'
import {AppModule} from './app.module'
import {EnvironmentService} from './modules/config/environment.service'

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	)
	const env = app.get(EnvironmentService)

	await app.register(cookie as never)
	await app.register(cors as never, {
		origin: [env.appUrl],
		credentials: true,
	})
	await app.register(helmet as never)

	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true,
	}))

	await app.listen(env.port, '0.0.0.0')
}

void bootstrap()
