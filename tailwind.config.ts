
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
		({ addBase }) => {
			addBase({
				":root": {
					// Dark theme (default)
					"--background": "240 10% 3.9%",
					"--foreground": "0 0% 98%",
					"--card": "240 10% 3.9%",
					"--card-foreground": "0 0% 98%",
					"--popover": "240 10% 3.9%",
					"--popover-foreground": "0 0% 98%",
					"--primary": "0 0% 98%",
					"--primary-foreground": "240 5.9% 10%",
					"--secondary": "240 3.7% 15.9%",
					"--secondary-foreground": "0 0% 98%",
					"--muted": "240 3.7% 15.9%",
					"--muted-foreground": "240 5% 64.9%",
					"--accent": "240 3.7% 15.9%",
					"--accent-foreground": "0 0% 98%",
					"--destructive": "0 62.8% 30.6%",
					"--destructive-foreground": "0 0% 98%",
					"--border": "240 3.7% 15.9%",
					"--input": "240 3.7% 15.9%",
					"--ring": "240 4.9% 83.9%",
					"--radius": "0.75rem",
					
					// Content type colors
					"--task": "142 76% 36%",
					"--task-light": "142 76% 86%",
					"--event": "250 100% 60%",
					"--event-light": "250 100% 90%",
					"--note": "48 100% 50%",
					"--note-light": "48 100% 90%",
					"--mail": "0 100% 60%",
					"--mail-light": "0 100% 90%",
					
					// Sidebar colors
					"--sidebar-background": "240 10% 3.9%",
					"--sidebar-foreground": "0 0% 98%",
					"--sidebar-primary": "0 0% 98%",
					"--sidebar-primary-foreground": "240 5.9% 10%",
					"--sidebar-accent": "240 3.7% 15.9%",
					"--sidebar-accent-foreground": "0 0% 98%",
					"--sidebar-border": "240 3.7% 15.9%",
					"--sidebar-ring": "240 4.9% 83.9%"
				},
				".theme-light": {
					// Light theme
					"--background": "0 0% 100%",
					"--foreground": "240 10% 3.9%",
					"--card": "0 0% 100%",
					"--card-foreground": "240 10% 3.9%",
					"--popover": "0 0% 100%",
					"--popover-foreground": "240 10% 3.9%",
					"--primary": "240 5.9% 10%",
					"--primary-foreground": "0 0% 98%",
					"--secondary": "240 4.8% 95.9%",
					"--secondary-foreground": "240 5.9% 10%",
					"--muted": "240 4.8% 95.9%",
					"--muted-foreground": "240 3.8% 46.1%",
					"--accent": "240 4.8% 95.9%",
					"--accent-foreground": "240 5.9% 10%",
					"--destructive": "0 84.2% 60.2%",
					"--destructive-foreground": "0 0% 98%",
					"--border": "240 5.9% 90%",
					"--input": "240 5.9% 90%",
					"--ring": "240 5.9% 10%",
					
					// Content type colors (slightly darker for light theme)
					"--task": "142 76% 36%",
					"--task-light": "142 76% 86%",
					"--event": "250 100% 60%",
					"--event-light": "250 100% 90%",
					"--note": "48 100% 50%",
					"--note-light": "48 100% 90%",
					"--mail": "0 100% 60%",
					"--mail-light": "0 100% 90%",
					
					// Sidebar colors
					"--sidebar-background": "0 0% 100%",
					"--sidebar-foreground": "240 10% 3.9%",
					"--sidebar-primary": "240 5.9% 10%",
					"--sidebar-primary-foreground": "0 0% 98%",
					"--sidebar-accent": "240 4.8% 95.9%",
					"--sidebar-accent-foreground": "240 5.9% 10%",
					"--sidebar-border": "240 5.9% 90%",
					"--sidebar-ring": "240 5.9% 10%"
				},
				".theme-solarized": {
					// Solarized theme (base on solarized dark)
					"--background": "194 14% 20%", // base03
					"--foreground": "44 12% 72%", // base0
					"--card": "194 14% 20%",  // base03
					"--card-foreground": "44 12% 72%", // base0
					"--popover": "194 14% 20%", // base03
					"--popover-foreground": "44 12% 72%", // base0
					"--primary": "44 12% 72%", // base0
					"--primary-foreground": "194 14% 20%", // base03
					"--secondary": "196 13% 30%", // base02
					"--secondary-foreground": "44 12% 72%", // base0
					"--muted": "196 13% 30%", // base02
					"--muted-foreground": "46 10% 60%", // base01
					"--accent": "196 13% 30%", // base02
					"--accent-foreground": "44 12% 72%", // base0
					"--destructive": "338 85% 53%", // magenta
					"--destructive-foreground": "44 12% 72%", // base0
					"--border": "196 13% 30%", // base02
					"--input": "196 13% 30%", // base02
					"--ring": "42 23% 49%", // yellow
					
					// Content type colors (solarized palette)
					"--task": "135 55% 40%", // green
					"--task-light": "135 55% 80%",
					"--event": "205 82% 45%", // blue
					"--event-light": "205 82% 80%",
					"--note": "42 23% 49%", // yellow
					"--note-light": "42 23% 80%",
					"--mail": "1 79% 50%", // red
					"--mail-light": "1 79% 80%",
					
					// Sidebar colors
					"--sidebar-background": "196 13% 30%", // base02
					"--sidebar-foreground": "44 12% 72%", // base0
					"--sidebar-primary": "44 12% 72%", // base0
					"--sidebar-primary-foreground": "194 14% 20%", // base03
					"--sidebar-accent": "194 14% 35%", // darker base02
					"--sidebar-accent-foreground": "44 12% 72%", // base0
					"--sidebar-border": "196 13% 40%", // lighter base02
					"--sidebar-ring": "42 23% 49%" // yellow
				},
				"*": {
					"@apply border-border": {},
					"scroll-behavior": "smooth"
				},
				"body": {
					"@apply bg-background text-foreground antialiased": {}
				}
			});
		}
	],
} satisfies Config;
