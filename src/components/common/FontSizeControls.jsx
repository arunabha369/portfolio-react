import { useEffect, useState } from 'react';
import { Minus, Plus, Settings } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';


export default function FontSizeControls() {
  const [fontSize, setFontSize] = useState(16);
  const { triggerHaptic } = useHapticFeedback();
  const isMobile = useIsMobile();

  // Load font size from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('blog-font-size');
    if (savedFontSize) {
      const size = parseInt(savedFontSize, 10);
      setFontSize(size);
      applyFontSize(size);
    }
  }, []);

  // Apply font size to the document
  const applyFontSize = (size) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(
        '--blog-font-size',
        `${size}px`,
      );
    }
  };

  // Save to localStorage and apply
  const updateFontSize = (newSize) => {
    const clampedSize = Math.max(12, Math.min(24, newSize));
    setFontSize(clampedSize);
    applyFontSize(clampedSize);
    localStorage.setItem('blog-font-size', clampedSize.toString());
  };

  const handleIncrease = () => {
    if (isMobile) {
      triggerHaptic('light');
    }
    updateFontSize(fontSize + 2);
  };

  const handleDecrease = () => {
    if (isMobile) {
      triggerHaptic('light');
    }
    updateFontSize(fontSize - 2);
  };

  const handleReset = () => {
    if (isMobile) {
      triggerHaptic('medium');
    }
    updateFontSize(16);
  };

  return (
    <>
      {/* Mobile: Drawer interface */}
      <div className="md:hidden">
        <Drawer>
          {/* Trigger button - top right */}
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-background/95 border-border hover:bg-accent fixed top-28 right-6 z-50 h-12 w-12 rounded-full border shadow-lg backdrop-blur-sm"
              aria-label="Open font size controls"
            >
              <Settings size={20} />
            </Button>
          </DrawerTrigger>

          {/* Drawer content */}
          <DrawerContent className="max-h-[60vh]">
            <DrawerHeader className="text-center">
              <DrawerTitle>Font Size Controls</DrawerTitle>
            </DrawerHeader>

            <div className="px-6 pb-8">
              <div className="flex flex-col items-center gap-6">
                {/* Font size display */}
                <div className="text-center">
                  <div className="text-foreground mb-1 font-mono text-4xl font-bold tracking-tighter">
                    {fontSize}px
                  </div>
                  <div className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                    Font Size
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 w-full justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecrease}
                    disabled={fontSize <= 12}
                    className="h-12 w-12 rounded-full shrink-0"
                    aria-label="Decrease font size"
                  >
                    <Minus size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="default"
                    onClick={handleReset}
                    className="h-10 px-6 font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground rounded-full"
                    aria-label="Reset font size"
                  >
                    Reset
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncrease}
                    disabled={fontSize >= 24}
                    className="h-12 w-12 rounded-full shrink-0"
                    aria-label="Increase font size"
                  >
                    <Plus size={18} />
                  </Button>
                </div>

                {/* Size range indicator */}
                <div className="w-full max-w-[240px] px-2">
                  <div className="text-muted-foreground/60 mb-3 flex justify-between text-[10px] font-medium uppercase tracking-wider">
                    <span>12px</span>
                    <span>24px</span>
                  </div>
                  <div className="bg-muted h-1.5 w-full rounded-full relative overflow-hidden">
                    <div
                      className="bg-primary/90 absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${((fontSize - 12) / (24 - 12)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Original vertical controls */}
      <div className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 md:flex">
        <div className="bg-background/95 border-border rounded-lg border p-2 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleIncrease}
                disabled={fontSize >= 24}
                className="h-8 w-8 p-0"
                aria-label="Increase font size"
              >
                <Plus size={14} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="hover:bg-accent h-10 px-1 font-mono text-xs whitespace-nowrap"
                aria-label="Reset font size"
              >
                {fontSize}px
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrease}
                disabled={fontSize <= 12}
                className="h-8 w-8 p-0"
                aria-label="Decrease font size"
              >
                <Minus size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}