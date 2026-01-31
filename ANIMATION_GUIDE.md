# Premium Animation Components - Quick Reference Guide

## 🎬 Animation Components Library

### 1. Splash Screen
**File**: `src/components/ui/SplashScreen.tsx`

```tsx
import { SplashScreen } from '@/components/ui/SplashScreen';

// Already added to layout.tsx - shows automatically on first visit
```

---

### 2. Scroll Animations
**File**: `src/components/ui/ScrollAnimations.tsx`

#### ScrollReveal
Reveals elements when they enter the viewport.

```tsx
import { ScrollReveal } from '@/components/ui/ScrollAnimations';

<ScrollReveal direction="up" delay={0.2} duration={0.6}>
  <YourComponent />
</ScrollReveal>

// Directions: 'up' | 'down' | 'left' | 'right'
```

#### ParallaxSection
Creates parallax scrolling effect.

```tsx
import { ParallaxSection } from '@/components/ui/ScrollAnimations';

<ParallaxSection offset={50}>
  <YourComponent />
</ParallaxSection>
```

#### StaggerContainer
Animates children with staggered delays.

```tsx
import { StaggerContainer, staggerItemVariants } from '@/components/ui/ScrollAnimations';
import { motion } from 'framer-motion';

<StaggerContainer staggerDelay={0.1}>
  <motion.div variants={staggerItemVariants}>Item 1</motion.div>
  <motion.div variants={staggerItemVariants}>Item 2</motion.div>
  <motion.div variants={staggerItemVariants}>Item 3</motion.div>
</StaggerContainer>
```

#### ScaleOnScroll
Scales element based on scroll position.

```tsx
import { ScaleOnScroll } from '@/components/ui/ScrollAnimations';

<ScaleOnScroll>
  <YourComponent />
</ScaleOnScroll>
```

---

### 3. Premium Animations
**File**: `src/components/ui/PremiumAnimations.tsx`

#### AnimatedButton
Premium button with hover and tap effects.

```tsx
import { AnimatedButton } from '@/components/ui/PremiumAnimations';

<AnimatedButton variant="primary" onClick={handleClick}>
  Click Me
</AnimatedButton>

// Variants: 'primary' | 'secondary' | 'ghost'
```

#### AnimatedCard
Card with hover lift effect.

```tsx
import { AnimatedCard } from '@/components/ui/PremiumAnimations';

<AnimatedCard hoverScale={1.05} delay={0.2}>
  <YourCardContent />
</AnimatedCard>
```

#### PulseGlow
Adds pulsing glow effect.

```tsx
import { PulseGlow } from '@/components/ui/PremiumAnimations';

<PulseGlow color="rose">
  <YourComponent />
</PulseGlow>
```

#### FloatingElement
Creates floating animation.

```tsx
import { FloatingElement } from '@/components/ui/PremiumAnimations';

<FloatingElement duration={3} yOffset={20}>
  <YourIcon />
</FloatingElement>
```

#### Shimmer
Adds shimmer loading effect.

```tsx
import { Shimmer } from '@/components/ui/PremiumAnimations';

<Shimmer>
  <YourComponent />
</Shimmer>
```

#### MagneticButton
Button with magnetic hover effect.

```tsx
import { MagneticButton } from '@/components/ui/PremiumAnimations';

<MagneticButton onClick={handleClick}>
  Hover Me
</MagneticButton>
```

#### CounterAnimation
Animates numbers counting up.

```tsx
import { CounterAnimation } from '@/components/ui/PremiumAnimations';

<CounterAnimation from={0} to={100} duration={2} />
```

#### Typewriter
Typewriter text effect.

```tsx
import { Typewriter } from '@/components/ui/PremiumAnimations';

<Typewriter text="Welcome to Rose Bowl Motel" delay={0.5} />
```

---

### 4. Page Transitions
**File**: `src/components/ui/PageTransitions.tsx`

#### PageTransition
Default page transition with fade and slide.

```tsx
import { PageTransition } from '@/components/ui/PageTransitions';

export default function Page() {
  return (
    <PageTransition>
      <YourPageContent />
    </PageTransition>
  );
}
```

