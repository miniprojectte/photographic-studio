'use client';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Heart, 
  Share, 
  Settings, 
  Plus,
  ArrowRight,
  Trash2,
  Edit
} from 'lucide-react';

export default function ButtonExamples() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">shadcn/ui Button Examples</h1>
      
      <div className="space-y-8">
        {/* Variants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex items-center flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Icon Buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Icon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon-sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="icon-lg" variant="secondary">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Buttons with Icons and Text */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Plus className="h-4 w-4" />
              Add New
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button variant="secondary">
              Edit Profile
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Disabled States */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Disabled States</h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled Default</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
            <Button variant="destructive" disabled>
              <Trash2 className="h-4 w-4" />
              Disabled with Icon
            </Button>
          </div>
        </div>

        {/* Full Width Buttons */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Full Width Buttons</h2>
          <div className="space-y-4 max-w-md">
            <Button className="w-full" size="lg">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </div>

        {/* Interactive Examples */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Interactive Examples</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => alert('Button clicked!')}>
              Click Me
            </Button>
            <Button 
              variant="outline"
              onClick={() => console.log('Logged to console')}
            >
              Log to Console
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Usage in Your Code</h3>
        <p className="text-gray-600 mb-4">
          Import the Button component and use it throughout your application:
        </p>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="outline" size="lg">Large Outline Button</Button>

// With icons
<Button>
  <Plus className="h-4 w-4" />
  Add New Item
</Button>`}
        </pre>
      </div>
    </div>
  );
}