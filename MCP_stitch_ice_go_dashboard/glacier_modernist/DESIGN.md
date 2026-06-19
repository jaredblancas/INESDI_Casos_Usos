---
name: Glacier Modernist
colors:
  surface: '#f6faff'
  surface-dim: '#d6dae0'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4fa'
  surface-container: '#eaeef4'
  surface-container-high: '#e4e8ee'
  surface-container-highest: '#dee3e9'
  on-surface: '#171c20'
  on-surface-variant: '#3e4850'
  inverse-surface: '#2c3135'
  inverse-on-surface: '#edf1f7'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#8a5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#de8712'
  on-tertiary-container: '#4d2b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#f6faff'
  on-background: '#171c20'
  surface-variant: '#dee3e9'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1440px
  gutter: 24px
  sidebar-width: 240px
---

## Brand & Style

The design system is built for "ICE-GO," a specialized CRM for ice cream business administration. It balances the playful nature of the product with the rigorous utility required for enterprise logistics, inventory, and customer management. 

The aesthetic is **Modern Minimalism**, drawing heavy inspiration from high-performance tools like Linear. It prioritizes clarity, speed, and focus through generous whitespace, a constrained color palette, and a sophisticated typographic hierarchy. The emotional response should be one of "effortless precision"—cool, refreshing, and highly organized.

## Colors

The palette is anchored by a vibrant **Glacier Cyan** (#0EA5E9) used sparingly for primary actions, progress indicators, and active states. This color provides a high-energy contrast against a neutral, "cool-white" environment.

- **Primary:** Glacier Cyan for brand presence and intent.
- **Surface & Background:** A hierarchy of whites (Pure White for cards) and soft grays (Slate-50 for page backgrounds) to create a subtle sense of depth without relying on heavy shadows.
- **Neutral/Slate:** Used for text and UI borders to maintain a professional, tech-forward feel.
- **Success/Warning/Error:** Standard functional colors are desaturated to match the minimalist aesthetic, ensuring they inform the user without breaking the calm environment.

## Typography

The design system utilizes **Inter** for all functional and display text. Inter’s tall x-height and exceptional legibility at small sizes make it ideal for data-heavy CRM interfaces. 

- **Display & Headlines:** Use tighter letter spacing and semi-bold weights to create a "tight," professional look typical of modern SaaS.
- **Body Text:** Standardized at 14px for density and 16px for long-form content.
- **Labels:** Small, uppercase labels with slight letter spacing are used for table headers and metadata to distinguish them from actionable content.
- **Monospaced:** JetBrains Mono is used as a secondary font for SKU numbers, inventory codes, and price lists to ensure character alignment.

## Layout & Spacing

The design system employs a **Flexible Grid System** with a strict 4px baseline. 

- **Sidebar Navigation:** A fixed left-hand navigation (240px) provides consistent access to modules (Inventory, Logistics, Clients).
- **Page Layout:** Content is housed within a fluid container with a maximum width of 1440px to prevent excessive line lengths on ultra-wide monitors.
- **Density:** The CRM defaults to a "Comfortable" density (16px padding inside cards), but components are designed to support a "Compact" mode (8px padding) for data-heavy views like order tables.
- **Breakpoints:** 
    - Desktop: 1200px+ (12 columns)
    - Tablet: 768px - 1199px (8 columns, sidebar collapses to icons)
    - Mobile: <767px (4 columns, sidebar moves to a bottom-sheet or hamburger menu).

## Elevation & Depth

To maintain a minimalist profile, this design system rejects heavy, dark shadows in favor of **Tonal Layering** and **Ambient Depth**.

1.  **Level 0 (Background):** Slate-50. The base canvas.
2.  **Level 1 (Cards/Surface):** Pure White. Used for primary content containers. These use a very subtle, light blue-tinted shadow: `0 1px 3px 0 rgba(14, 165, 233, 0.05), 0 1px 2px -1px rgba(14, 165, 233, 0.05)`.
3.  **Level 2 (Popovers/Modals):** Pure White with a slightly more pronounced shadow and a 1px border (#E2E8F0) to ensure separation from the page content.
4.  **Interaction:** Elements like buttons or cards may use a slight "lift" on hover, achieved by increasing the shadow spread and reducing border opacity.

## Shapes

The shape language is **Refined & Rounded**. It avoids the aggression of sharp corners while maintaining the structural integrity of a professional tool.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Large Elements (Cards, Modals):** 1rem (16px) corner radius.
- **Badges/Chips:** Fully pill-shaped (999px) to contrast against the more structural card layouts.

## Components

### Buttons
Primary buttons use the Glacier Cyan fill with white text. Secondary buttons use a white background with a Slate-200 border and Slate-900 text. All buttons have a height of 36px (standard) or 44px (large/mobile).

### Cards
Cards are the primary organizational unit. They feature a 1px border (#E2E8F0) and the Level 1 shadow. Header sections within cards are separated by a subtle horizontal rule.

### Input Fields
Inputs use a "Flat" style. Background is Slate-50 in its rest state, turning Pure White with a 2px Glacier Cyan border on focus. Labels are always positioned above the input field in `label-md` style.

### Data Tables
Tables are borderless, using horizontal dividers only. Rows feature a subtle Glacier Cyan background tint (#F0F9FF) on hover to assist with tracking data across columns.

### Status Chips
Inventory and order status are shown in low-contrast chips (e.g., "In Stock" is a light green background with dark green text) to avoid overwhelming the user with "traffic light" colors.

### The "Flavor" Badge
A unique component for this system—a small circular color swatch next to inventory items to visually represent ice cream flavors (e.g., Mint, Chocolate, Vanilla) at a glance.