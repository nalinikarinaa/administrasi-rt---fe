 import { Link } from "react-router-dom";

function Header() {
  return (
<div className="bg-gray-600 text-white px-6 py-4 flex justify-between items-center shadow">
      
      <h1 className="text-xl font-bold">
        Administrasi RT
      </h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/penghuni" className="hover:underline">Penghuni</Link>
        <Link to="/rumah" className="hover:underline">Rumah</Link>
        <Link to="/pembayaran" className="hover:underline">Pembayaran</Link>
        <Link to="/pengeluaran" className="hover:underline">Pengeluaran</Link>
      </div>

    </div>
  );
}

export default Header;