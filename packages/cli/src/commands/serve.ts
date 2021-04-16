import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path';

export const serveCommand = new Command()
	.command('serve [filename]') // [] - optional
	.description('Open a file for editing')
	.option('-p, --port <number>', 'port to run server on', '4005') // <> - required
	.action((filename: string = 'notebook.js', options: { port: string }) => {
		const dir = path.join(process.cwd(), path.dirname(filename));
		const basename = path.basename(filename);
		serve(parseInt(options.port), basename, dir);
	});
