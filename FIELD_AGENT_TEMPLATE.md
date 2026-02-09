# Field Agent Module Template

This template provides a consistent structure for developing field agent features that match the Openreach ORIT theme and UI patterns.

## Design System

### Color Palette
```css
--openreach-teal: #0a9c82
--openreach-teal-dark: #088a72
--openreach-dark: #073b4c
--openreach-gradient: linear-gradient(-225deg, #0a9c82, #4ac59d)
--background: #f3f4f6
```

### Typography
- Font: 'Inter', 'Openreach', Helvetica, sans-serif
- Headings: 700 weight
- Body: 400-600 weight

## Component Templates

### 1. Page Container
```tsx
<div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
  {/* Content */}
</div>
```

### 2. Page Header
```tsx
<div style={{ marginBottom: '2rem' }}>
  <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#073b4c', marginBottom: '0.5rem' }}>
    Page Title
  </h2>
  <p style={{ color: '#6b7280' }}>Subtitle or metadata</p>
</div>
```

### 3. Card Component
```tsx
<div style={{
  background: 'white',
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: '2px solid transparent',
  transition: 'all 0.2s'
}}>
  {/* Card content */}
</div>
```

### 4. Interactive Card (Hover Effect)
```tsx
<div
  style={{
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#0a9c82';
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,156,130,0.2)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'transparent';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }}
>
  {/* Card content */}
</div>
```

### 5. Status Badge
```tsx
<span style={{
  padding: '0.5rem 1rem',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '600',
  background: '#e0f2fe',  // Blue for active
  color: '#075985'
}}>
  Status Text
</span>
```

**Badge Color Variants:**
- Active/Ready: `background: '#e0f2fe', color: '#075985'`
- Waiting: `background: '#fef3c7', color: '#92400e'`
- Complete: `background: '#dcfce7', color: '#166534'`
- Error: `background: '#fee2e2', color: '#991b1b'`

### 6. Primary Button
```tsx
<button style={{
  background: 'linear-gradient(-225deg, #0a9c82, #4ac59d)',
  border: 'none',
  borderRadius: '12px',
  color: 'white',
  padding: '11px 20px',
  minWidth: '175px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}}
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 156, 130, 0.3)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'none';
}}>
  Button Text
</button>
```

### 7. Secondary Button
```tsx
<button style={{
  background: 'white',
  border: '2px solid #0a9c82',
  borderRadius: '12px',
  color: '#0a9c82',
  padding: '11px 20px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s'
}}>
  Button Text
</button>
```

### 8. Empty State
```tsx
<div style={{ 
  textAlign: 'center', 
  padding: '4rem', 
  background: 'white', 
  borderRadius: '16px', 
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
}}>
  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
    No Items Found
  </h3>
  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Description text</p>
</div>
```

### 9. Info Grid
```tsx
<div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
  <div style={{ flex: 1 }}>
    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Label</p>
    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#073b4c' }}>Value</p>
  </div>
</div>
```

### 10. Input Field
```tsx
<input
  type="text"
  style={{
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    width: '100%',
    transition: 'all 0.2s'
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = '#0a9c82';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10, 156, 130, 0.1)';
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = '#d1d5db';
    e.currentTarget.style.boxShadow = 'none';
  }}
/>
```

## Full Page Example

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';

const FieldAgentTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [items, setItems] = useState([]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#073b4c', marginBottom: '0.5rem' }}>
          Field Agent Dashboard
        </h2>
        <p style={{ color: '#6b7280' }}>
          Agent: {user?.username} • {user?.region} • {items.length} items
        </p>
      </div>

      {/* Action Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <button style={{
          background: 'linear-gradient(-225deg, #0a9c82, #4ac59d)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          padding: '11px 20px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Primary Action
        </button>
        <button style={{
          background: 'white',
          border: '2px solid #0a9c82',
          borderRadius: '12px',
          color: '#0a9c82',
          padding: '11px 20px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Secondary Action
        </button>
      </div>

      {/* Content Grid */}
      {items.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
            No Items Available
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Check back later</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {items.map((item: any) => (
            <div
              key={item.id}
              onClick={() => navigate(`/agent/item/${item.id}`)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0a9c82';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,156,130,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#073b4c', marginBottom: '0.25rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{item.description}</p>
                </div>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: '#e0f2fe',
                  color: '#075985'
                }}>
                  {item.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Field 1</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#073b4c' }}>{item.field1}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Field 2</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#073b4c' }}>{item.field2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldAgentTemplate;
```

## Icons & Emojis

Use these for visual consistency:
- 📋 Lists/Orders
- 🚀 Ready/Active
- ⏳ Waiting/Pending
- ✓ Complete/Success
- ⚠️ Warning
- ❌ Error
- 📍 Location
- 🔧 Tools/Work
- 📞 Support
- 📊 Analytics

## Responsive Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */
```

Use flexWrap and responsive padding:
```tsx
style={{ 
  display: 'flex', 
  flexWrap: 'wrap',
  padding: 'clamp(1rem, 5vw, 2rem)'
}}
```

## Navigation Integration

Field agent routes should follow this pattern:
```tsx
// In App.tsx or routing config
<Route path="/agent/*" element={<FieldAgentRoutes />} />

// Field agent specific routes
/agent/dashboard
/agent/jobs
/agent/orders/:orderId
/agent/support
```

## Best Practices

1. **Consistency**: Always use the defined color palette and spacing
2. **Hover States**: Add interactive feedback on clickable elements
3. **Loading States**: Show skeleton or spinner during data fetch
4. **Empty States**: Always provide helpful empty state messages
5. **Mobile First**: Ensure responsive design for field agents on mobile
6. **Accessibility**: Use semantic HTML and proper contrast ratios
7. **Performance**: Minimize re-renders with proper React patterns
