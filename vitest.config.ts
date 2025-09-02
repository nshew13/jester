import {fileURLToPath} from 'node:url';
import {mergeConfig, defineConfig, configDefaults} from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			exclude: [...configDefaults.exclude, 'e2e/**'],
			globals: true, // for Testing Library https://testing-library.com/docs/vue-testing-library/setup
			root: fileURLToPath(new URL('./', import.meta.url)),
			coverage: {
				provider: 'istanbul', // 'v8' is the default
				thresholds: {
					autoUpdate: true,
				},
			},
		},
	}),
);
