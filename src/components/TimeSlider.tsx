import { Slider } from '@/components/ui/slider';

interface TimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const TimeSlider = ({ value, onChange }: TimeSliderProps) => {
  const months = [1, 3, 6, 12];
  const labels = ['1 month', '3 months', '6 months', '1 year'];

  const getMonthIndex = (val: number) => {
    return months.findIndex(m => m === val) ?? 0;
  };

  const handleChange = (values: number[]) => {
    const index = Math.round(values[0]);
    onChange(months[index]);
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Time Projection</span>
        <span className="text-sm text-primary font-display font-bold">
          {labels[getMonthIndex(value)]}
        </span>
      </div>
      
      <Slider
        value={[getMonthIndex(value)]}
        onValueChange={handleChange}
        max={3}
        min={0}
        step={1}
        className="w-full"
      />

      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {labels.map((label, i) => (
          <span 
            key={label} 
            className={getMonthIndex(value) === i ? 'text-primary' : ''}
          >
            {label.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TimeSlider;
