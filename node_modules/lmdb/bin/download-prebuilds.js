#!/usr/bin/env node

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

exec('download-msgpackr-prebuilds', propagateOutput);
process.chdir(fileURLToPath(dirname(dirname(import.meta.url))));
exec('prebuildify-ci download', propagateOutput);
function propagateOutput(error, stdout, stderr) {
	console.error(stderr);
	console.log(stdout);
	if (error?.code)
		process.exit(error.code);
}