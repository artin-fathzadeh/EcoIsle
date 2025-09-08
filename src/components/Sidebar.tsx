import { useState } from 'react';
import { 
  Menu, 
  X, 
  BarChart3, 
  Settings, 
  Globe, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children: React.ReactNode;
  selectedCountry: string | null;
  score: { total: number; breakdown: any };
}

export const Sidebar = ({ children, selectedCountry, score }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarItems = [
    { icon: Globe, label: 'Map', active: true },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Activity, label: 'Simulation', active: !!selectedCountry },
    { icon: Settings, label: 'Settings', active: false }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-float px-4 py-3 border-b border-border/20">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">EcoIsle</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col glass-float border-r border-border/20 transition-glass",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-foreground">EcoIsle</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-glass",
                item.active 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Ecosystem Status */}
        {selectedCountry && !isCollapsed && (
          <div className="p-4 border-t border-border/20">
            <div className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Ecosystem Health</span>
              </div>
              <div className="text-2xl font-bold text-primary">{score.total}</div>
              <div className="text-xs text-muted-foreground">Active Simulation</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 glass-float border-r border-border/20">
            <div className="pt-16 p-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-glass",
                      item.active 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 pt-16 lg:pt-0 overflow-auto">
        {children}
      </div>
    </div>
  );
};