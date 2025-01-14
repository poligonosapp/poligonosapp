/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Config file for running Rollup in "watch" mode
// This adds a sanity check to help ourselves to run 'rollup -w' as needed.

import rollupGitVersion from 'rollup-plugin-git-version'
import gitRev from 'git-rev-sync'

const branch = gitRev.branch();
const rev = gitRev.short();
const version = require('../package.json').version + '+' + branch + '.' + rev;
const banner = `/* @preserve
 * Leaflet ${version}, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2021 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
`;

export default {
	input: 'src/Leaflet.ts',
	output: {
		file: 'dist/leaflet-src.ts',
		format: 'umd',
		name: 'L',
		banner: banner,
		sourcemap: true,
		legacy: true, // Needed to create files loadable by IE8
		freeze: false,
	},
	plugins: [
		rollupGitVersion()
	]
};
