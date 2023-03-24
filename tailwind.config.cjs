const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {
			fontSize: {
				"10xl": "12rem",
			},
		},
	},
	plugins: [
		require('daisyui'),
	],
	daisyui: {
		themes: [
			'black',
			'synthwave',
			'lofi',
			'pastel',
			'light',
			'dark',
		]
	}
};

module.exports = config;