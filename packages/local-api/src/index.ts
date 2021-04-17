import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
	port: number,
	filename: string,
	dir: string,
	useProxy: boolean
) => {
	const app = express();

	// ====================
	// ROUTER
	// ====================
	app.use(createCellsRouter(filename, dir));

	// ====================
	// LOCAL CLIENT
	// ====================
	if (useProxy) {
		// serving from cra (development mode)
		app.use(
			createProxyMiddleware({
				target: 'http://localhost:3000',
				ws: true,
				logLevel: 'silent',
			})
		);
	} else {
		// serving react assets from dependecies (production mode)
		const packagePath = require.resolve('local-client/build/index.html');
		app.use(express.static(path.dirname(packagePath)));
	}

	// ====================
	// LISTENING
	// ====================
	return new Promise<void>((resolve, reject) => {
		app.listen(port, resolve).on('error', reject);
	});
};
