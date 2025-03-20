
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				jakarta: [
					'Plus Jakarta Sans',
					'SF Pro Display', 
					'Inter', 
					'system-ui', 
					'sans-serif'
				],
				sans: [
					'Plus Jakarta Sans',
					'SF Pro Display', 
					'Inter', 
					'system-ui', 
					'sans-serif'
				],
				mono: [
					'SF Mono', 
					'JetBrains Mono', 
					'monospace'
				],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				task: {
					DEFAULT: 'hsl(var(--task))',
					light: 'hsl(var(--task-light))',
				},
				event: {
					DEFAULT: 'hsl(var(--event))',
					light: 'hsl(var(--event-light))',
				},
				note: {
					DEFAULT: 'hsl(var(--note))',
					light: 'hsl(var(--note-light))',
				},
				mail: {
					DEFAULT: 'hsl(var(--mail))',
					light: 'hsl(var(--mail-light))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' },
				},
				'slide-out-left': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'pulse': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(var(--primary), 0)' },
					'50%': { boxShadow: '0 0 0 8px rgba(var(--primary), 0.2)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-left': 'slide-out-left 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'pulse': 'pulse 1.5s ease-in-out',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addBase, theme }) {
			addBase({
				':root': {
					'--background': '0 0% 100%',
					'--foreground': '222.2 84% 4.9%',
					'--card': '0 0% 100%',
					'--card-foreground': '222.2 84% 4.9%',
					'--popover': '0 0% 100%',
					'--popover-foreground': '222.2 84% 4.9%',
					'--primary': '222.2 47.4% 11.2%',
					'--primary-foreground': '210 40% 98%',
					'--secondary': '210 40% 96.1%',
					'--secondary-foreground': '222.2 47.4% 11.2%',
					'--muted': '210 40% 96.1%',
					'--muted-foreground': '215.4 16.3% 46.9%',
					'--accent': '210 40% 96.1%',
					'--accent-foreground': '222.2 47.4% 11.2%',
					'--destructive': '0 84.2% 60.2%',
					'--destructive-foreground': '210 40% 98%',
					'--border': '214.3 31.8% 91.4%',
					'--input': '214.3 31.8% 91.4%',
					'--ring': '222.2 84% 4.9%',
					'--radius': '1rem',
					'--sidebar-background': '0 0% 98%',
					'--sidebar-foreground': '240 5.3% 26.1%',
					'--sidebar-primary': '240 5.9% 10%',
					'--sidebar-primary-foreground': '0 0% 98%',
					'--sidebar-accent': '240 4.8% 95.9%',
					'--sidebar-accent-foreground': '240 5.9% 10%',
					'--sidebar-border': '220 13% 91%',
					'--sidebar-ring': '217.2 91.2% 59.8%',
					'--task': '280 90% 65%',
					'--task-light': '280 100% 93%',
					'--event': '200 95% 60%',
					'--event-light': '200 100% 93%',
					'--note': '150 76% 45%',
					'--note-light': '150 76% 93%',
					'--mail': '25 95% 55%',
					'--mail-light': '25 100% 93%',
					'color-scheme': 'light',
				},
				'.dark': {
					'--background': '25 40% 20%',
					'--foreground': '210 40% 98%',
					'--card': '25 30% 20%',
					'--card-foreground': '210 40% 98%',
					'--popover': '160 25% 19%',
					'--popover-foreground': '210 40% 98%',
					'--primary': '210 40% 98%',
					'--primary-foreground': '222.2 47.4% 11.2%',
					'--secondary': '223 36% 24%',
					'--secondary-foreground': '210 40% 98%',
					'--muted': '25 40% 10%',
					'--muted-foreground': '215 20.2% 65.1%',
					'--accent': '223 36% 24%',
					'--accent-foreground': '210 40% 98%',
					'--destructive': '0 62.8% 30.6%',
					'--destructive-foreground': '210 40% 98%',
					'--border': '217 36% 20%',
					'--input': '217 36% 20%',
					'--ring': '212.7 26.8% 83.9%',
					'--sidebar-background': '222 25% 21%',
					'--sidebar-foreground': '240 4.8% 95.9%',
					'--sidebar-primary': '224.3 76.3% 48%',
					'--sidebar-primary-foreground': '0 0% 100%',
					'--sidebar-accent': '222 25% 16%',
					'--sidebar-accent-foreground': '240 4.8% 95.9%',
					'--sidebar-border': '222 25% 16%',
					'--sidebar-ring': '217.2 91.2% 59.8%',
					'--task': '280 90% 65%',
					'--task-light': '280 30% 30%',
					'--event': '200 90% 60%',
					'--event-light': '200 30% 30%',
					'--note': '150 70% 45%',
					'--note-light': '150 30% 25%',
					'--mail': '25 90% 55%',
					'--mail-light': '25 30% 30%',
					'color-scheme': 'dark',
				},
				'*': {
					'@apply border-border': {},
				},
				'body': {
					'@apply bg-background text-foreground font-jakarta dark': {},
				},
				'::-webkit-scrollbar': {
					'@apply w-1.5 h-1.5': {},
				},
				'::-webkit-scrollbar-track': {
					'@apply bg-transparent': {},
				},
				'::-webkit-scrollbar-thumb': {
					'@apply bg-muted-foreground/20 rounded-full': {},
				},
				'::-webkit-scrollbar-thumb:hover': {
					'@apply bg-muted-foreground/40': {},
				},
				':focus-visible': {
					'@apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background': {},
				},
				'h1, h2, h3, h4, h5, h6': {
					'@apply font-medium tracking-tight': {},
				},
			});
			addBase({
				'@import': ["url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap')"],
			});
			addComponents({
				'.content-item': {
					'@apply relative flex flex-col bg-card rounded-xl border border-border p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-scale-in': {},
				},
				'.content-item-header': {
					'@apply flex items-center justify-between mb-2': {},
				},
				'.content-item-tag': {
					'@apply text-xs px-2.5 py-0.5 rounded-full font-medium': {},
				},
				'.content-item-body': {
					'@apply flex-1': {},
				},
				'.content-item-footer': {
					'@apply flex items-center justify-between mt-2 pt-2 border-t border-border/50': {},
				},
				'.glass-panel': {
					'@apply bg-background/80 backdrop-blur-md border border-border/50 rounded-xl shadow-sm': {},
				},
				'.sidebar-item': {
					'@apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted': {},
				},
				'.sidebar-item.active': {
					'@apply bg-primary text-primary-foreground hover:bg-primary/90': {},
				},
				'.content-task': {
					'@apply border-l-4 border-task': {},
				},
				'.content-event': {
					'@apply border-l-4 border-event': {},
				},
				'.content-note': {
					'@apply border-l-4 border-note': {},
				},
				'.content-mail': {
					'@apply border-l-4 border-mail': {},
				},
				'.content-link': {
					'@apply text-primary underline cursor-pointer': {},
				},
				'.highlight-pulse': {
					'@apply animate-pulse': {},
				},
				'.list-content-item:not(:last-child)': {
					'@apply border-b border-border': {},
				},
				'.list-content-item:hover': {
					'@apply bg-muted': {},
				},
			});
		}
	],
} satisfies Config;
