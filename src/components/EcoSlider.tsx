import { Slider } from "@/components/ui/slider";
import { LucideIcon } from "lucide-react";

interface EcoSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon: LucideIcon;
  description?: string;
}

export const EcoSlider = ({ 
  label, 
  value, 
  onValueChange, 
  min, 
  max, 
  step = 1, 
  unit = '',
  icon: Icon,
  description
}: EcoSliderProps) => {
  const handleValueChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  return (
    <div className="glass rounded-lg p-4 transition-glass">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-medium text-foreground">{label}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-foreground">
            {value.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};