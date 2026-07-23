import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { VisitTimelinePoint } from '../../lib/stats';

interface VisitTimelineChartProps {
  data: VisitTimelinePoint[];
}

function TimelineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: VisitTimelinePoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg bg-ink px-3 py-2 shadow-lift">
      <p className="text-xs text-white/70">{label}</p>
      <p className="text-sm font-medium text-white">
        {point.visits} visit{point.visits === 1 ? '' : 's'} · {point.cumulative} total
      </p>
    </div>
  );
}

/** Cumulative cafes visited over time — the collection's growth curve. */
export function VisitTimelineChart({ data }: VisitTimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="visitTimelineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6FA8DC" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6FA8DC" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#F1DCE7" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#718096' }}
          axisLine={{ stroke: '#F1DCE7' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#718096' }}
          axisLine={false}
          tickLine={false}
          width={32}
          allowDecimals={false}
        />
        <Tooltip content={<TimelineTooltip />} cursor={{ stroke: '#6FA8DC', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke="#4F8BC4"
          strokeWidth={2.5}
          fill="url(#visitTimelineFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
