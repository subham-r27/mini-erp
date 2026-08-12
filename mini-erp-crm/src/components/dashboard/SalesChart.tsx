import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  import { salesOverview } from "../../data/mockData";
  
  function formatCurrency(value: number) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  
  export default function SalesChart() {
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={salesOverview}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
  
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
            />
  
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              tickFormatter={formatCurrency}
            />
  
            <Tooltip
              cursor={{
                stroke: "#cbd5e1",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Sales",
              ]}
            />
  
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 3,
                stroke: "#ffffff",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }