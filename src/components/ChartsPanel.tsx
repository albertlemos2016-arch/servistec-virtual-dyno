import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartsPanelProps {
  data: Array<Record<string, number | string>>;
}

export function ChartsPanel({ data }: ChartsPanelProps) {
  return (
    <div className="chart-grid">
      <div className="chart-card">
        <h3>Potência e torque</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2a3541" />
            <XAxis dataKey="name" stroke="#8ba0b6" />
            <YAxis stroke="#8ba0b6" />
            <Tooltip />
            <Area dataKey="power" stroke="#60a5fa" fill="url(#powerFill)" />
            <Area dataKey="torque" stroke="#f59e0b" fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>RPM × tempo</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid stroke="#2a3541" />
            <XAxis dataKey="name" stroke="#8ba0b6" />
            <YAxis stroke="#8ba0b6" />
            <Tooltip />
            <Area dataKey="rpm" stroke="#22c55e" fill="rgba(34,197,94,0.15)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Velocidade e rolos</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid stroke="#2a3541" />
            <XAxis dataKey="name" stroke="#8ba0b6" />
            <YAxis stroke="#8ba0b6" />
            <Tooltip />
            <Area dataKey="speed" stroke="#f472b6" fill="rgba(244,114,182,0.12)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Temperaturas e turbo</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid stroke="#2a3541" />
            <XAxis dataKey="name" stroke="#8ba0b6" />
            <YAxis stroke="#8ba0b6" />
            <Tooltip />
            <Area dataKey="temp" stroke="#f97316" fill="rgba(249,115,22,0.12)" />
            <Area dataKey="turbo" stroke="#a78bfa" fill="rgba(167,139,250,0.12)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
