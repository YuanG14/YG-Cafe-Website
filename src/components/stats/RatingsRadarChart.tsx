import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { RatingBreakdownPoint } from '../../lib/stats';

interface RatingsRadarChartProps {
  data: RatingBreakdownPoint[];
}

/** Average rating per category — shows where the ratings lean strongest. */
export function RatingsRadarChart({ data }: RatingsRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#F1DCE7" />
        <PolarAngleAxis dataKey="label" tick={{ fontSize: 12, fill: '#718096' }} />
        <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke="#E894BB"
          fill="#F8BBD9"
          fillOpacity={0.45}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
