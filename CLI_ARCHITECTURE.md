# CLI Architecture for @react-marking-menu

> Inspired by shadcn/ui's component distribution pattern

## Philosophy

Instead of shipping styled components as an npm package, we provide a CLI tool that copies component source code directly into users' projects. This gives developers:

- Full ownership of component code
- Complete styling control
- No version lock-in
- Ability to customize without forking

## Overview

```
@react-marking-menu/cli
├── commands/
│   ├── init.ts          # Initialize marking-menu.json config
│   ├── add.ts           # Add components to project
│   └── diff.ts          # Compare local vs registry (future)
├── registry/
│   ├── schema.ts        # Component registry schema
│   ├── index.ts         # Component definitions
│   └── templates/       # Component source templates
├── utils/
│   ├── get-config.ts    # Read marking-menu.json
│   ├── get-project-info.ts  # Detect framework, tsconfig
│   ├── transformers.ts  # Transform import paths
│   └── registry.ts      # Fetch components from registry
└── index.ts             # CLI entry point
```

---

## User Journey

### 1. Installation

```bash
npm install -g @react-marking-menu/cli
# or
npx @react-marking-menu/cli@latest init
```

### 2. Initialization

```bash
npx @react-marking-menu/cli init
```

**Prompts:**
- Which styling solution? (Tailwind / CSS Modules / Styled Components / Emotion)
- Which visual style? (SVG Radial / Canvas / DOM-based)
- TypeScript or JavaScript?
- Where should we put components? (default: `components/ui/marking-menu`)
- Configure import aliases? (default: `@/components`)

**Generates:** `marking-menu.json`

```json
{
  "$schema": "https://react-marking-menu.dev/schema.json",
  "style": "svg-radial",
  "tsx": true,
  "styling": {
    "solution": "tailwind",
    "css": "src/styles/globals.css",
    "cssVariables": true,
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils"
  },
  "paths": {
    "markingMenu": "components/ui/marking-menu"
  }
}
```

### 3. Adding Components

```bash
# Add all styled components
npx @react-marking-menu/cli add

# Add specific components
npx @react-marking-menu/cli add styled-marking-menu
npx @react-marking-menu/cli add styled-menu-item
npx @react-marking-menu/cli add radial-slice

# Add with options
npx @react-marking-menu/cli add --all        # All components
npx @react-marking-menu/cli add --overwrite  # Overwrite existing
```

**What it does:**
1. Reads `marking-menu.json`
2. Fetches component template from registry
3. Transforms imports based on aliases
4. Copies to configured directory
5. Updates CSS with theme variables (if needed)

**Example output:**
```
✓ Created components/ui/marking-menu/styled-marking-menu.tsx
✓ Created components/ui/marking-menu/styled-menu-item.tsx
✓ Created components/ui/marking-menu/radial-slice.tsx
✓ Updated src/styles/globals.css with theme variables

Done! Import components:
  import { StyledMarkingMenu } from "@/components/ui/marking-menu/styled-marking-menu"
```

---

## Component Registry

### Registry Structure

```typescript
// packages/cli/src/registry/schema.ts

export type Registry = {
  name: string
  type: "component" | "hook" | "util"
  dependencies: string[]          // npm dependencies
  registryDependencies: string[]  // other registry components
  files: RegistryFile[]
  styling: StylingOption[]        // which styling solutions it supports
}

export type RegistryFile = {
  name: string                    // filename
  content: string                 // file contents (template)
  type: "component" | "util" | "css"
  target: string                  // where to place it
}

export type StylingOption = "tailwind" | "css-modules" | "styled-components" | "emotion"

export type VisualStyle = "svg-radial" | "canvas" | "dom-based" | "framer-motion"
```

### Component Registry Entry Example

