/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
				abyss: {
					900: '#1A2126',
					800: '#1C2831',
					700: '#253541',
					600: '#233643',
					500: '#2A4150',
					400: '#314C5E'
				},
				brown: {
					50: '#fdf8f6',
					100: '#f2e8e5',
					200: '#eaddd7',
					300: '#e0cec7',
					400: '#d2bab0',
					500: '#bfa094',
					600: '#a18072',
					700: '#977669',
					800: '#846358',
					900: '#43302b',
				},
				
				rich: '#12131C',
				raisin: '#242436',
				space: '#28293D',
				'off-gray': '#222227',
				goldenrod: '#B69047',
				gold: '#865903',
				eggshell: '#F4F1DE',
				'off-white': '#FCFCFC',
			},
      fontFamily: {
				homenaje: ['Homenaje', 'sans-serif'],
        exo: ['Exo Variable', 'sans-serif'],
        marcellus: ['Marcellus', 'serif'],
			},
    },
  },
  plugins: [],
}