#### FadeTransition
Simple fade transition.

```tsx
import { FadeTransition } from '@/components/ui/PageTransitions';

<FadeTransition>
  <YourContent />
</FadeTransition>
```

#### SlideTransition
Slide from different directions.

```tsx
import { SlideTransition } from '@/components/ui/PageTransitions';

<SlideTransition direction="right">
  <YourContent />
</SlideTransition>

// Directions: 'left' | 'right' | 'up' | 'down'
```

#### ScaleTransition
Scale-based transition.

```tsx
import { ScaleTransition } from '@/components/ui/PageTransitions';

<ScaleTransition>
  <YourContent />
</ScaleTransition>
```

#### LoadingTransition
Shows loading spinner then content.

```tsx
import { LoadingTransition } from '@/components/ui/PageTransitions';

<LoadingTransition isLoading={isLoading}>
  <YourContent />
</LoadingTransition>
```

---

## 🎨 CSS Animation Classes

### Utility Classes
Available in `globals.css`:

```tsx
// Fade in from bottom
<div className="animate-fade-in-up">Content</div>

// Slide from left
<div className="animate-slide-in-left">Content</div>

// Slide from right
<div className="animate-slide-in-right">Content</div>

// Scale in
<div className="animate-scale-in">Content</div>

// Floating animation
<div className="animate-float">Content</div>

// Glow effect
<div className="animate-glow">Content</div>

// Rise up animation
<div className="animate-rise-up">Content</div>
```

### Scroll-triggered Classes

```tsx
// Add to any element for scroll reveal
<div className="scroll-fade-in">
  Content appears on scroll
</div>

// Add 'visible' class when in viewport (use Intersection Observer)
```

### Premium Gradients

```tsx
// Premium gradient background
<div className="gradient-premium">Content</div>

// Premium gradient on hover
<button className="gradient-premium-hover">Button</button>
```

---

## 🚀 Best Practices

### 1. Performance
- Use `viewport={{ once: true }}` for animations that should only play once
- Avoid animating expensive properties (use transform and opacity)
- Limit the number of simultaneous animations

### 2. Accessibility
- Respect `prefers-reduced-motion` media query
- Ensure animations don't interfere with usability
- Keep animation durations reasonable (0.3-0.6s)

### 3. Consistency
- Use the same easing functions throughout (`[0.25, 0.4, 0.25, 1]`)
- Maintain consistent animation durations
- Follow the established color palette

### 4. Progressive Enhancement
- Ensure content is accessible without animations
- Use animations to enhance, not replace functionality

---

## 📱 Responsive Considerations

```tsx
// Disable animations on mobile if needed
const isMobile = window.innerWidth < 768;

<motion.div
  animate={isMobile ? {} : { scale: 1.1 }}
>
  Content
</motion.div>
```

---

## 🎯 Common Patterns

### Hero Section with Stagger
```tsx
<StaggerContainer>
  <motion.h1 variants={staggerItemVariants}>Title</motion.h1>
  <motion.p variants={staggerItemVariants}>Subtitle</motion.p>
  <motion.button variants={staggerItemVariants}>CTA</motion.button>
</StaggerContainer>
```

### Card Grid with Reveals
```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map((item, i) => (
    <ScrollReveal key={item.id} delay={i * 0.1}>
      <AnimatedCard>
        {item.content}
      </AnimatedCard>
    </ScrollReveal>
  ))}
</div>
```

### Loading State
```tsx
<LoadingTransition isLoading={isLoading}>
  <YourContent />
</LoadingTransition>
```

---

## 🔧 Customization

### Custom Framer Motion Variants
```tsx
const customVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

<motion.div
  initial="hidden"
  animate="visible"
  variants={customVariants}
>
  Content
</motion.div>
```

### Custom Easing
```tsx
// Smooth ease
ease: [0.25, 0.4, 0.25, 1]

// Bounce
type: 'spring'
stiffness: 300
damping: 20
```

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Animation Principles](https://www.framer.com/motion/animation/)

---

**Last Updated**: January 30, 2026
**Version**: 1.0.0