```typescript
// packages/cli/src/registry/index.ts

export const registry: Registry[] = [
  {
    name: "styled-marking-menu",
    type: "component",
    dependencies: [
      "@react-marking-menu/core"
    ],
    registryDependencies: [
      "styled-menu-item",
      "radial-slice"
    ],
    styling: ["tailwind", "css-modules"],
    files: [
      {
        name: "styled-marking-menu.tsx",
        type: "component",
        target: "{markingMenu}/styled-marking-menu.tsx",
        content: `// Component template source...`
      },
      {
        name: "marking-menu.css",
        type: "css",
        target: "{markingMenu}/marking-menu.css",
        content: `/* CSS template */`
      }
    ]
  },
  {
    name: "styled-menu-item",
    type: "component",
    dependencies: [
      "@react-marking-menu/core"
    ],
    registryDependencies: ["radial-slice"],
    styling: ["tailwind", "css-modules"],
    files: [
      {
        name: "styled-menu-item.tsx",
        type: "component",
        target: "{markingMenu}/styled-menu-item.tsx",
        content: `// Component template source...`
      }
    ]
  },
  {
    name: "radial-slice",
    type: "component",
    dependencies: [],
    registryDependencies: [],
    styling: ["tailwind", "css-modules"],
    files: [
      {
        name: "radial-slice.tsx",
        type: "component",
        target: "{markingMenu}/radial-slice.tsx",
        content: `// SVG radial slice component...`
      }
    ]
  }
]
```

---

## Component Templates

### Template Variables

Templates use special markers that get replaced during installation:

- `{@/components}` → Replaced with actual alias from config
- `{markingMenu}` → Replaced with configured path
- `__STYLE_VARIANT__` → Replaced with chosen style (tailwind/css-modules)

### Example Template: SVG Radial Style (Tailwind)

```tsx
// packages/cli/src/registry/templates/svg-radial/tailwind/styled-marking-menu.tsx

"use client"

import * as React from "react"
import {
  MarkingMenu,
  MarkingMenuTrigger,
  MarkingMenuContent,
  type MarkingMenuProps,
} from "@react-marking-menu/core"
import { cn } from "{@/lib}/utils"

interface StyledMarkingMenuProps extends MarkingMenuProps {
  className?: string
  theme?: "light" | "dark"
  size?: "sm" | "md" | "lg"
}

const StyledMarkingMenu = React.forwardRef<
  HTMLDivElement,
  StyledMarkingMenuProps
>(({ className, theme = "light", size = "md", children, ...props }, ref) => {
  return (
    <MarkingMenu {...props}>
      <div
        ref={ref}
        className={cn(
          "marking-menu",
          theme === "dark" && "marking-menu--dark",
          `marking-menu--${size}`,
          className
        )}
      >
        {children}
      </div>
    </MarkingMenu>
  )
})
StyledMarkingMenu.displayName = "StyledMarkingMenu"

export { StyledMarkingMenu }
```

### Example Template: CSS Modules Version

```tsx
// packages/cli/src/registry/templates/svg-radial/css-modules/styled-marking-menu.tsx

"use client"

import * as React from "react"
import {
  MarkingMenu,
  type MarkingMenuProps,
} from "@react-marking-menu/core"
import styles from "./marking-menu.module.css"

interface StyledMarkingMenuProps extends MarkingMenuProps {
  className?: string
  theme?: "light" | "dark"
  size?: "sm" | "md" | "lg"
}

const StyledMarkingMenu = React.forwardRef<
  HTMLDivElement,
  StyledMarkingMenuProps
