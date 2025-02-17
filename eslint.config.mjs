// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierPlugin from 'eslint-plugin-prettier'

export default withNuxt({
	plugins: {
		prettier: prettierPlugin
	},
	rules: {
		'vue/multi-word-component-names': 'off',
		'vue/require-default-prop': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ prefer: 'type-imports', fixStyle: 'separate-type-imports' }
		]
	},
	ignores: ['node_modules', 'dist', 'public', '.nuxt']
})
