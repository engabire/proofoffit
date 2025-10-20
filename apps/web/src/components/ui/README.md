# ProofOfFit UI Component Library

A comprehensive, modern UI component library built with React, TypeScript, and Tailwind CSS, designed specifically for the ProofOfFit platform.

## 🎨 Design System

### Brand Colors
- **Trust Blue** (`proof-blue`): Primary brand color for trust and reliability
- **Success Green** (`proof-green`): Success states and positive actions
- **Professional Purple** (`proof-purple`): Premium features and highlights
- **Alert Orange** (`proof-orange`): Warnings and attention-grabbing elements
- **Professional Gray** (`proof-gray`): Neutral elements and secondary text

### Typography
- Consistent font weights and sizes across all components
- Responsive typography that scales appropriately
- Clear hierarchy with proper contrast ratios

## 📦 Components

### Core Components

#### FeatureCard
Modern feature showcase cards with hover effects and multiple variants.

```tsx
import { FeatureCard } from '@/components/ui';
import { Shield } from 'lucide-react';

<FeatureCard
  icon={Shield}
  title="Secure Authentication"
  description="Enterprise-grade security with SSO and MFA support."
  variant="highlighted"
  onClick={() => console.log('Feature clicked')}
/>
```

**Props:**
- `icon`: Lucide React icon component
- `title`: Feature title
- `description`: Feature description
- `variant`: "default" | "highlighted" | "minimal"
- `className`: Additional CSS classes
- `onClick`: Click handler

#### MetricCard
Professional metrics display with change indicators and gradients.

```tsx
import { MetricCard } from '@/components/ui';
import { TrendingUp } from 'lucide-react';

<MetricCard
  icon={TrendingUp}
  value="87%"
  label="Fit Score"
  change={{ value: "+12%", type: "increase" }}
  variant="success"
/>
```

**Props:**
- `icon`: Lucide React icon component
- `value`: Metric value (string or number)
- `label`: Metric label
- `change`: Change indicator object
- `variant`: "default" | "success" | "warning" | "info"
- `className`: Additional CSS classes

#### ProgressRing
Animated circular progress indicator with brand colors.

```tsx
import { ProgressRing } from '@/components/ui';

<ProgressRing
  value={75}
  size={120}
  strokeWidth={8}
  variant="success"
  showLabel={true}
/>
```

**Props:**
- `value`: Progress value (0-100)
- `max`: Maximum value (default: 100)
- `size`: Ring size in pixels (default: 120)
- `strokeWidth`: Stroke width (default: 8)
- `variant`: "default" | "success" | "warning" | "info"
- `showLabel`: Show percentage label (default: true)
- `className`: Additional CSS classes

### Layout Components

#### DataTable
Modern, sortable data table with responsive design.

```tsx
import { DataTable } from '@/components/ui';

const columns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'status', title: 'Status', render: (value) => <Badge variant="success">{value}</Badge> }
];

<DataTable
  data={users}
  columns={columns}
  sortBy="name"
  sortDirection="asc"
  onSort={(key) => console.log('Sort by:', key)}
  onRowClick={(row) => console.log('Row clicked:', row)}
/>
```

#### Modal
Accessible modal component with overlay and keyboard navigation.

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
  size="md"
  closeOnOverlayClick={true}
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex justify-end space-x-2 mt-4">
    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
    <button onClick={handleConfirm}>Confirm</button>
  </div>
</Modal>
```

### Feedback Components

#### Toast
Modern toast notifications with multiple types and animations.

```tsx
import { Toast, ToastContainer } from '@/components/ui';

// Individual toast
<Toast
  id="success-1"
  type="success"
  title="Success!"
  message="Your changes have been saved."
  duration={5000}
  onClose={(id) => removeToast(id)}
/>

// Toast container
<ToastContainer
  toasts={toastList}
  onClose={removeToast}
  position="top-right"
/>
```

#### Badge
Flexible badge system with semantic variants.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="error" size="lg">Error</Badge>
```

### Form Components

#### Dropdown
Modern dropdown with search and keyboard navigation.

```tsx
import { Dropdown } from '@/components/ui';
import { User, Settings } from 'lucide-react';

const items = [
  { label: 'Profile', value: 'profile', icon: <User className="h-4 w-4" /> },
  { label: 'Settings', value: 'settings', icon: <Settings className="h-4 w-4" /> },
  { label: 'Logout', value: 'logout', disabled: true }
];

<Dropdown
  items={items}
  value={selectedValue}
  placeholder="Select an option"
  onSelect={(value) => setSelectedValue(value)}
  size="md"
/>
```

## 🎯 Usage Guidelines

### Importing Components
```tsx
// Import individual components
import { FeatureCard, MetricCard } from '@/components/ui';

// Import from specific files
import { FeatureCard } from '@/components/ui/feature-card';
```

### Styling
- All components use Tailwind CSS classes
- Brand colors are available as `proof-*` utilities
- Components accept `className` prop for custom styling
- Use the `cn` utility for conditional classes

### Accessibility
- All components include proper ARIA labels
- Keyboard navigation support where applicable
- Focus management for modals and dropdowns
- Screen reader friendly

### Responsive Design
- Mobile-first approach
- Consistent breakpoints across components
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Best Practices

1. **Consistent Usage**: Use the same component variants throughout the application
2. **Brand Colors**: Stick to the defined brand color palette
3. **Accessibility**: Always provide meaningful labels and descriptions
4. **Performance**: Use components efficiently to avoid unnecessary re-renders
5. **Testing**: Test components across different screen sizes and devices

## 🔧 Customization

### Extending Components
```tsx
// Create a custom variant
const CustomFeatureCard = ({ ...props }) => (
  <FeatureCard
    {...props}
    className={cn("custom-styles", props.className)}
  />
);
```

### Theme Customization
Update the brand colors in `tailwind.config.js` and `globals.css` to match your brand.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

When adding new components:
1. Follow the existing patterns and conventions
2. Include TypeScript interfaces for all props
3. Add proper accessibility attributes
4. Include hover and focus states
5. Test across different screen sizes
6. Update this documentation

## 📄 License

This component library is part of the ProofOfFit platform and follows the same licensing terms.
