/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'error-container': '#ffdad6',
        'on-tertiary-container': '#ffede6',
        error: '#ba1a1a',
        secondary: '#585f67',
        'on-primary-fixed': '#00174b',
        'on-primary-container': '#eeefff',
        'on-error': '#ffffff',
        'tertiary-container': '#bc4800',
        'on-tertiary-fixed': '#360f00',
        outline: '#737686',
        'inverse-surface': '#2e3039',
        'primary-container': '#2563eb',
        'surface-bright': '#faf8ff',
        'on-secondary-fixed': '#151c23',
        tertiary: '#943700',
        'inverse-on-surface': '#f0f0fb',
        'on-tertiary': '#ffffff',
        'surface-tint': '#0053db',
        surface: '#faf8ff',
        'surface-container-highest': '#e1e2ed',
        'primary-fixed-dim': '#b4c5ff',
        'surface-variant': '#e1e2ed',
        'on-primary-fixed-variant': '#003ea8',
        'surface-container-low': '#f3f3fe',
        'tertiary-fixed-dim': '#ffb596',
        'on-background': '#191b23',
        'secondary-container': '#dce3ec',
        'on-secondary': '#ffffff',
        'surface-container': '#ededf9',
        'tertiary-fixed': '#ffdbcd',
        'on-surface-variant': '#434655',
        'secondary-fixed-dim': '#c0c7d0',
        'on-secondary-container': '#5e656d',
        'surface-dim': '#d9d9e5',
        'on-primary': '#ffffff',
        'outline-variant': '#c3c6d7',
        'inverse-primary': '#b4c5ff',
        'on-tertiary-fixed-variant': '#7d2d00',
        'primary-fixed': '#dbe1ff',
        'surface-container-high': '#e7e7f3',
        'surface-container-lowest': '#ffffff',
        'secondary-fixed': '#dce3ec',
        'on-secondary-fixed-variant': '#40484f',
        'on-surface': '#191b23',
        'on-error-container': '#93000a',
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        card: 'hsl(var(--card))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          soft: 'hsl(var(--primary-soft))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          soft: 'hsl(var(--success-soft))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          soft: 'hsl(var(--warning-soft))'
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          soft: 'hsl(var(--danger-soft))'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
        sm: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        base: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        lg: ['18px', { lineHeight: '28px', fontWeight: '500' }],
        xl: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        '2xl': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        '3xl': ['30px', { lineHeight: '38px', fontWeight: '700' }],
        '4xl': ['36px', { lineHeight: '44px', fontWeight: '700' }]
      },
      spacing: {
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '24px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        'container-max': '1280px'
      },
      maxWidth: {
        'container-max': '1280px'
      },
      boxShadow: {
        panel: '0 1px 2px rgba(15, 23, 42, 0.08), 0 8px 30px rgba(15, 23, 42, 0.04)'
      }
    }
  },
  plugins: []
}
