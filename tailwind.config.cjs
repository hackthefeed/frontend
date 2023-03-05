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
		require('flowbite/plugin')
	],
	darkMode: 'media',
};

module.exports = config;