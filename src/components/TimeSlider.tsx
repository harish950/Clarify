import { Slider } from '@/components/ui/slider';

interface TimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const TimeSlider = ({ value, onChange }: TimeSliderProps) => {
  const months = [1, 3, 6, 12];
  const labels = ['1 mo', '3 mo', '6 mo', '1 yr'];

  const getMonthIndex = (val: number) => {
    return months.findIndex(m => m === val) ?? 0;
  };

  const handleChange = (values: number[]) => {
    const index = Math.round(values[0]);
    onChange(months[index]);
  };

  return (
    <div className="surface-elevated rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Time Projection</span>
        <span className="text-sm text-primary font-semibold">
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

      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        {labels.map((label, i) => (
          <span key={label} className={getMonthIndex(value) === i ? 'text-primary font-medium' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TimeSlider;
