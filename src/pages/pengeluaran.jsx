import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

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
function Pengeluaran() {
    console.log("DASHBOARD TERLOAD");
    const [data, setData] = useState([]);
    const [showModalTambah, setShowModalTambah] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [selectedPeriode, setSelectedPeriode] = useState(null);
    const [tahun, setTahun] = useState(new Date().getFullYear());


    const openModalTambah = () => {
      setSelectedData({
        nomor_rumah: "",
        status: "",
      });
      setShowModalTambah(true);
    };

      const closeModal = () => {
        setShowModalTambah(false);
        setShowModalDetail(false);
      };

//DETAIL BERSADAR BULAN      
    const openDetail = (item) => {
      setSelectedPeriode(item);

      API.get(`/report/detail?bulan=${item.bulan}&tahun=${item.tahun}`)
        .then((res) => {
          console.log("DETAIL RES:", res.data); 

          setDetailData(res.data.pengeluaran || []); 
          setShowModalDetail(true);
        })
        .catch((err) => {
          console.log(err);
          setDetailData([]); // ⬅️ safety
        });
    };

//AMBIL TOTAL PENGELUARAN    
      const fetchData = () => {
      console.log("API HIT:", "/pengeluaran/total");

    API.get("/pengeluaran/total")
        .then(res => {
          const fixedData = (res.data || []).map(item => ({
            bulan: item.bulan, 
            namaBulan: namaBulan[item.bulan], 
            tahun: item.tahun,
            pemasukan: Number(item.pemasukan),
            pengeluaran: Number(item.pengeluaran),
            saldo: Number(item.saldo),
          }));


          setData(fixedData);
        })
        .catch(err => console.log(err));
    };

useEffect(() => {
  fetchData();
}, []);

//TAMBAH PENGELUARAN
    const handleCreate = () => {
      API.post("tambah/pengeluaran", {
        date: selectedData?.date,
        judul: selectedData?.judul,
        jumlah: selectedData?.jumlah,
        deskripsi: selectedData?.deskripsi,
      })
        .then(() => {
          Swal.fire({
            title: "Berhasil!",
            text: "Pembayaran berhasil ditambahkan",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          closeModal();
          fetchData();

          // RESET FORM 
          setSelectedData({
            date: "",
            judul: "",
            jumlah: "",
            deskripsi: "",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message || "Gagal menambahkan pembayaran",
            icon: "error",
          });

          console.log(err.response || err);
        });
    };  

//AMBIL DATA BY YEAR    
    const getDataByYear = (year) => {
      API.get(`/pengeluaran/total?tahun=${year}`)
        .then(res => {
          const fixedData = (res.data || []).map(item => ({
            bulan: Number(item.bulan),
            namaBulan: namaBulan[Number(item.bulan)],
            tahun: item.tahun,
            pemasukan: Number(item.pemasukan),
            pengeluaran: Number(item.pengeluaran),
            saldo: Number(item.saldo),
          }));

          setData(fixedData);
        });
    };

 return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
            Data Pengeluaran
      </h1>

    <div className="flex justify-end mr-10">

    <div className="px-5">
    <select
            value={tahun}
            onChange={(e) => {
              setTahun(e.target.value);
              getDataByYear(e.target.value);
            }}
            className="border p-2 rounded-md ml-2 "
          >
            {[2026, 2025, 2024, 2023].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
    </div>

    <button
          onClick={openModalTambah}
          className="bg-green-600 hover:bg-gray-500 text-white px-3 py-1 rounded">
          Tambah pengeluaran
    </button>
  </div>
      

     <table className="mt-4 w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-1 border border-gray-300">Bulan</th> 
            <th className="p-1 border border-gray-300">Jumlah</th>
            <th className="p-1 border border-gray-300">Aksi</th> 
            
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center hover:bg-gray-50">
              <td className="p-1 border border-gray-300">{item.namaBulan}</td>
              <td className="p-1 border border-gray-300">Rp {Number(item.pengeluaran).toLocaleString("id-ID")}</td>
              <td className="p-1 border border-gray-300"> 
                <button
                      onClick={() => openDetail(item)}
                    className="bg-yellow-400 hover:bg-gray-500 text-white px-3 py-1 rounded">
                    Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    {showModalTambah && (
      <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-blue-100 p-4 rounded-lg max-w-md w-full">
          
          <h2 className="text-lg font-semibold mb-2 text-center">
            Tambah Pengeluaran
          </h2>

      <div className="mt-2">
        <label className="block text-black"> Tanggal</label>
        <input
          type="date"
          value={selectedData?.date || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               date: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

        <div className="mt-2">
        <label className="block text-black"> Nama Pengeluaran</label>
        <input
          type="text"
          value={selectedData?.judul || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               judul: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

      <div className="mt-2">
        <label className="block text-black"> Deskripsi</label>
        <input
          type="text"
          value={selectedData?.deskripsi || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               deskripsi: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

      <div className="mt-2">
        <label className="block text-black"> Jumlah</label>
        <input
          type="text"
          value={selectedData?.jumlah || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               jumlah: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

          <button
          onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
            >
            Tambah pengeluaran
        </button>

          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-4 py-2 mt-3 rounded w-full hover:bg-gray-600"
          >
            Tutup
          </button>
        </div>
      </div>
    )}

    {showModalDetail && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg w-[600px]">

          <h2 className="text-lg font-bold mb-3">
            Detail Pengeluaran - Bulan {selectedPeriode?.namaBulan} {selectedPeriode?.tahun}
          </h2>

           <table className="mt-4 w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-1 border border-gray-300">No</th>
            <th className="p-1 border border-gray-300">Tanggal</th>
            <th className="p-1 border border-gray-300">Nama Pengeluaran</th>
            <th className="p-1 border border-gray-300">Deskripsi</th> 
            <th className="p-1 border border-gray-300">Jumlah</th>
            
          </tr>
        </thead>

       <tbody>
        {detailData.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center p-2">
              Tidak ada pengeluaran
            </td>
          </tr>
        ) : (
          detailData.map((item, index) => (
            <tr key={item.id} className="text-center hover:bg-gray-50">
              <td className="p-1 border border-gray-300">
                {index + 1}
              </td>

              <td className="p-1 border border-gray-300">
                {new Date(item.date).toLocaleDateString("id-ID")}
              </td>

              <td className="p-1 border border-gray-300">
                {item.judul}
              </td>

              <td className="p-1 border border-gray-300">
                {item.deskripsi}
              </td>

              <td className="p-1 border border-gray-300">
                Rp {Number(item.jumlah).toLocaleString("id-ID")}
              </td>
            </tr>
          ))
        )}
      </tbody>
      </table>

          <button
            onClick={() => setShowModalDetail(false)}
            className="mt-3 bg-red-500 text-white px-3 py-1 rounded w-full"
          >
            Tutup
          </button>
        </div>
      </div>
    )}

        </div>
      );
    }

    export default Pengeluaran;