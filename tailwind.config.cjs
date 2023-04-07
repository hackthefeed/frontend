const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {
			fontSize: {
				'10xl': '12rem',
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'full',
					},
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
	daisyui: {
		themes: [
			{
				'light': {
					...require('daisyui/src/colors/themes')['[data-theme=light]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.2) 1px, transparent 0);'
					},
					accent: '#661ae6',
					primary: '#198e84'
				},
			},
			{
				'dark': {
					...require('daisyui/src/colors/themes')['[data-theme=dark]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(70, 70, 70, 0.7) 1px, transparent 0);'
					},
					accent: '#661ae6',
					primary: '#198e84'
				},
			},
			{
				'synthwave': {
					...require('daisyui/src/colors/themes')['[data-theme=synthwave]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(70, 70, 70, 0.7) 1px, transparent 0);'
					}
				},
			},
			{
				'lemonade': {
					...require('daisyui/src/colors/themes')['[data-theme=lemonade]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.2) 1px, transparent 0);'
					},
					accent: '#dec566'
				},
			},
			{
				'autumn': {
					...require('daisyui/src/colors/themes')['[data-theme=autumn]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.2) 1px, transparent 0);'
					}
				},
			},
			{
				'valentine': {
					...require('daisyui/src/colors/themes')['[data-theme=valentine]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.2) 1px, transparent 0);'
					}
				},
			},
			{
				'aqua': {
					...require('daisyui/src/colors/themes')['[data-theme=aqua]'],
					'.bg-gradient-dots': {
						'background-image': 'radial-gradient(circle at 1px 1px, rgba(70, 70, 70, 0.7) 1px, transparent 0);'
					}
				},
			},
		]
	}
};

module.exports = config;