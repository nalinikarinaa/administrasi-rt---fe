import { useEffect, useState } from "react";
import API from "../services/api";
import ChartKeuangan from "../components/ChartKeuangan";

function Dashboard() {
    console.log("DASHBOARD TERLOAD");
  const [data, setData] = useState([]);

useEffect(() => {
  console.log("API HIT:", "/pengeluaran/total");

  API.get("/pengeluaran/total")
    .then(res => {
      console.log(res.data);

      const fixedData = res.data.map(item => ({
        bulan: item.bulan,
        pemasukan: Number(item.pemasukan),     
        pengeluaran: Number(item.pengeluaran), 
        saldo: Number(item.saldo),             
      }));

      console.log("FIXED DATA:", fixedData); // debug

      setData(fixedData);
    })
    .catch(err => console.log(err));
}, []);
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard Keuangan RT
      </h1>

  {/* CHART */}
      {data.length === 0 ? (
        <p>Loading data...</p>
        ) : (
        <ChartKeuangan data={data} />
        )}
      <h1>hhhqqqqwuy</h1>

      <table className="border w-full">
        <thead>
          <tr className="bg-gray-500">
            <th>Bulan</th>
            <th>Pemasukan</th>
            <th>Pengeluaran</th>
            <th>Saldo</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center">
              <td>{item.bulan}</td>
              <td>{item.pemasukan}</td>
              <td>{item.pengeluaran}</td>
              <td>{item.saldo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;