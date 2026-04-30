import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

function ChartKeuangan({ data }) {
  console.log("CHART COMPONENT KELOAD");
  console.log("DATA MASUK CHART:", data);

  return (
    <div className="bg-white p-4 rounded shadow mt-6 w-full">
      <h2 className="text-lg font-bold mb-4">
        Grafik Keuangan
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="pemasukan" stroke="#3b82f6" />
            <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" />
            <Line type="monotone" dataKey="saldo" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartKeuangan;