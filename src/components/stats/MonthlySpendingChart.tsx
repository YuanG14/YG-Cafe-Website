import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../lib/currency';
import type { MonthlySpendingPoint } from '../../lib/stats';

interface MonthlySpendingChartProps {
  data: MonthlySpendingPoint[];
}

function SpendingTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg bg-ink px-3 py-2 shadow-lift">
      <p className="text-xs text-white/70">{label}</p>
      <p className="text-sm font-medium text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

/** Bar chart of spend-per-month across the whole collection. */
export function MonthlySpendingChart({ data }: MonthlySpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
          width={44}
          tickFormatter={(v) => (v === 0 ? '0' : formatCurrency(v).replace(/\.00$/, ''))}
        />
        <Tooltip content={<SpendingTooltip />} cursor={{ fill: '#FCEEF5' }} />
        <Bar dataKey="total" fill="#F8BBD9" radius={[8, 8, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