>(({ className, theme = "light", size = "md", children, ...props }, ref) => {
  return (
    <MarkingMenu {...props}>
      <div
        ref={ref}
        className={[
          styles.markingMenu,
          theme === "dark" && styles.dark,
          styles[size],
          className
        ].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </MarkingMenu>
  )
})
StyledMarkingMenu.displayName = "StyledMarkingMenu"

export { StyledMarkingMenu }
```

---

## CLI Commands Specification

### `init` Command

**Purpose:** Initialize configuration file and dependencies

**Flags:**
- `--yes, -y` - Skip prompts, use defaults
- `--cwd <path>` - Set working directory

**Process:**
1. Check if `marking-menu.json` exists
2. Detect project info (framework, TypeScript, etc.)
3. Prompt for configuration
4. Create `marking-menu.json`
5. Install `@react-marking-menu/core` if not present
6. Add CSS variables to CSS file (if Tailwind)

**Example:**
```bash
npx @react-marking-menu/cli init
```

### `add` Command

**Purpose:** Add components to project

**Usage:**
```bash
marking-menu add [components...] [flags]
```

**Arguments:**
- `components` - Component names (optional, prompts if empty)

**Flags:**
- `--all, -a` - Add all components
- `--overwrite` - Overwrite existing files
- `--cwd <path>` - Set working directory
- `--yes, -y` - Skip confirmation prompts
- `--path <path>` - Custom installation path

**Process:**
1. Read `marking-menu.json`
2. Validate component exists in registry
3. Resolve dependencies (npm + registry)
4. Download component templates
5. Transform import paths
6. Write files to disk
7. Update CSS if needed
8. Report success + usage instructions

**Example:**
```bash
marking-menu add styled-marking-menu styled-menu-item
```

### `diff` Command (Future)

**Purpose:** Compare local components with registry

**Flags:**
- `--component <name>` - Check specific component

**Example:**
```bash
marking-menu diff styled-marking-menu
```

---

## Project Structure After Installation

```
my-app/
├── components/
│   └── ui/
│       └── marking-menu/
│           ├── styled-marking-menu.tsx
│           ├── styled-menu-item.tsx
│           ├── radial-slice.tsx
│           └── marking-menu.css (if CSS modules)
├── lib/
│   └── utils.ts
├── src/
│   └── styles/
│       └── globals.css (updated with CSS variables)
├── marking-menu.json
└── package.json (with @react-marking-menu/core)
```

---

## CSS Variable System

### Tailwind CSS Setup

When user selects Tailwind + CSS variables, the CLI adds:

```css
/* globals.css */

@layer base {
  :root {
    /* Marking Menu Colors */
    --marking-menu-background: 0 0% 100%;
    --marking-menu-foreground: 222.2 84% 4.9%;
    --marking-menu-item: 0 0% 98%;
    --marking-menu-item-hover: 210 40% 96.1%;
    --marking-menu-selected: 222.2 47.4% 11.2%;
    --marking-menu-selected-foreground: 210 40% 98%;
    --marking-menu-border: 214.3 31.8% 91.4%;
    --marking-menu-ring: 222.2 84% 4.9%;

    /* Radial Layout */
    --marking-menu-radius-inner: 60px;
    --marking-menu-radius-outer: 140px;
    --marking-menu-slice-gap: 2px;
  }

  .dark {
    --marking-menu-background: 222.2 84% 4.9%;
    --marking-menu-foreground: 210 40% 98%;
    --marking-menu-item: 217.2 32.6% 17.5%;
    --marking-menu-item-hover: 217.2 32.6% 25%;
    --marking-menu-selected: 210 40% 98%;
    --marking-menu-selected-foreground: 222.2 47.4% 11.2%;
    --marking-menu-border: 217.2 32.6% 17.5%;
    --marking-menu-ring: 212.7 26.8% 83.9%;
  }
}
```

### CSS Modules Setup

```css
/* marking-menu.module.css */

.markingMenu {
  --mm-bg: #ffffff;
  --mm-fg: #0f172a;
  --mm-item: #f8fafc;
  --mm-item-hover: #e2e8f0;
  --mm-selected: #1e293b;
  --mm-selected-fg: #f8fafc;
  --mm-border: #cbd5e1;

  --mm-radius-inner: 60px;
  --mm-radius-outer: 140px;
}

.dark {
  --mm-bg: #0f172a;
  --mm-fg: #f8fafc;
  --mm-item: #1e293b;
  --mm-item-hover: #334155;
  --mm-selected: #f8fafc;
  --mm-selected-fg: #1e293b;
  --mm-border: #334155;
}
```

---

## Visual Styles

### 1. SVG Radial (Default)

**Best for:** Modern web apps, smooth animations, accessibility

**Components:**
- `styled-marking-menu` - Root container
- `styled-menu-content` - SVG radial menu
- `styled-menu-item` - Individual slice
- `radial-slice` - SVG path generator

**Features:**
- Smooth hover transitions
- Crisp rendering at any scale
- Accessible (proper ARIA)
- Customizable colors via CSS variables

### 2. Canvas (Future)

**Best for:** High-performance, game engines, 60fps requirements

**Components:**
- `canvas-marking-menu` - Canvas renderer
- `canvas-menu-item` - Item definitions

**Features:**
- Hardware accelerated
- Lower DOM footprint
- Custom shader support

### 3. DOM-based (Future)

**Best for:** Simple integrations, no SVG/Canvas knowledge

**Components:**
- `dom-marking-menu` - Div-based layout
- `dom-menu-item` - CSS transforms

**Features:**
- Pure HTML/CSS
- Easy to understand
- Larger bundle

### 4. Framer Motion (Future)

**Best for:** Advanced animations, micro-interactions

**Features:**
- Spring animations
- Gesture physics
- Layout animations

---

## Styling Solution Matrix

| Component | Tailwind | CSS Modules | Styled Components | Emotion |
|-----------|----------|-------------|-------------------|---------|
| styled-marking-menu | ✅ | ✅ | 🚧 Future | 🚧 Future |
| styled-menu-item | ✅ | ✅ | 🚧 Future | 🚧 Future |
| radial-slice | ✅ | ✅ | 🚧 Future | 🚧 Future |

**Phase 1 (MVP):** Tailwind + CSS Modules
**Phase 2:** Styled Components, Emotion
**Phase 3:** Vanilla CSS (no build step)

---

## Implementation Phases

### Phase 1: MVP (Week 1-2)

- [x] CLI project setup
- [ ] `init` command with basic prompts
- [ ] `add` command for single component
- [ ] SVG Radial template (Tailwind)
- [ ] SVG Radial template (CSS Modules)
- [ ] Component registry schema
- [ ] Path transformation utils
- [ ] Basic error handling

**Deliverable:** Users can run `init` and `add styled-marking-menu`

### Phase 2: Polish (Week 3)

- [ ] Dependency resolution (npm + registry)
- [ ] Multiple component support
- [ ] CSS variable injection
- [ ] Better error messages
- [ ] Progress indicators
- [ ] TypeScript/JavaScript toggle
- [ ] Overwrite detection

### Phase 3: Enhancement (Week 4)

- [ ] `diff` command
- [ ] Custom registry support
- [ ] Styled Components templates
- [ ] Emotion templates
- [ ] Canvas visual style
- [ ] DOM-based visual style

### Phase 4: Advanced (Future)

- [ ] Private registry authentication
- [ ] Component versioning
- [ ] Migration helpers
- [ ] Interactive component browser
- [ ] VS Code extension

---

## Technical Decisions

### CLI Framework

**Choice:** [commander](https://github.com/tj/commander.js) + [prompts](https://github.com/terkelg/prompts) + [chalk](https://github.com/chalk/chalk)

**Why:**
- Industry standard
- Excellent TypeScript support
- Used by shadcn/ui (proven)
- Great prompt UX

**Alternatives considered:**
- `oclif` - Too heavy
- `yargs` - Older API
- `inquirer` - Less modern than prompts

### Registry Hosting

**Phase 1:** Embedded in npm package (JSON + templates)

**Future:**
- GitHub-based registry (fetch from repo)
- CDN hosting for faster downloads
- Private registry support

### File Transformation

Use AST transformation for reliable import rewriting:

```typescript
import { Project } from "ts-morph"

function transformImports(content: string, aliases: Aliases): string {
  const project = new Project()
  const sourceFile = project.createSourceFile("temp.ts", content)

  sourceFile.getImportDeclarations().forEach((importDecl) => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue()

    // Transform {alias} placeholders
    if (moduleSpecifier.includes("{@/")) {
      const newPath = moduleSpecifier.replace("{@/", aliases.components + "/")
      importDecl.setModuleSpecifier(newPath)
    }
  })

  return sourceFile.getFullText()
}
```

---

## Error Handling

### Common Scenarios

1. **No marking-menu.json found**
   ```
   ❌ Config not found. Run `marking-menu init` first.
   ```

2. **Component already exists**
   ```
   ⚠️  styled-marking-menu.tsx already exists.
       Use --overwrite to replace it.
   ```

3. **Invalid component name**
   ```
   ❌ Component "foo" not found in registry.

       Available components:
         - styled-marking-menu
         - styled-menu-item
         - radial-slice
   ```

4. **Network error**
   ```
   ❌ Failed to fetch component from registry.
       Check your internet connection and try again.
   ```

---

## Testing Strategy

### Unit Tests
- Config parsing
- Import transformation
- Template variable replacement
- Path resolution

### Integration Tests
- Full `init` flow
- Full `add` flow
- Dependency resolution
- File writing

### E2E Tests
- Test in fresh Next.js project
- Test in fresh Vite project
- Test in fresh CRA project
- Verify TypeScript compilation
- Verify components render

---

## Documentation Plan

### CLI Docs (`/docs/cli`)

1. **Installation** - How to install the CLI
2. **Commands** - Reference for all commands
3. **Configuration** - marking-menu.json schema
4. **Components** - Available components catalog
5. **Styling** - How to customize styles
6. **Troubleshooting** - Common issues

### Component Docs (`/docs/components`)

For each component:
- Props API
- Usage examples
- Styling guide
- Accessibility notes
- Examples in different frameworks

---

## Open Questions

1. **Version pinning:** Should we pin @react-marking-menu/core version in templates?
2. **Framework detection:** Auto-detect Next.js app router vs pages router?
3. **Theme presets:** Ship with preset themes (e.g., "minimal", "glass", "neon")?
4. **Component variants:** Allow installing variants (e.g., `add styled-marking-menu/compact`)?
5. **Update strategy:** How do users get updated component versions?

---

## Comparison to shadcn/ui

| Feature | shadcn/ui | @react-marking-menu/cli |
|---------|-----------|------------------------|
| **Config file** | `components.json` | `marking-menu.json` |
| **Component scope** | General UI | Marking menus only |
| **Visual styles** | Single (New York/Default) | Multiple (SVG/Canvas/DOM) |
| **Styling** | Tailwind focused | Multi-solution |
| **Registry** | Public | Embedded (Phase 1) |
| **Framework** | React only | React (future: adapt) |
| **CLI commands** | init, add, diff | Same |

---

## Success Metrics

### Developer Experience
- ⏱️ Time to first component: < 2 minutes
- 📝 Lines of config: < 30 lines
- 🎨 Customization effort: Just edit the file
- 🔧 Setup complexity: 2 commands (`init` + `add`)

### Adoption
- 📦 npm downloads
- ⭐ GitHub stars
- 💬 Community feedback
- 🔨 Production usage

---

## Next Steps

1. **Create CLI package structure** in `packages/cli/`
2. **Implement `init` command** with basic prompts
3. **Create first component template** (SVG Radial + Tailwind)
4. **Build registry schema** and test data
5. **Implement `add` command** for single component
6. **Test in real Next.js project**
7. **Document usage** in README

---

## Resources

- [shadcn/ui Source](https://github.com/shadcn-ui/ui)
- [commander.js](https://github.com/tj/commander.js)
- [prompts](https://github.com/terkelg/prompts)
- [ts-morph](https://github.com/dsherret/ts-morph) - TypeScript AST manipulation
- [JSON Schema](https://json-schema.org/) - Config validation
