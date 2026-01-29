# Azure Certification Prep App — Complete Prompt Engineering Document

> **Purpose**: This document serves as a comprehensive specification and prompt template to guide AI-assisted development of an Azure certification exam preparation application for iOS and Web platforms.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Design System](#3-design-system)
4. [Feature Specifications](#4-feature-specifications)
5. [Question Types & Formats](#5-question-types--formats)
6. [Exam Mode Specifications](#6-exam-mode-specifications)
7. [Data Models (Convex Schema)](#7-data-models-convex-schema)
8. [API & Backend Logic](#8-api--backend-logic)
9. [Screen-by-Screen Prompts](#9-screen-by-screen-prompts)
10. [Question Generation Prompts](#10-question-generation-prompts)
11. [Animation & UX Guidelines](#11-animation--ux-guidelines)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)

---

## 1. Project Overview

### 1.1 Product Vision

Build a mobile-first exam preparation platform that replicates the authentic Microsoft Azure certification exam experience for:

| Exam Code | Exam Name | Level | Time Limit | Questions | Passing Score |
|-----------|-----------|-------|------------|-----------|---------------|
| **AZ-900** | Azure Fundamentals | Foundational | 45 min | 40-60 | 700/1000 |
| **AZ-104** | Azure Administrator | Associate | 120 min | 40-60 | 700/1000 |
| **AZ-305** | Azure Solutions Architect Expert | Expert | 120 min | 40-60 | 700/1000 |

### 1.2 Target Users

- IT professionals seeking Azure certifications
- Career switchers entering cloud computing
- Students and recent graduates
- Enterprise employees upskilling

### 1.3 Core Value Propositions

1. **Authentic Exam Simulation** — Mirror Microsoft's actual question formats and delivery
2. **Adaptive Learning** — Learn mode with immediate feedback and explanations
3. **Progress Tracking** — Visual analytics on strengths and weaknesses
4. **Grind-Friendly UX** — Designed for extended study sessions (hours of use)

---

## 2. Technical Architecture

### 2.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  iOS App          │  Web App                                │
│  - React Native   │  - React Native Web (via Expo)          │
│  - Expo SDK 51+   │  - Same codebase, web target            │
│  - Expo Router    │  - Expo Router (file-based routing)     │
│  - React Native   │  - NativeWind (Tailwind for RN)         │
│    Reanimated 3   │  - React Native Reanimated              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Convex)                         │
├─────────────────────────────────────────────────────────────┤
│  • Real-time database                                        │
│  • Server functions (queries, mutations, actions)            │
│  • Convex Auth (built-in authentication)                     │
│     - Email/Password                                         │
│     - OAuth (Google, GitHub, Apple)                          │
│     - Magic Links                                            │
│  • File storage (for images in questions)                    │
│  • Scheduled functions (streak tracking, reminders)          │
└─────────────────────────────────────────────────────────────┘
```

### 2.1.1 Package Dependencies

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-status-bar": "~1.12.1",
    "expo-haptics": "~13.0.1",
    "expo-secure-store": "~13.0.1",
    "expo-auth-session": "~5.5.2",
    "expo-web-browser": "~13.0.3",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "react-native-web": "~0.19.10",
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "react-native-safe-area-context": "~4.10.1",
    "nativewind": "^4.0.0",
    "convex": "^1.10.0",
    "@convex-dev/auth": "^0.0.50",
    "react-native-svg": "~15.2.0",
    "@react-native-async-storage/async-storage": "~1.23.1"
  }
}
```

### 2.2 Convex Project Structure

```
convex/
├── schema.ts                 # Database schema definitions
├── auth.ts                   # Convex Auth configuration
├── auth.config.ts            # Auth providers config
├── http.ts                   # HTTP routes for auth
├── questions.ts              # Question CRUD operations
├── exams.ts                  # Exam session management
├── progress.ts               # User progress tracking
├── analytics.ts              # Performance analytics
├── leaderboard.ts            # Optional: competitive features
└── _generated/               # Auto-generated types
```

### 2.3 Frontend Project Structure (Expo Router)

```
app/
├── _layout.tsx               # Root layout with providers
├── index.tsx                 # Entry redirect
├── (auth)/                   # Authentication flows (unprotected)
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── forgot-password.tsx
├── (app)/                    # Main app screens (protected)
│   ├── _layout.tsx           # Protected layout with auth check
│   ├── (tabs)/               # Tab navigation
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── progress.tsx
│   │   └── settings.tsx
│   ├── exam/
│   │   ├── [examId]/
│   │   │   ├── learn.tsx
│   │   │   ├── mock.tsx
│   │   │   └── timed.tsx
│   ├── question/[id].tsx
│   └── results/[sessionId].tsx
components/
├── questions/                # Question type components
│   ├── SingleChoice.tsx
│   ├── MultipleChoice.tsx
│   ├── DragAndDrop.tsx
│   ├── FillInBlank.tsx
│   ├── CaseStudy.tsx
│   └── TrueFalse.tsx
├── exam/                     # Exam UI components
│   ├── Timer.tsx
│   ├── QuestionNavigator.tsx
│   └── ProgressBar.tsx
├── ui/                       # Shared UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Modal.tsx
└── auth/                     # Auth components
    ├── SignInForm.tsx
    ├── SignUpForm.tsx
    └── OAuthButtons.tsx
hooks/
├── useAuth.ts                # Auth hook wrapper
├── useExamSession.ts
└── useProgress.ts
lib/
├── convex.ts                 # Convex client config
├── animations.ts             # Reanimated presets
└── haptics.ts                # Haptic feedback utils
```

---

## 3. Design System

### 3.1 Color Palette

```css
:root {
  /* Primary Gradient Spectrum (Hot Pink → Cyan) */
  --color-pink-hot:     #f72585;  /* Primary accent, CTAs */
  --color-pink-deep:    #b5179e;  /* Secondary accent */
  --color-purple-vivid: #7209b7;  /* Tertiary */
  --color-purple-dark:  #560bad;  /* Headers, emphasis */
  --color-indigo-deep:  #480ca8;  /* Active states */
  --color-indigo:       #3a0ca3;  /* Borders, lines */
  --color-blue-vivid:   #3f37c9;  /* Interactive elements */
  --color-blue:         #4361ee;  /* Links, buttons */
  --color-blue-light:   #4895ef;  /* Highlights */
  --color-cyan:         #4cc9f0;  /* Success, correct answers */

  /* Semantic Colors */
  --color-correct:      #4cc9f0;  /* Correct answer glow */
  --color-incorrect:    #f72585;  /* Wrong answer */
  --color-warning:      #ffc107;  /* Time warnings */
  
  /* Neutrals (Dark Theme) */
  --color-bg-primary:   #0a0a0f;  /* Main background */
  --color-bg-secondary: #12121a;  /* Card backgrounds */
  --color-bg-tertiary:  #1a1a2e;  /* Elevated surfaces */
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255,255,255,0.7);
  --color-text-muted:   rgba(255,255,255,0.4);
}
```

### 3.2 Gradient Definitions

```css
/* Primary gradients for buttons, headers */
.gradient-primary {
  background: linear-gradient(135deg, #f72585 0%, #7209b7 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #3f37c9 0%, #4cc9f0 100%);
}

.gradient-accent {
  background: linear-gradient(90deg, #f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0);
}

/* Glow effects */
.glow-pink {
  box-shadow: 0 0 40px rgba(247, 37, 133, 0.3);
}

.glow-cyan {
  box-shadow: 0 0 40px rgba(76, 201, 240, 0.3);
}
```

### 3.3 Typography

```css
/* Font Stack */
--font-display: 'Space Grotesk', 'SF Pro Display', sans-serif;
--font-body: 'Inter', 'SF Pro Text', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;

/* Scale */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
```

### 3.4 Component Style Guidelines

| Component | Style Rules |
|-----------|-------------|
| **Cards** | `bg-bg-secondary`, `border border-white/5`, `rounded-2xl`, subtle gradient overlay |
| **Buttons (Primary)** | Gradient background, `rounded-xl`, press animation scale to 0.97 |
| **Buttons (Secondary)** | Glass morphism, `backdrop-blur-lg`, border glow on hover |
| **Inputs** | Dark background, focus ring with gradient border |
| **Progress Bars** | Animated gradient fill, subtle pulse animation |
| **Icons** | Lucide React icons, stroke-width 1.5-2 |

---

## 4. Feature Specifications

### 4.1 Core Features Matrix

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Auth** | User accounts via Convex Auth | [x] |
| **Exams** | Learn, Mock, & Timed Modes | [x] |
| **Content** | Single Choice, Multi, D&D, Hotspot | [x] |
| **Stats** | Charts & Weak Areas | [x] |
| **Admin** | Add Question Interface | [x] |

### 4.2 User Flow Diagram

```
┌──────────────┐
│   Onboarding │
└──────┬───────┘
       ▼
┌──────────────┐
│  Select Exam │ ← AZ-900 / AZ-104 / AZ-305
└──────┬───────┘
       ▼
┌──────────────┐
│  Dashboard   │ ← Progress, stats, continue button
└──────┬───────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Learn Mode │ │ Mock Exam  │ │ Timed Exam │
└─────┬──────┘ └─────┬──────┘ └─────┬──────┘
      │              │              │
      ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Question + │ │ All Qs     │ │ All Qs     │
│ Feedback   │ │ Then Score │ │ Timer      │
└────────────┘ └────────────┘ └────────────┘
```

### 4.3 Dashboard Components

1. **Exam Selector Cards** — Three cards for AZ-900, AZ-104, AZ-305
2. **Progress Ring** — Overall completion percentage
3. **Streak Counter** — Days of consecutive study
4. **Quick Stats** — Questions answered, accuracy rate, time spent
5. **Domain Breakdown** — Radar/spider chart of domain performance
6. **Recent Activity** — Last 5 sessions with scores
7. **Continue Button** — Resume last incomplete session

---

## 5. Question Types & Formats

### 5.1 Single-Choice (Multiple Choice - One Answer)

**Microsoft Format**: Select one correct answer from 4 options.

```typescript
interface SingleChoiceQuestion {
  id: string;
  type: 'single-choice';
  examCode: 'AZ-900' | 'AZ-104' | 'AZ-305';
  domain: string;
  subdomain?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];              // Exactly 4 options
  correctIndex: number;           // 0-3
  explanation: string;
  references?: string[];          // Microsoft Learn links
  imageUrl?: string;              // Optional diagram/screenshot
}
```

**UI Behavior**:

- Radio button selection
- One selection allowed at a time
- Selected option highlighted with gradient border
- Learn mode: Show correct/incorrect immediately with explanation

---

### 5.2 Multiple-Choice (Multiple Answers)

**Microsoft Format**: Select ALL correct answers (usually "Select 2" or "Select 3").

```typescript
interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  examCode: 'AZ-900' | 'AZ-104' | 'AZ-305';
  domain: string;
  difficulty: 'medium' | 'hard';
  question: string;
  instruction: string;            // "Select 2" or "Select all that apply"
  options: string[];              // 4-6 options
  correctIndices: number[];       // Array of correct indices
  explanation: string;
  partialCredit: boolean;         // Whether partial answers get points
}
```

**UI Behavior**:

- Checkbox selection
- Display required selection count prominently
- Visual counter: "Selected: 2/3"
- Disable submit until correct number selected (if specified)

---

### 5.3 Drag-and-Drop (Matching / Ordering)

**Microsoft Format**: Match items from left column to right column, OR arrange steps in correct order.

```typescript
interface DragDropQuestion {
  id: string;
  type: 'drag-drop';
  subtype: 'matching' | 'ordering';
  examCode: 'AZ-900' | 'AZ-104' | 'AZ-305';
  domain: string;
  difficulty: 'medium' | 'hard';
  question: string;
  instruction: string;
  
  // For matching type
  sourceItems?: { id: string; label: string }[];
  targetZones?: { id: string; label: string; acceptsItemId: string }[];
  
  // For ordering type
  itemsToOrder?: { id: string; label: string; correctPosition: number }[];
  
  explanation: string;
}
```

**UI Behavior**:

- Smooth drag animations (react-beautiful-dnd or dnd-kit)
- Visual drop zones with highlight on hover
- Snap-to-place animation
- Mobile: Long-press to drag OR tap-to-select then tap-destination

---

### 5.4 Fill-in-the-Blank (Dropdown / Hotspot)

**Microsoft Format**: Complete a sentence/command by selecting from dropdown options.

```typescript
interface FillInBlankQuestion {
  id: string;
  type: 'fill-blank';
  examCode: 'AZ-900' | 'AZ-104' | 'AZ-305';
  domain: string;
  difficulty: 'medium' | 'hard';
  
  // Template with placeholders: "Use the {{0}} command to {{1}} a resource group"
  questionTemplate: string;
  
  blanks: {
    index: number;
    options: string[];
    correctIndex: number;
  }[];
  
  explanation: string;
}
```

**UI Behavior**:

- Inline dropdown selectors styled to match theme
- Clear visual indication of blanks
- Selected values shown inline
- Code blocks styled with monospace font

---

### 5.5 Case Study (Scenario-Based)

**Microsoft Format**: Long scenario with multiple related questions. Scenario stays visible while answering questions.

```typescript
interface CaseStudyQuestion {
  id: string;
  type: 'case-study';
  examCode: 'AZ-104' | 'AZ-305';  // Not common in AZ-900
  domain: string;
  
  scenario: {
    title: string;
    background: string;           // Company description
    currentEnvironment: string;   // Technical details
    requirements: string[];       // Business/technical requirements
    diagrams?: string[];          // Image URLs for architecture diagrams
  };
  
  questions: {
    id: string;
    question: string;
    type: 'single-choice' | 'multiple-choice' | 'yes-no-series';
    options?: string[];
    correctAnswer: number | number[] | boolean[];
    explanation: string;
  }[];
}
```

**UI Behavior**:

- Split view: Scenario on left/top, questions on right/bottom
- Collapsible scenario sections
- Tabs for different scenario sections (Overview, Environment, Requirements)
- Sticky scenario header on mobile
- Progress indicator for questions within case study

---

### 5.6 True/False (Yes/No Series - Hotspot)

**Microsoft Format**: Series of statements where user marks each as Yes/No or True/False.

```typescript
interface TrueFalseQuestion {
  id: string;
  type: 'true-false';
  subtype: 'single' | 'series';
  examCode: 'AZ-900' | 'AZ-104' | 'AZ-305';
  domain: string;
  
  // Context shown above statements
  context?: string;
  
  statements: {
    id: string;
    text: string;
    correctAnswer: boolean;
    explanation: string;
  }[];
}
```

**UI Behavior**:

- Two-column layout: Statement | Yes/No toggle
- Toggle switches or segmented control
- Each row independent
- Series scored as a group (all or nothing) OR individually

---

## 6. Exam Mode Specifications

### 6.1 Learn Mode

**Purpose**: Study one question at a time with immediate feedback and detailed explanations.

```
┌─────────────────────────────────────────┐
│  Learn Mode — AZ-900                    │
│  Domain: Cloud Concepts                 │
├─────────────────────────────────────────┤
│                                         │
│  Question 15 of 150                     │
│  ═══════════════════════░░░░░░░░░░░░░░  │
│                                         │
│  Which cloud model requires the LEAST   │
│  management by the customer?            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ○  IaaS                         │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ ○  PaaS                         │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ ● SaaS  ✓                       │ ←── Selected & Correct
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ ○  On-premises                  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 💡 EXPLANATION                   │    │
│  │                                  │    │
│  │ SaaS (Software as a Service)    │    │
│  │ requires the least management.  │    │
│  │ The provider handles all infra, │    │
│  │ platform, and application...    │    │
│  │                                  │    │
│  │ 📚 Learn more: [MS Learn Link]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│         [ ← Previous ]  [ Next → ]      │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior Specification**:

| Action | Result |
|--------|--------|
| Select answer | Immediately show correct/incorrect |
| Correct answer | Green glow, confetti animation, +XP |
| Incorrect answer | Red shake, show correct answer highlighted |
| Show explanation | Slide-up panel with detailed explanation |
| Next button | Advance to next question |
| Previous button | Return to previous (already answered) |
| Exit | Save progress, return to dashboard |

**Progress Persistence**:

- Save after each question
- Track: question ID, user answer, correct/incorrect, time spent
- Resume from last unanswered question

---

### 6.2 Mock Exam Mode

**Purpose**: Simulate exam experience without time pressure. Review all answers at the end.

```
┌─────────────────────────────────────────┐
│  Mock Exam — AZ-104                     │
│  Question 23 of 50                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Question Navigator               │   │
│  │ [1][2][3][4][5][6][7][8][9][10] │   │
│  │ [●][●][●][○][○][●][○][○][○][○]  │   │ ← ● = answered
│  │ [11-20] [21-30] [31-40] [41-50]  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  You need to configure Azure AD...      │
│                                         │
│  [ Options here... ]                    │
│                                         │
│  ┌────────────────┐  ┌────────────────┐ │
│  │ 🚩 Flag        │  │ ▶ Skip         │ │
│  └────────────────┘  └────────────────┘ │
│                                         │
│  [ ← Back ]               [ Next → ]    │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │     [ Submit Exam for Review ]   │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior Specification**:

| Feature | Behavior |
|---------|----------|
| Navigation | Free jump to any question via navigator |
| Flag question | Mark for review, shows in navigator |
| Skip | Move to next without answering |
| Timer | Optional, shown if enabled in settings |
| Pause | Allowed — pauses timer and hides questions |
| Submit | Confirm dialog → Score screen |
| Review mode | After submit, can review each Q with explanations |

**Post-Exam Review Screen**:

- Overall score (X/1000 scale)
- Pass/Fail indicator (700 = pass)
- Domain breakdown bar chart
- List of incorrect questions with explanations
- Option to retry incorrect questions only

---

### 6.3 Timed Exam Mode

**Purpose**: Full exam simulation with countdown timer matching actual Microsoft exam.

```
┌─────────────────────────────────────────┐
│  ⏱ 01:23:45 remaining        [Pause ❌] │
├─────────────────────────────────────────┤
│  Timed Exam — AZ-305                    │
│  Question 15 of 50                      │
│                                         │
│  CASE STUDY: Contoso Ltd Migration      │
│  ┌──────────────────────────────────┐   │
│  │ Background | Environment | Reqs  │   │ ← Tabs
│  ├──────────────────────────────────┤   │
│  │ Contoso Ltd is migrating their   │   │
│  │ on-premises infrastructure to... │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Which Azure service should you         │
│  recommend for the web tier?            │
│                                         │
│  [Options...]                           │
│                                         │
│       [ Submit Exam ]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Timer Behavior**:

| Time Remaining | Visual Indicator |
|----------------|------------------|
| > 50% | Normal cyan color |
| 25-50% | Yellow/warning color |
| 10-25% | Orange, subtle pulse |
| < 10% | Red, urgent pulse animation |
| < 5 min | Full-screen warning flash once |
| 0:00 | Auto-submit exam |

**Strict Rules**:

- NO pausing allowed
- Tab/window switch detection → warning
- Auto-save every 30 seconds
- Connection loss → local storage backup → resume on reconnect

---

## 7. Data Models (Convex Schema)

### 7.0 Convex Auth Setup

Before implementing the schema, set up Convex Auth:

#### Step 1: Install Dependencies

```bash
npm install @convex-dev/auth
```

#### Step 2: Generate JWT Keys

Create `generateKeys.mjs` in your project root:

```javascript
// generateKeys.mjs
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

process.stdout.write(`JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"`);
process.stdout.write("\n");
process.stdout.write(`JWKS=${jwks}`);
process.stdout.write("\n");
```

Run it:

```bash
node generateKeys.mjs
```

Copy output to Convex Dashboard → Settings → Environment Variables.

#### Step 3: Set SITE_URL

```bash
# For local development
npx convex env set SITE_URL http://localhost:8081

# For production (your app URL)
npx convex env set SITE_URL https://your-app.com
```

#### Step 4: Update `convex/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ES2021"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Step 5: Create Auth Config

```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
```

#### Step 6: Initialize Auth

```typescript
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    // Email/Password authentication
    Password,
    
    // OAuth providers (optional)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
  ],
});
```

#### Step 7: Configure HTTP Routes

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Add Convex Auth HTTP routes
auth.addHttpRoutes(http);

export default http;
```

#### Step 8: React Native Client Setup

```typescript
// lib/convex.ts
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export { convex, ConvexProviderWithAuth };
```

```typescript
// app/_layout.tsx
import { ConvexProviderWithAuth } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import * as SecureStore from "expo-secure-store";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

// Secure storage for React Native
const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
  return (
    <ConvexProviderWithAuth client={convex} storage={secureStorage}>
      <Stack />
    </ConvexProviderWithAuth>
  );
}
```

#### Step 9: Auth Hooks Usage

```typescript
// hooks/useAuth.ts
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  
  const handleSignIn = async (email: string, password: string) => {
    await signIn("password", { email, password, flow: "signIn" });
  };
  
  const handleSignUp = async (email: string, password: string, name: string) => {
    await signIn("password", { email, password, name, flow: "signUp" });
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const handleGoogleSignIn = async () => {
    await signIn("google");
  };
  
  return {
    user,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleGoogleSignIn,
  };
}
```

#### Step 10: Protected Routes

```typescript
// app/(app)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useConvexAuth } from "convex/react";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  
  return <Stack />;
}
```

### 7.1 Complete Schema Definition

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ========== USER PROFILE ==========
  // Note: Convex Auth creates a "users" table automatically
  // We extend it with our custom fields via "userProfiles"
  
  userProfiles: defineTable({
    userId: v.id("users"),  // References Convex Auth users table
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    
    // Preferences
    selectedExam: v.optional(v.union(
      v.literal("AZ-900"),
      v.literal("AZ-104"),
      v.literal("AZ-305")
    )),
    dailyGoal: v.optional(v.number()),  // Questions per day
    reminderTime: v.optional(v.string()),
    
    // Gamification
    totalXp: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.string(),  // YYYY-MM-DD
    
    createdAt: v.number(),
  })
    .index("by_user_id", ["userId"]),

  // ========== QUESTIONS ==========
  questions: defineTable({
    examCode: v.union(
      v.literal("AZ-900"),
      v.literal("AZ-104"),
      v.literal("AZ-305")
    ),
    type: v.union(
      v.literal("single-choice"),
      v.literal("multiple-choice"),
      v.literal("drag-drop"),
      v.literal("fill-blank"),
      v.literal("case-study"),
      v.literal("true-false")
    ),
    domain: v.string(),
    subdomain: v.optional(v.string()),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    
    // Question content (JSON structure varies by type)
    content: v.any(),
    
    // Metadata
    explanation: v.string(),
    references: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
    
    // Quality tracking
    timesAnswered: v.number(),
    timesCorrect: v.number(),
    averageTimeSeconds: v.number(),
    
    // Admin
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_exam", ["examCode"])
    .index("by_exam_domain", ["examCode", "domain"])
    .index("by_exam_type", ["examCode", "type"])
    .index("by_difficulty", ["difficulty"]),

  // ========== CASE STUDIES ==========
  caseStudies: defineTable({
    examCode: v.union(v.literal("AZ-104"), v.literal("AZ-305")),
    title: v.string(),
    scenario: v.object({
      background: v.string(),
      currentEnvironment: v.string(),
      requirements: v.array(v.string()),
      constraints: v.optional(v.array(v.string())),
    }),
    diagramIds: v.optional(v.array(v.id("_storage"))),
    questionIds: v.array(v.id("questions")),
    isActive: v.boolean(),
  })
    .index("by_exam", ["examCode"]),

  // ========== EXAM SESSIONS ==========
  examSessions: defineTable({
    userId: v.id("users"),  // Convex Auth user ID
    examCode: v.union(
      v.literal("AZ-900"),
      v.literal("AZ-104"),
      v.literal("AZ-305")
    ),
    mode: v.union(
      v.literal("learn"),
      v.literal("mock"),
      v.literal("timed")
    ),
    
    // Configuration
    questionCount: v.number(),
    timeLimitMinutes: v.optional(v.number()),
    domainFilter: v.optional(v.array(v.string())),
    
    // Progress
    status: v.union(
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    currentQuestionIndex: v.number(),
    questionIds: v.array(v.id("questions")),
    
    // Timing
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    totalTimeSeconds: v.number(),
    timeRemainingSeconds: v.optional(v.number()),
    
    // Results (populated on completion)
    score: v.optional(v.number()),  // 0-1000 scale
    correctCount: v.optional(v.number()),
    incorrectCount: v.optional(v.number()),
    skippedCount: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_exam", ["userId", "examCode"])
    .index("by_user_status", ["userId", "status"]),

  // ========== QUESTION RESPONSES ==========
  questionResponses: defineTable({
    sessionId: v.id("examSessions"),
    questionId: v.id("questions"),
    userId: v.id("users"),
    
    // User's answer (structure varies by question type)
    userAnswer: v.any(),
    
    isCorrect: v.boolean(),
    isPartialCredit: v.optional(v.boolean()),
    pointsEarned: v.number(),  // Usually 0 or 1, or partial
    
    // Timing
    timeSpentSeconds: v.number(),
    answeredAt: v.number(),
    
    // Flags
    wasFlagged: v.boolean(),
    wasSkipped: v.boolean(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user_question", ["userId", "questionId"]),

  // ========== PROGRESS TRACKING ==========
  userProgress: defineTable({
    userId: v.id("users"),
    examCode: v.union(
      v.literal("AZ-900"),
      v.literal("AZ-104"),
      v.literal("AZ-305")
    ),
    
    // Overall stats
    totalQuestionsAttempted: v.number(),
    totalCorrect: v.number(),
    totalTimeMinutes: v.number(),
    
    // Domain breakdown: { "Cloud Concepts": { attempted: 50, correct: 40 } }
    domainStats: v.any(),
    
    // Question type breakdown
    typeStats: v.any(),
    
    // Difficulty breakdown
    difficultyStats: v.any(),
    
    // Mock/Timed exam history
    examAttempts: v.number(),
    highestScore: v.number(),
    averageScore: v.number(),
    passCount: v.number(),
    
    lastUpdated: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_exam", ["userId", "examCode"]),

  // ========== DAILY ACTIVITY ==========
  dailyActivity: defineTable({
    userId: v.id("users"),
    date: v.string(),  // YYYY-MM-DD
    
    questionsAnswered: v.number(),
    correctAnswers: v.number(),
    timeSpentMinutes: v.number(),
    xpEarned: v.number(),
    
    // Per-exam breakdown
    examActivity: v.any(),  // { "AZ-900": { questions: 20, correct: 15 } }
  })
    .index("by_user_date", ["userId", "date"]),

  // ========== BOOKMARKS / WEAK AREAS ==========
  bookmarks: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]),

  weakQuestions: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    incorrectCount: v.number(),
    lastAttemptAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_count", ["userId", "incorrectCount"]),
});
```

---

## 8. API & Backend Logic

### 8.0 User Management with Convex Auth

```typescript
// convex/users.ts
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get current authenticated user with profile
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    
    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    
    return { ...user, profile };
  },
});

// Create or update user profile (called after auth)
export const upsertProfile = mutation({
  args: {
    name: v.optional(v.string()),
    selectedExam: v.optional(v.union(
      v.literal("AZ-900"),
      v.literal("AZ-104"),
      v.literal("AZ-305")
    )),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    }
    
    return await ctx.db.insert("userProfiles", {
      userId,
      name: args.name,
      selectedExam: args.selectedExam,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    });
  },
});

// Internal mutation to create profile on first sign-up
export const createProfileOnSignUp = internalMutation({
  args: { userId: v.id("users"), email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (!existing) {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
        createdAt: Date.now(),
      });
    }
  },
});
```

### 8.1 Core Convex Functions

```typescript
// convex/questions.ts

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get questions for a study session
export const getQuestionsForSession = query({
  args: {
    examCode: v.union(v.literal("AZ-900"), v.literal("AZ-104"), v.literal("AZ-305")),
    mode: v.union(v.literal("learn"), v.literal("mock"), v.literal("timed")),
    count: v.number(),
    domainFilter: v.optional(v.array(v.string())),
    excludeIds: v.optional(v.array(v.id("questions"))),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Build query based on filters
    let questionsQuery = ctx.db
      .query("questions")
      .withIndex("by_exam", (q) => q.eq("examCode", args.examCode))
      .filter((q) => q.eq(q.field("isActive"), true));

    // Get all matching questions
    const allQuestions = await questionsQuery.collect();
    
    // Filter by domain if specified
    let filtered = allQuestions;
    if (args.domainFilter && args.domainFilter.length > 0) {
      filtered = allQuestions.filter(q => 
        args.domainFilter!.includes(q.domain)
      );
    }
    
    // Exclude already answered (for learn mode)
    if (args.excludeIds && args.excludeIds.length > 0) {
      filtered = filtered.filter(q => 
        !args.excludeIds!.includes(q._id)
      );
    }
    
    // Shuffle and limit
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, args.count);
    
    return selected.map(q => q._id);
  },
});

// Get single question with full content
export const getQuestion = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");
    
    // If has images, get signed URLs
    if (question.imageIds && question.imageIds.length > 0) {
      const imageUrls = await Promise.all(
        question.imageIds.map(id => ctx.storage.getUrl(id))
      );
      return { ...question, imageUrls };
    }
    
    return question;
  },
});
```

```typescript
// convex/exams.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Start new exam session
export const startSession = mutation({
  args: {
    examCode: v.union(v.literal("AZ-900"), v.literal("AZ-104"), v.literal("AZ-305")),
    mode: v.union(v.literal("learn"), v.literal("mock"), v.literal("timed")),
    questionCount: v.number(),
    timeLimitMinutes: v.optional(v.number()),
    domainFilter: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get questions for this session
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_exam", (q) => q.eq("examCode", args.examCode))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Shuffle and select
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, args.questionCount);
    const questionIds = selected.map(q => q._id);
    
    // Create session
    const sessionId = await ctx.db.insert("examSessions", {
      userId,
      examCode: args.examCode,
      mode: args.mode,
      questionCount: args.questionCount,
      timeLimitMinutes: args.timeLimitMinutes,
      domainFilter: args.domainFilter,
      status: "in-progress",
      currentQuestionIndex: 0,
      questionIds,
      startedAt: Date.now(),
      totalTimeSeconds: 0,
      timeRemainingSeconds: args.timeLimitMinutes 
        ? args.timeLimitMinutes * 60 
        : undefined,
    });
    
    return sessionId;
  },
});

// Submit answer for current question
export const submitAnswer = mutation({
  args: {
    sessionId: v.id("examSessions"),
    questionId: v.id("questions"),
    userAnswer: v.any(),
    timeSpentSeconds: v.number(),
    isFlagged: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Validate session belongs to user
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found");
    }
    
    // Get question and check answer
    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");
    
    // Calculate if correct based on question type
    let isCorrect = false;
    let pointsEarned = 0;
    
    const content = question.content as any;
    
    switch (question.type) {
      case "single-choice":
        isCorrect = args.userAnswer === content.correctIndex;
        break;
      case "multiple-choice":
        const userAnswers = args.userAnswer as number[];
        const correctAnswers = content.correctIndices as number[];
        isCorrect = 
          userAnswers.length === correctAnswers.length &&
          userAnswers.every(a => correctAnswers.includes(a));
        break;
      case "true-false":
        isCorrect = args.userAnswer === content.correctAnswer;
        break;
      // Add other question types...
    }
    
    pointsEarned = isCorrect ? 1 : 0;
    
    // Create response record
    await ctx.db.insert("questionResponses", {
      sessionId: args.sessionId,
      questionId: args.questionId,
      userId,
      userAnswer: args.userAnswer,
      isCorrect,
      pointsEarned,
      timeSpentSeconds: args.timeSpentSeconds,
      answeredAt: Date.now(),
      wasFlagged: args.isFlagged || false,
      wasSkipped: false,
    });
    
    // Update session progress
    await ctx.db.patch(args.sessionId, {
      currentQuestionIndex: session.currentQuestionIndex + 1,
      totalTimeSeconds: session.totalTimeSeconds + args.timeSpentSeconds,
    });
    
    // Return result (for learn mode, include explanation)
    return {
      isCorrect,
      pointsEarned,
      explanation: session.mode === "learn" ? question.explanation : undefined,
      correctAnswer: session.mode === "learn" ? content.correctIndex || content.correctIndices : undefined,
    };
  },
});

// Complete/submit exam
export const completeSession = mutation({
  args: {
    sessionId: v.id("examSessions"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found");
    }
    
    // Get all responses for this session
    const responses = await ctx.db
      .query("questionResponses")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    const correctCount = responses.filter(r => r.isCorrect).length;
    const incorrectCount = responses.filter(r => !r.isCorrect && !r.wasSkipped).length;
    const skippedCount = session.questionCount - responses.length;
    
    // Calculate score (0-1000 scale like Microsoft)
    const score = Math.round((correctCount / session.questionCount) * 1000);
    
    // Update session
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: Date.now(),
      score,
      correctCount,
      incorrectCount,
      skippedCount,
    });
    
    // Update user profile stats
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    
    if (profile) {
      const xpEarned = correctCount * 10 + (score >= 700 ? 50 : 0);
      const today = new Date().toISOString().split("T")[0];
      const isNewDay = profile.lastActiveDate !== today;
      const newStreak = isNewDay 
        ? (wasYesterday(profile.lastActiveDate) ? profile.currentStreak + 1 : 1)
        : profile.currentStreak;
      
      await ctx.db.patch(profile._id, {
        totalXp: profile.totalXp + xpEarned,
        currentStreak: newStreak,
        longestStreak: Math.max(profile.longestStreak, newStreak),
        lastActiveDate: today,
      });
    }
    
    return {
      score,
      passed: score >= 700,
      correctCount,
      incorrectCount,
      skippedCount,
      totalQuestions: session.questionCount,
    };
  },
});

// Helper function
function wasYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split("T")[0];
}
```

```typescript
// convex/progress.ts

import { query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get user's dashboard stats
export const getDashboardStats = query({
  args: {
    examCode: v.optional(v.union(v.literal("AZ-900"), v.literal("AZ-104"), v.literal("AZ-305"))),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();
    
    if (!profile) {
      return null;
    }
    
    const examCode = args.examCode || profile.selectedExam || "AZ-900";
    
    // Get user progress for selected exam
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user_exam", (q) => 
        q.eq("userId", userId).eq("examCode", examCode)
      )
      .unique();
    
    // Get today's activity
    const today = new Date().toISOString().split("T")[0];
    const todayActivity = await ctx.db
      .query("dailyActivity")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", userId).eq("date", today)
      )
      .unique();
    
    // Get recent sessions
    const recentSessions = await ctx.db
      .query("examSessions")
      .withIndex("by_user_exam", (q) => 
        q.eq("userId", userId).eq("examCode", examCode)
      )
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("desc")
      .take(5);
    
    // Calculate estimated readiness
    const readiness = progress 
      ? Math.min(100, Math.round(
          (progress.totalCorrect / Math.max(progress.totalQuestionsAttempted, 1)) * 
          Math.min(progress.totalQuestionsAttempted / 200, 1) * 100
        ))
      : 0;
    
    return {
      profile,
      examCode,
      streak: {
        current: profile.currentStreak,
        longest: profile.longestStreak,
      },
      todayProgress: {
        questions: todayActivity?.questionsAnswered || 0,
        goal: profile.dailyGoal || 20,
        accuracy: todayActivity 
          ? todayActivity.correctAnswers / Math.max(todayActivity.questionsAnswered, 1)
          : 0,
      },
      overallProgress: {
        questionsAttempted: progress?.totalQuestionsAttempted || 0,
        correctRate: progress 
          ? progress.totalCorrect / Math.max(progress.totalQuestionsAttempted, 1)
          : 0,
        estimatedReadiness: readiness,
      },
      domainBreakdown: progress?.domainStats || {},
      recentSessions,
    };
  },
});
```

---

## 9. Screen-by-Screen Prompts

Use these prompts to generate each screen/component:

### 9.1 Onboarding Screen

```
PROMPT: Create an onboarding screen for an Azure certification prep app.

Requirements:
- 3-4 swipeable intro slides
- Slide 1: Welcome with app logo and tagline "Master Azure Certifications"
- Slide 2: Highlight exam simulations feature
- Slide 3: Show progress tracking/analytics
- Slide 4: CTA to sign up / select exam

Design:
- Dark background (#0a0a0f)
- Gradient accents using: #f72585, #7209b7, #4361ee, #4cc9f0
- Smooth page transitions with Framer Motion
- Progress dots at bottom
- Skip button top-right
- Next/Get Started button at bottom

Components needed:
- Animated illustration/icon for each slide
- Gradient text for headings
- Glassmorphism card for feature highlights
```

### 9.2 Exam Selection Screen

```
PROMPT: Create an exam selection screen with three cards for Azure certifications.

Cards to display:
1. AZ-900 - Azure Fundamentals (Foundational)
2. AZ-104 - Azure Administrator (Associate)
3. AZ-305 - Solutions Architect Expert (Expert)

Each card should show:
- Exam code as large text
- Exam name
- Difficulty level badge
- Key stats: Time limit, Questions, Passing score
- Brief description (2 lines)
- Progress indicator if user has started studying

Design:
- Cards stacked vertically on mobile, grid on web
- Gradient border on hover (pink to cyan spectrum)
- Subtle scale animation on tap
- Selected card has glow effect
- Background with subtle grid pattern

Interaction:
- Tap card to select and navigate to dashboard
- Long press for exam info modal
```

### 9.3 Dashboard Screen

```
PROMPT: Create a study dashboard for the Azure certification prep app.

Layout (mobile-first):
1. Header: User avatar, streak fire icon + count, XP badge
2. Current Exam Badge: "AZ-104" with change option
3. Progress Ring: Large circular progress showing readiness %
4. Today's Goal: Questions answered vs daily goal
5. Quick Action Cards (3 cards, horizontal scroll):
   - Learn Mode (book icon)
   - Mock Exam (target icon)
   - Timed Exam (clock icon)
6. Domain Progress: Horizontal bar chart of domains
7. Weak Areas: List of 3-5 questions to review
8. Recent Activity: Last 3 sessions

Design requirements:
- Color palette: #f72585, #b5179e, #7209b7, #560bad, #480ca8, #3a0ca3, #3f37c9, #4361ee, #4895ef, #4cc9f0
- Dark theme with subtle gradients
- Progress ring animated on load
- Cards have glassmorphism effect
- Streak counter with fire animation if active
- Pull-to-refresh functionality
```

---

## 10. Question Generation Prompts

Use these prompts to generate exam-accurate questions:

### 10.1 AZ-900 Question Generation

```
PROMPT: Generate 10 AZ-900 Azure Fundamentals exam questions.

Context: AZ-900 tests foundational knowledge of cloud concepts and Azure services. Target audience includes IT beginners, sales, and business roles.

Exam Domains (weight):
1. Cloud Concepts (25-30%)
2. Azure Architecture and Services (35-40%)
3. Azure Management and Governance (30-35%)

For each question, provide:
1. question_type: single-choice | multiple-choice | true-false | drag-drop | fill-blank
2. domain: One of the three domains above
3. difficulty: easy | medium (mostly easy/medium for AZ-900)
4. question_text: Clear, concise question
5. options: 4 options for single/multiple choice
6. correct_answer: Index(es) of correct option(s)
7. explanation: 2-3 sentences explaining WHY the answer is correct
8. azure_reference: Link to relevant Microsoft Learn documentation

Question style guidelines:
- Use scenario-based questions where possible
- Include "Which of the following..." format
- Test conceptual understanding, not deep technical details
- Include questions about:
  - IaaS vs PaaS vs SaaS
  - Public/Private/Hybrid cloud
  - Azure regions and availability zones
  - Core services (VMs, Storage, Networking, Databases)
  - Azure pricing and support plans
  - Azure management tools (Portal, CLI, PowerShell)
  - Identity and governance (Azure AD, RBAC, Policies)

Output as JSON array.
```

### 10.2 AZ-104 Question Generation

```
PROMPT: Generate 10 AZ-104 Azure Administrator exam questions.

Context: AZ-104 tests practical Azure administration skills. Target audience is IT professionals with 6+ months Azure experience.

Exam Domains (weight):
1. Manage Azure identities and governance (20-25%)
2. Implement and manage storage (15-20%)
3. Deploy and manage Azure compute resources (20-25%)
4. Implement and manage virtual networking (15-20%)
5. Monitor and maintain Azure resources (10-15%)

Question characteristics:
- More technical than AZ-900
- Include PowerShell/CLI command questions
- Include ARM template questions
- Case study scenarios common
- Drag-drop for process ordering
- Fill-in-blank for commands

For each question, provide:
1. question_type: single-choice | multiple-choice | drag-drop | fill-blank | case-study-single | true-false-series
2. domain: One of the five domains above
3. subdomain: Specific topic (e.g., "Azure AD users and groups")
4. difficulty: medium | hard
5. question_text: Technical, scenario-based question
6. context: (Optional) Scenario setup paragraph
7. options/items: Based on question type
8. correct_answer(s): With scoring rules for multiple-choice
9. explanation: Technical explanation with best practices
10. commands: (If applicable) Relevant Azure CLI/PowerShell commands
11. azure_reference: Microsoft Learn link

Include questions about:
- Azure AD (users, groups, MFA, Conditional Access)
- RBAC role assignments
- Storage accounts (types, replication, access tiers)
- Virtual machines (sizes, availability, extensions)
- Virtual networks (subnets, NSGs, peering, VPN)
- Load balancers and Application Gateway
- Azure Monitor, Log Analytics, alerts
- Backup and disaster recovery
- ARM templates and Bicep

Output as JSON array.
```

### 10.3 AZ-305 Question Generation

```
PROMPT: Generate 10 AZ-305 Azure Solutions Architect Expert exam questions.

Context: AZ-305 tests the ability to design Azure solutions. Target audience is experienced cloud architects.

Exam Domains (weight):
1. Design identity, governance, and monitoring solutions (25-30%)
2. Design data storage solutions (25-30%)
3. Design business continuity solutions (10-15%)
4. Design infrastructure solutions (25-30%)

Question characteristics:
- Heavily scenario-based
- Focus on DESIGN decisions, not implementation
- "Which service should you recommend?" format
- Case studies with multiple related questions
- Trade-off analysis (cost vs performance vs security)
- Multi-service architecture questions

For each question, provide:
1. question_type: single-choice | multiple-choice | case-study | drag-drop
2. domain: One of the four domains above
3. scenario: Company context, current state, requirements
4. constraints: Budget, compliance, performance requirements
5. question_text: Architecture decision question
6. options: 4 possible solutions/services
7. correct_answer: Best solution with justification
8. explanation: Why this is the BEST choice (not just a valid choice)
9. trade_offs: What you sacrifice with this choice
10. alternative_considerations: When other options would be better
11. azure_reference: Microsoft Learn architecture guidance

Include questions about:
- Identity architecture (Azure AD B2B/B2C, hybrid identity)
- Governance at scale (Management Groups, Blueprints, Policies)
- Data platform selection (SQL vs Cosmos DB vs Synapse)
- Storage solutions for different workloads
- High availability and disaster recovery
- Hub-spoke network architecture
- Hybrid connectivity (ExpressRoute, VPN, Virtual WAN)
- Microservices architecture (AKS, Service Fabric, Functions)
- Security architecture (Key Vault, Defender, Sentinel)
- Cost optimization strategies

Output as JSON array with case study structure for scenario-based questions.
```

### 10.4 Case Study Generation

```
PROMPT: Generate a complete case study for AZ-305 exam.

Structure:
1. Company Overview:
   - Company name: (fictional)
   - Industry: (e.g., retail, healthcare, finance)
   - Size: (employees, revenue scale)
   - Geographic presence

2. Current Environment:
   - Existing infrastructure (on-premises, partially cloud)
   - Current applications and databases
   - Pain points and challenges
   - Technical debt

3. Requirements:
   - Business requirements (3-5 items)
   - Technical requirements (5-7 items)
   - Security/compliance requirements
   - Performance requirements (SLAs)

4. Constraints:
   - Budget considerations
   - Timeline
   - Skill limitations
   - Regulatory compliance

5. Questions (4-6 questions):
   - Mix of single-choice and multiple-choice
   - Each question focuses on different aspect
   - Questions should reference specific requirements
   - Include at least one "correct answer is most cost-effective" type

Format output as a complete JSON object matching the caseStudy schema.
```

---

## 11. Animation & UX Guidelines

### 11.1 Animation Library (React Native Reanimated 3)

```typescript
// lib/animations.ts
import {
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  SharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';

// Spring configurations
export const springConfigs = {
  gentle: { damping: 15, stiffness: 100 },
  bouncy: { damping: 8, stiffness: 200 },
  stiff: { damping: 20, stiffness: 300 },
  wobbly: { damping: 6, stiffness: 180 },
};

// Timing configurations
export const timingConfigs = {
  fast: { duration: 150, easing: Easing.out(Easing.ease) },
  normal: { duration: 300, easing: Easing.inOut(Easing.ease) },
  slow: { duration: 500, easing: Easing.inOut(Easing.cubic) },
};

// ===== ANIMATION PRESETS =====

// Button press animation
export const useButtonPressAnimation = (pressed: SharedValue<boolean>) => {
  return useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(pressed.value ? 0.97 : 1, springConfigs.stiff) }
    ],
  }));
};

// Card hover/press animation
export const useCardAnimation = (active: SharedValue<boolean>) => {
  return useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(active.value ? 1.02 : 1, springConfigs.gentle) }
    ],
    shadowOpacity: withTiming(active.value ? 0.3 : 0.1, timingConfigs.fast),
  }));
};

// Correct answer animation
export const useCorrectAnswerAnimation = (isCorrect: SharedValue<boolean>) => {
  return useAnimatedStyle(() => {
    const scale = withSequence(
      withTiming(1.05, { duration: 150 }),
      withSpring(1, springConfigs.gentle)
    );
    
    return {
      transform: [{ scale: isCorrect.value ? scale : 1 }],
      borderColor: interpolateColor(
        isCorrect.value ? 1 : 0,
        [0, 1],
        ['transparent', '#4cc9f0']
      ),
      borderWidth: withTiming(isCorrect.value ? 2 : 0, timingConfigs.fast),
    };
  });
};

// Incorrect answer shake animation
export const useShakeAnimation = (trigger: SharedValue<boolean>) => {
  return useAnimatedStyle(() => {
    const shake = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    
    return {
      transform: [{ translateX: trigger.value ? shake : 0 }],
    };
  });
};

// Progress bar fill animation
export const useProgressAnimation = (progress: SharedValue<number>) => {
  return useAnimatedStyle(() => ({
    width: withTiming(`${progress.value * 100}%`, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    }),
  }));
};

// Staggered list item animation
export const useListItemAnimation = (
  index: number,
  isVisible: SharedValue<boolean>
) => {
  return useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value ? 1 : 0, {
      duration: 300,
      delay: index * 70,
    }),
    transform: [
      {
        translateX: withTiming(isVisible.value ? 0 : -20, {
          duration: 300,
          delay: index * 70,
        }),
      },
    ],
  }));
};

// Page transition animation
export const usePageTransition = (entering: boolean) => {
  return useAnimatedStyle(() => ({
    opacity: withTiming(entering ? 1 : 0, timingConfigs.normal),
    transform: [
      {
        translateY: withTiming(entering ? 0 : 20, timingConfigs.normal),
      },
    ],
  }));
};

// Slide up panel animation (for explanations)
export const useSlideUpAnimation = (visible: SharedValue<boolean>) => {
  return useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(visible.value ? 0 : 500, springConfigs.gentle),
      },
    ],
  }));
};

// Pulse animation (for timer warning)
export const usePulseAnimation = (active: SharedValue<boolean>) => {
  return useAnimatedStyle(() => {
    const pulse = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
    
    return {
      transform: [{ scale: active.value ? pulse : 1 }],
      opacity: active.value
        ? withRepeat(
            withSequence(
              withTiming(0.7, { duration: 500 }),
              withTiming(1, { duration: 500 })
            ),
            -1,
            true
          )
        : 1,
    };
  });
};

// Fade scale animation (for modals)
export const useFadeScaleAnimation = (visible: SharedValue<boolean>) => {
  return useAnimatedStyle(() => ({
    opacity: withTiming(visible.value ? 1 : 0, timingConfigs.fast),
    transform: [
      {
        scale: withTiming(visible.value ? 1 : 0.95, timingConfigs.fast),
      },
    ],
  }));
};

// Gradient glow animation
export const useGlowAnimation = (active: SharedValue<boolean>) => {
  return useAnimatedStyle(() => ({
    shadowColor: '#f72585',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: withTiming(active.value ? 20 : 0, timingConfigs.normal),
    shadowOpacity: withTiming(active.value ? 0.5 : 0, timingConfigs.normal),
  }));
};

// Streak fire animation
export const useFireAnimation = () => {
  return useAnimatedStyle(() => {
    const flicker = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 200 + Math.random() * 100 }),
        withTiming(0.9, { duration: 200 + Math.random() * 100 }),
        withTiming(1.05, { duration: 200 + Math.random() * 100 }),
        withTiming(0.95, { duration: 200 + Math.random() * 100 })
      ),
      -1,
      true
    );
    
    return {
      transform: [{ scale: flicker }],
    };
  });
};
```

### 11.2 Animation Components

```typescript
// components/animations/AnimatedCard.tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export function AnimatedCard({ children, onPress, style }: AnimatedCardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 15 }) }],
  }));
  
  return (
    <Pressable
      onPressIn={() => { scale.value = 0.98; }}
      onPressOut={() => { scale.value = 1; }}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

```typescript
// components/animations/AnimatedOption.tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';
import { useEffect } from 'react';

interface AnimatedOptionProps {
  children: React.ReactNode;
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onPress: () => void;
}

export function AnimatedOption({
  children,
  isSelected,
  isCorrect,
  isRevealed,
  onPress,
}: AnimatedOptionProps) {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);
  const borderOpacity = useSharedValue(0);
  
  useEffect(() => {
    if (isRevealed && isSelected) {
      if (isCorrect) {
        // Correct: scale bounce + green glow
        scale.value = withSequence(
          withTiming(1.05, { duration: 150 }),
          withSpring(1, { damping: 10 })
        );
        borderOpacity.value = withTiming(1, { duration: 300 });
      } else {
        // Incorrect: shake + red border
        shakeX.value = withSequence(
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
        borderOpacity.value = withTiming(1, { duration: 300 });
      }
    }
  }, [isRevealed, isSelected, isCorrect]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: shakeX.value },
    ],
    borderWidth: 2,
    borderColor: isRevealed
      ? isCorrect
        ? `rgba(76, 201, 240, ${borderOpacity.value})`
        : isSelected
        ? `rgba(247, 37, 133, ${borderOpacity.value})`
        : 'transparent'
      : isSelected
      ? 'rgba(67, 97, 238, 0.5)'
      : 'rgba(255, 255, 255, 0.1)',
  }));
  
  return (
    <Pressable
      onPressIn={() => { scale.value = 0.98; }}
      onPressOut={() => { scale.value = 1; }}
      onPress={onPress}
      disabled={isRevealed}
    >
      <Animated.View style={[styles.option, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
});
```

### 11.3 Micro-interaction Guidelines

| Interaction | Animation | Duration | Library |
|-------------|-----------|----------|---------|
| Button tap | Scale to 0.97 | 100ms | Reanimated |
| Card tap | Scale to 1.02 + glow | 200ms | Reanimated |
| Option select | Border fade in | 200ms | Reanimated |
| Correct answer | Scale bounce + cyan glow | 500ms | Reanimated |
| Incorrect answer | Horizontal shake + red border | 400ms | Reanimated |
| Progress update | Width transition | 800ms | Reanimated |
| Page transition | Fade + slide Y | 300ms | Reanimated |
| Modal open | Fade + scale from 0.95 | 200ms | Reanimated |
| Pull to refresh | Native | - | Expo |
| Streak fire | Scale flicker loop | Continuous | Reanimated |
| Timer pulse | Scale + opacity pulse | 1000ms loop | Reanimated |

### 11.4 Haptic Feedback (iOS)

```typescript
// lib/haptics.ts
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const haptics = {
  // Light tap for buttons
  buttonTap: () => {
    if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  
  // Medium tap for selections
  selection: () => {
    if (isIOS) Haptics.selectionAsync();
  },
  
  // Success feedback for correct answers
  correct: () => {
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  
  // Error feedback for incorrect answers
  incorrect: () => {
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  
  // Warning feedback for timer
  warning: () => {
    if (isIOS) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  
  // Heavy impact for important actions
  heavy: () => {
    if (isIOS) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
};

// Hook for haptic button
export function useHapticButton(onPress: () => void) {
  return () => {
    haptics.buttonTap();
    onPress();
  };
}
```

### 11.5 Confetti Effect

```typescript
// components/animations/Confetti.tsx
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { StyleSheet, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const CONFETTI_COUNT = 50;
const COLORS = ['#f72585', '#b5179e', '#7209b7', '#4361ee', '#4895ef', '#4cc9f0'];

interface ConfettiPieceProps {
  index: number;
  onComplete?: () => void;
}

function ConfettiPiece({ index, onComplete }: ConfettiPieceProps) {
  const startX = Math.random() * width;
  const endX = startX + (Math.random() - 0.5) * 200;
  const rotation = Math.random() * 360;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = 8 + Math.random() * 8;
  const delay = Math.random() * 500;
  const duration = 2000 + Math.random() * 1000;
  
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height + 50, { duration, easing: Easing.out(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(endX, { duration, easing: Easing.inOut(Easing.sin) })
    );
    rotate.value = withDelay(
      delay,
      withTiming(rotation + 720, { duration })
    );
    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 }, (finished) => {
        if (finished && index === CONFETTI_COUNT - 1 && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View
      style={[
        styles.confetti,
        animatedStyle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? size / 2 : 0,
        },
      ]}
    />
  );
}

export function Confetti({ onComplete }: { onComplete?: () => void }) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece
          key={i}
          index={i}
          onComplete={i === CONFETTI_COUNT - 1 ? onComplete : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
  },
});
```

---

## 12. Deployment & Infrastructure

### 12.1 Convex Setup

```bash
# Initialize Convex project
npx convex init

# Install Convex Auth
npm install @convex-dev/auth

# Generate JWT keys
node generateKeys.mjs
# Copy output to Convex Dashboard → Environment Variables

# Set environment variables
npx convex env set SITE_URL http://localhost:8081  # For dev
npx convex env set SITE_URL https://your-app.com   # For prod

# Optional: OAuth providers
npx convex env set GOOGLE_CLIENT_ID your_google_client_id
npx convex env set GOOGLE_CLIENT_SECRET your_google_client_secret
npx convex env set APPLE_CLIENT_ID your_apple_client_id
npx convex env set APPLE_CLIENT_SECRET your_apple_client_secret

# Deploy
npx convex deploy
```

### 12.2 Expo Project Setup

```bash
# Create new Expo project
npx create-expo-app@latest azure-cert-prep --template expo-template-blank-typescript

# Install dependencies
cd azure-cert-prep
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install react-native-safe-area-context react-native-screens
npx expo install expo-secure-store expo-haptics
npx expo install @react-native-async-storage/async-storage

# Install Convex
npm install convex @convex-dev/auth

# Install NativeWind (Tailwind for RN)
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# Configure NativeWind
npx tailwindcss init
```

### 12.3 app.json Configuration

```json
{
  "expo": {
    "name": "Azure Cert Prep",
    "slug": "azure-cert-prep",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "azure-cert-prep",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0a0a0f"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.azurecertprep",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0a0a0f"
      },
      "package": "com.yourcompany.azurecertprep"
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

### 12.4 Environment Variables

Create `.env` file:

```env
# Convex
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Feature Flags
EXPO_PUBLIC_ENABLE_SOUND=true
EXPO_PUBLIC_ENABLE_HAPTICS=true
```

### 12.5 Web Deployment (Expo Web → Vercel)

```bash
# Build for web
npx expo export --platform web

# Deploy to Vercel
cd dist
vercel --prod
```

Or configure `vercel.json`:

```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "framework": null
}
```

### 12.6 iOS Deployment (Expo EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS Build
eas build:configure

# Create development build
eas build --platform ios --profile development

# Create production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### 12.7 eas.json Configuration

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### 12.8 Complete Project Initialization Script

```bash
#!/bin/bash
# setup.sh - Run this to initialize the entire project

# Create Expo project
npx create-expo-app@latest azure-cert-prep --template expo-template-blank-typescript
cd azure-cert-prep

# Install all dependencies
npm install convex @convex-dev/auth
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

npx expo install \
  expo-router \
  expo-linking \
  expo-constants \
  expo-status-bar \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-safe-area-context \
  react-native-screens \
  expo-secure-store \
  expo-haptics \
  @react-native-async-storage/async-storage \
  react-native-svg \
  expo-auth-session \
  expo-web-browser

# Initialize Convex
npx convex init

# Initialize Tailwind
npx tailwindcss init

# Create directory structure
mkdir -p app/\(auth\)
mkdir -p app/\(app\)/\(tabs\)
mkdir -p app/\(app\)/exam
mkdir -p app/\(app\)/question
mkdir -p app/\(app\)/results
mkdir -p components/questions
mkdir -p components/exam
mkdir -p components/ui
mkdir -p components/auth
mkdir -p hooks
mkdir -p lib
mkdir -p convex

echo "✅ Project setup complete!"
echo "Next steps:"
echo "1. Run: node generateKeys.mjs"
echo "2. Copy JWT keys to Convex Dashboard"
echo "3. Set EXPO_PUBLIC_CONVEX_URL in .env"
echo "4. Run: npx convex dev"
echo "5. Run: npx expo start"
```

---

## Appendix A: Exam Domain Details

### AZ-900 Domains

| Domain | Weight | Key Topics |
|--------|--------|------------|
| Cloud Concepts | 25-30% | Benefits of cloud, IaaS/PaaS/SaaS, public/private/hybrid, shared responsibility |
| Azure Architecture | 35-40% | Regions, availability zones, resource groups, core services (compute, network, storage) |
| Management & Governance | 30-35% | Cost management, Azure Policy, RBAC, Azure AD, monitoring |

### AZ-104 Domains

| Domain | Weight | Key Topics |
|--------|--------|------------|
| Identity & Governance | 20-25% | Azure AD, RBAC, subscriptions, management groups, policy |
| Storage | 15-20% | Storage accounts, blob/files/tables/queues, replication, access tiers |
| Compute | 20-25% | VMs, availability sets/zones, VMSS, containers, App Service |
| Networking | 15-20% | VNets, NSGs, load balancers, VPN, ExpressRoute, DNS |
| Monitoring | 10-15% | Azure Monitor, Log Analytics, alerts, backup, site recovery |

### AZ-305 Domains

| Domain | Weight | Key Topics |
|--------|--------|------------|
| Identity & Monitoring | 25-30% | Identity architecture, governance design, logging strategy |
| Data Storage | 25-30% | Relational vs NoSQL, data integration, storage for workloads |
| Business Continuity | 10-15% | Backup strategy, HA design, disaster recovery |
| Infrastructure | 25-30% | Compute selection, networking design, migrations |

---

## Appendix B: Sample Question JSON

```json
{
  "id": "az900-q001",
  "examCode": "AZ-900",
  "type": "single-choice",
  "domain": "Cloud Concepts",
  "subdomain": "Cloud Models",
  "difficulty": "easy",
  "content": {
    "question": "Which cloud computing model provides the MOST control over hardware to the customer?",
    "options": [
      "Software as a Service (SaaS)",
      "Platform as a Service (PaaS)",
      "Infrastructure as a Service (IaaS)",
      "Function as a Service (FaaS)"
    ],
    "correctIndex": 2
  },
  "explanation": "Infrastructure as a Service (IaaS) provides the most control over the computing resources. With IaaS, you manage the operating system, middleware, and applications while the cloud provider manages the physical infrastructure. SaaS provides the least control, with the provider managing everything except the data and user access.",
  "references": [
    "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/overview"
  ],
  "isActive": true,
  "timesAnswered": 1523,
  "timesCorrect": 1247,
  "averageTimeSeconds": 45
}
```

---

## Usage Instructions

1. **For AI-Assisted Development**: Copy relevant sections into your AI coding assistant prompt
2. **For Human Developers**: Use as a comprehensive specification document
3. **For Question Generation**: Use Section 10 prompts with GPT-4/Claude
4. **For Design Implementation**: Reference Section 3 and 11 for exact colors and animations
