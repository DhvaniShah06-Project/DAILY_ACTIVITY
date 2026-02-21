'use client';

import { format, isToday, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DateSelectorProps = {
  selectedDate: Date;
  onDateChange: (newDate: Date) => void;
};

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
      <Button variant="ghost" size="icon" onClick={handlePrevDay}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="text-center">
        <p className="text-lg font-semibold font-headline">
          {format(selectedDate, 'eeee, d MMMM')}
        </p>
        {isToday(selectedDate) && (
          <p className="text-sm text-primary">Today</p>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={handleNextDay}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
