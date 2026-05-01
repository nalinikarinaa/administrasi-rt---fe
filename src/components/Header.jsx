import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className="bg-gray-600 text-white px-6 py-4 flex justify-between items-center shadow">
      
      <h1 className="text-xl font-bold">
        Administrasi RT
      </h1>

      <div className="flex gap-6">
        
        <NavLink 
          to="/" 
          className={({ isActive }) =>
            isActive ? "text-yellow-300 font-semibold" : "hover:underline"
          }
        >
          Dashboard
        </NavLink>

        <NavLink 
          to="/penghuni" 
          className={({ isActive }) =>
            isActive ? "text-yellow-300 font-semibold" : "hover:underline"
          }
        >
          Penghuni
        </NavLink>

        <NavLink 
          to="/rumah" 
          className={({ isActive }) =>
            isActive ? "text-yellow-300 font-semibold" : "hover:underline"
          }
        >
          Rumah
        </NavLink>

        <NavLink 
          to="/pembayaran" 
          className={({ isActive }) =>
            isActive ? "text-yellow-300 font-semibold" : "hover:underline"
          }
        >
          Pembayaran
        </NavLink>

        <NavLink 
          to="/pengeluaran" 
          className={({ isActive }) =>
            isActive ? "text-yellow-300 font-semibold" : "hover:underline"
          }
        >
          Pengeluaran
        </NavLink>

      </div>
    </div>
  );
}

export default Header;