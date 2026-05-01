import { useEffect, useState } from "react";
import API from "../services/api";
import ChartKeuangan from "../components/ChartKeuangan";

  const namaBulan = [
      "", 
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];

function Dashboard() {
    console.log("DASHBOARD TERLOAD");
  const [data, setData] = useState([]);


useEffect(() => {
  console.log("API HIT:", "/pengeluaran/total");

  API.get("/pengeluaran/total")
    .then(res => {
      console.log(res.data);

      const fixedData = res.data.map(item => ({
        bulan: Number(item.bulan),
        namaBulan: namaBulan[Number(item.bulan)],   
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

      
    <table className="mt-4 w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Bulan</th>
            <th className="p-3 border">Pemasukan</th>
            <th className="p-3 border">Pengeluaran</th>
            <th className="p-3 border">Saldo</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center hover:bg-gray-50">
              <td className="p-3 border">{item.namaBulan}</td>
              <td className="p-3 border">{item.pemasukan}</td>
              <td className="p-3 border">{item.pengeluaran}</td>
              <td className="p-3 border">{item.saldo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;