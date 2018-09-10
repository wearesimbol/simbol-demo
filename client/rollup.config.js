import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const pages = ['index'];

const config = pages.map((page) => {
	return {
		input: `src/${page}.js`,
		plugins: [
			commonJS({
				ignoreGlobal: true
			}),
			globals(),
			builtins(),
			resolve({
				preferBuiltins: false,
				browser: true
			})
		],
		output: [
			{
				format: 'iife',
				sourcemap: true,
				dir: 'build',
				file: `${page}.js`
			}
		]
	};
});

export default config;
