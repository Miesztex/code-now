import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// handle serve command
export const serveCommand = new Command()
	.command('serve [filename]') // [] - optional
	.description('Open a file for editing')
	.option('-p, --port <number>', 'port to run server on', '4005') // <> - required
	.action(
		async (filename: string = 'notebook.js', options: { port: string }) => {
			try {
				// localize saving file from command
				const dir = path.join(process.cwd(), path.dirname(filename)); // default(cli->dist)
				const basename = path.basename(filename);

				// serve logic (local-api)
				await serve(parseInt(options.port), basename, dir, !isProduction);

				console.log(`
				Opened ${filename}. Navigate to https://localhost:${options.port} to edit.
				`);
			} catch (err) {
				if (err.code === 'EADDRINUSE') {
					console.log('Port is in use. Try another port');
				} else {
					console.log('Problem appeared:', err.message);
				}

				process.exit(1);
			}
		}
	);
