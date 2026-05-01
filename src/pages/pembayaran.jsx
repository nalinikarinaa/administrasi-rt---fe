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
function Pembayaran() {
    console.log("DASHBOARD TERLOAD");
    const [data, setData] = useState([]);
    const [showModalTambah, setShowModalTambah] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [rumah, setRumah] = useState([]);
    const [penghuni, setPenghuni] = useState([]);
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


//DETAIL
    const openDetail = (item) => {
      setSelectedPeriode(item);

      API.get(`/pembayaran/detail?bulan=${item.bulan}&tahun=${item.tahun}`)
        .then((res) => {
          console.log("DETAIL RES:", res.data); 

          setDetailData(res.data.data || []); 
          setShowModalDetail(true);
        })
        .catch((err) => {
          console.log(err);
          setDetailData([]); 
        });
    };


//TOTAAL PENGELUARAN
      const fetchData = () => {
      console.log("API HIT:", "/pengeluaran/total");

    API.get("/pengeluaran/total")
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
        })
        .catch(err => console.log(err));
    };

        useEffect(() => {
      fetchData();
    }, []);

//TAMBAH PEMBAYARAN    
    const handleCreate = () => {
      API.post("/pembayaran", {
        rumah_id: selectedData?.rumah_id,
        penghuni_id: selectedData?.penghuni_id,
        bulan: selectedData?.bulan,
        tahun: selectedData?.tahun,
        jenis_pembayaran: selectedData?.jenis_pembayaran,
        status: selectedData?.status,
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
            rumah_id: "",
            penghuni_id: "",
            bulan: "",
            tahun: "",
            jenis_pembayaran: "bulanan",
            status: "belum_bayar",
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

//FETCH RUMAH SM PENGHUNI    
    useEffect(() => {
      API.get("/rumah")
        .then(res => setRumah(res.data))
        .catch(err => console.log(err));

      API.get("/penghuni")
        .then(res => setPenghuni(res.data))
        .catch(err => console.log(err));
    }, []);

//TAMPILIN DATA BERDASAR YEAR    
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
            Data Pembayaran
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
            {[2027, 2026, 2025, 2024, 2023].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
    </div>

    <button
          onClick={openModalTambah}
          className="bg-green-600 hover:bg-gray-500 text-white px-3 py-1 rounded">
          Tambah pembayaran
    </button>
  </div>
      
      

     <table className="mt-4 w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-1 border border-gray-300">Bulan</th>
            <th className="p-1 border border-gray-300">Pemasukan</th>
            <th className="p-1 border border-gray-300">Pengeluaran</th>
            <th className="p-1 border border-gray-300">Saldo</th>
            <th className="p-1 border border-gray-300">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center hover:bg-gray-50">
              <td className="p-1 border border-gray-300">{item.namaBulan  }</td>
              <td className="p-1 border border-gray-300">{item.pemasukan}</td>
              <td className="p-1 border border-gray-300">{item.pengeluaran}</td>
              <td className="p-1 border border-gray-300">Rp {Number(item.saldo).toLocaleString("id-ID")}</td>
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
            Tambah Pembayaran
          </h2>

        <div className="mt-2">
          <label className="block text-black">Rumah</label>
          <select
            value={selectedData?.rumah_id || ""}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                rumah_id: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
          >
            <option value="">Pilih Rumah</option>
            {rumah.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nomor_rumah}
              </option>
            ))}
          </select>
          </div>

          <div className="mt-2">
          <label className="block text-black">Penghuni</label>
          <select
            value={selectedData?.penghuni_id || ""}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                penghuni_id: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
          >
            <option value="">Pilih Penghuni</option>
            {penghuni.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          </div>

          <div className="mt-2">
          <label className="block text-black">Bulan</label>
          <select
            value={selectedData?.bulan || ""}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                bulan: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
          >
            <option value="">Pilih Bulan</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
          </div>

          <div className="mt-2">
          <label className="block text-black">Tahun</label>
          <select
            value={selectedData?.tahun || ""}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                tahun: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
          >
            <option value="">Pilih Tahun</option>
            {[2026, 2025, 2024, 2023].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          </div>

          <div className="mt-2">
          <label className="block text-black">Jenis Pembayaran</label>
          <select
            value={selectedData?.jenis_pembayaran || "bulanan"}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                jenis_pembayaran: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
          >
            <option value="bulanan">Bulanan</option>
            <option value="tahunan">Tahunan</option>
          </select>
          </div>

          <div className="mt-2">
          <label className="block text-black">Status</label>
          <select
            value={selectedData?.status || "belum_bayar"}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                status: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
          >
            <option value="lunas">Lunas</option>
            <option value="belum_bayar">Belum Bayar</option>
          </select>
          </div>

          <button
          onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
            >
            Tambah pembayaran
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
            Detail Pembayaran - Bulan {selectedPeriode?.namaBulan} {selectedPeriode?.tahun}
          </h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-1">Nama</th>
                <th className="border p-1">Rumah</th>
                <th className="border p-1">Jenis</th>
                <th className="border p-1">Total</th>
                <th className="border p-1">Status</th>
              </tr>
            </thead>

            <tbody>
              {detailData.map((d, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-1">{d.penghuni?.name}</td>
                  <td className="border p-1">{d.rumah?.nomor_rumah}</td>
                  <td className="border p-1">{d.jenis_pembayaran}</td>
                  <td className="border p-1">
                    Rp {Number(d.total).toLocaleString("id-ID")}
                  </td>
                  <td className="border p-1"><span className={d.status === "lunas" ? "text-green-600" : "text-red-500"}>
                  {d.status}
                </span></td>
                </tr>
              ))}
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

    export default Pembayaran;