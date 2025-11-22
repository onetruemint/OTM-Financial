import { Clock } from 'lucide-react';
import { calculateReadingTime, formatReadingTime } from '@/lib/utils';

interface ReadingTimeProps {
  content: string;
  className?: string;
}

export default function ReadingTime({ content, className = '' }: ReadingTimeProps) {
  const minutes = calculateReadingTime(content);

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <Clock size={14} />
      {formatReadingTime(minutes)}
    </span>
  );
}
