import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Penghuni() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [rumah, setRumah] = useState([]);
  const [historyBayar, setHistoryBayar] = useState([]);
  const [showModalHistory, setShowModalHistory] = useState(false);
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


  const openModal = (item) => {
    setSelectedData(item);
    setShowModalEdit(true);
  };

    const openModalTambah = () => {
  setSelectedData({
    name: "",
    ktp_photo: null,
    status: "kontrak",
    phone: "",
    status_pernikahan: "",
  });
  setShowModalTambah(true);
};

    const closeModal = () => {
    setShowModalEdit(false);
    setShowModalTambah(false);
  };

  const fetchData = () => {
    API.get("/penghuni")
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
  const file = selectedData.ktp_photo;

  // 🔴 VALIDASI WAJIB FOTO
  if (!file) {
    Swal.fire({
      title: "Error!",
      text: "Foto KTP wajib diupload",
      icon: "error"
    });
    return;
  }

  // 🔴 VALIDASI FORMAT
  if (file instanceof File) {
    if (file.type !== "image/jpeg") {
      Swal.fire({
        title: "Error!",
        text: "Foto KTP harus format JPG/JPEG",
        icon: "error"
      });
      return;
    }
  }

  // 🔥 FORM DATA
  const formData = new FormData();

  formData.append("name", selectedData.name);
  formData.append("status", selectedData.status);
  formData.append("phone", selectedData.phone);
  formData.append("status_pernikahan", selectedData.status_pernikahan);
  formData.append("rumah_id", selectedData.rumah_id);

  // kirim file kalau user upload baru
  if (file instanceof File) {
    formData.append("ktp_photo", file);
  }

  // 🔥 HIT API (Laravel PUT via POST + _method)
  API.post(`/edit/penghuni/${selectedData.id}?_method=PUT`, formData)
    .then(() => {
      Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil diupdate",
        icon: "success",
        confirmButtonText: "OK"
      });

      closeModal();
      fetchData();
    })
    .catch(err => {
      Swal.fire({
        title: "Error!",
        text: "Gagal update data",
        icon: "error"
      });

      console.log(err.response || err);
    });
};

  const handleCreate = () => {
  const formData = new FormData();

  if (selectedData.ktp_photo) {
    const file = selectedData.ktp_photo;

      if (!selectedData.ktp_photo) {
    Swal.fire({
      title: "Error!",
      text: "Foto KTP wajib diupload",
      icon: "error"
    });
    return;
  }
    // cek type (MIME)
    if (file.type !== "image/jpeg") {
      Swal.fire({
        title: "Error!",
        text: "Foto KTP harus format JPG",
        icon: "error"
      });
      return;
    }
  }

  formData.append("name", selectedData.name);
  formData.append("status", selectedData.status);
  formData.append("phone", selectedData.phone);
  formData.append("status_pernikahan", selectedData.status_pernikahan);
  formData.append("rumah_id", selectedData.rumah_id);

  if (selectedData.ktp_photo) {
    formData.append("ktp_photo", selectedData.ktp_photo);
  }

  API.post("/tambah/penghuni", formData)
    .then(() => {
      Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil ditambahkan",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      closeModal();
      fetchData();
    })
    .catch(err => {
      console.log(err.response); // ⬅️ penting buat debug
    });
};

    useEffect(() => {
      API.get("/rumah")
        .then(res => setRumah(res.data))
        .catch(err => console.log(err));
    }, []);

const handleDelete = (id) => {
  Swal.fire({
    title: "Yakin?",
    text: "Data rumah akan dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal"
  }).then((result) => {
    if (result.isConfirmed) {
      API.delete(`/hapus/penghuni${id}`)
        .then(() => {
          Swal.fire({
            title: "Berhasil!",
            text: "Data berhasil dihapus",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });

          fetchData(); // refresh tabel
        })
        .catch(err => {
          Swal.fire({
            title: "Error!",
            text: "Gagal menghapus data",
            icon: "error"
          });
          console.log(err);
        });
    }
  });
};

const fetchHistoryPembayaran = (id) => {
  API.get(`/penghuni/${id}/pembayaran`)
    .then(res => {
      const fixed = res.data.map(item => ({
        ...item,
        namaBulan: namaBulan[item.bulan]
      }));

      setHistoryBayar(fixed);
      setShowModalHistory(true);
    })
    .catch(err => console.log(err));
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Data Penghuni
      </h1>

      <p>Total data: {data.length}</p>

      <div className="flex justify-end mr-14">
  <button
        onClick={openModalTambah}
        className="bg-green-600 hover:bg-gray-500 text-white px-3 py-1 rounded">
        Tambah penghuni
    </button>
</div>

<table className="mt-4 w-full border border-gray-300 border-collapse">
  <thead>
    <tr className="bg-gray-200">
      <th className="p-3 border">No</th>
      <th className="p-3 border">Nama</th>
      <th className="p-3 border">Nomor Rumah</th>
      <th className="p-3 border">No HP</th> 
      <th className="p-3 border">Status Penghuni</th> 
      <th className="p-3 border">Status Pernikahan</th> 
      <th className="p-3 border">Aksi</th>
    </tr>
  </thead>

  <tbody>
    {data.map((item, index) => (
      <tr key={item.id} className="text-center hover:bg-gray-50">
        <td className="p-3 border">{index + 1}</td>
        <td className="p-3 border">{item.name}</td>
        <td className="p-3 border">{item.rumah_aktif?.rumah?.nomor_rumah}</td>
        <td className="p-3 border">{item.phone}</td> 
        <td className="p-3 border">{item.status}</td> 
        <td className="p-3 border">  {item.status_pernikahan == 1 ? "Menikah" : "Belum Menikah"}</td> 
        <td className="p-3 border">
          <button 
          onClick={() => openModal(item)}
          className="bg-green-600 text-white px-2 py-1 rounded mx-2">
            Edit
          </button>
          <button 
          onClick={() => fetchHistoryPembayaran(item.id)}
          className="bg-orange-400 text-white px-2 py-1 rounded mx-2">
            Riwayat Pembayaran
          </button>
          <button 
          onClick={() => handleDelete(item.id)}
          className="bg-red-500 text-white px-2 py-1 rounded ml-2">
            Hapus
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{showModalEdit && (
  <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-blue-100 p-4 rounded-lg max-w-md w-full">
      
      <h2 className="text-lg font-semibold mb-2 text-center">
        Edit Penghuni
      </h2>

      <div className="mt-2">
        <label className="block text-black">Nama penghuni</label>
        <input
          type="text"
          value={selectedData?.name || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               name: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

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
        <label className="block text-black">Upload ktp</label>
        <input
          type="file"
          onChange={(e) =>
            setSelectedData({
              ...selectedData,
              ktp_photo: e.target.files[0],
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

    <div className="mt-2">
        <label className="block text-black">Nomor telepon</label>
        <input
          type="text"
          value={selectedData?.phone || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               phone: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

<div className="mt-2">
        <label className="block text-black">Status</label>
        <select
          value={selectedData?.status || ""}
          onChange={(e) =>
            setSelectedData({
              ...selectedData,
              status: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        >
          <option value="kontrak">Kontrak</option>
          <option value="tetap">Tetap</option>
        </select>
      </div>

   
      <div className="mt-2">
        <label className="block text-black">Status Pernikahan</label>
        <select
            value={selectedData?.status_pernikahan}
            onChange={(e) =>
                setSelectedData({
                ...selectedData,
                status_pernikahan: parseInt(e.target.value),
                })
            }
             className="w-full border border-gray-300 p-2 rounded-md bg-white"
        >
            <option value={1}>Menikah</option>
            <option value={0}>Belum menikah</option>
            </select>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        >
        Simpan
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

{showModalTambah && (
  <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-blue-100 p-4 rounded-lg max-w-md w-full">
      
      <h2 className="text-lg font-semibold mb-2 text-center">
        Tambah Penghuni
      </h2>

      <div className="mt-2">
        <label className="block text-black">Nama penghuni</label>
        <input
          type="text"
          value={selectedData?.name || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               name: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

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
        <label className="block text-black">Upload ktp</label>
        <input
        type="file"
        onChange={(e) =>
            setSelectedData({
            ...selectedData,
            ktp_photo: e.target.files[0],
            })
        }
            className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

    <div className="mt-2">
        <label className="block text-black">Nomor telepon</label>
        <input
          type="text"
          value={selectedData?.phone || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               phone: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white"
        />
      </div>

<div className="mt-2">
        <label className="block text-black">Status</label>
        <select
          value={selectedData?.status || ""}
          onChange={(e) =>
            setSelectedData({
              ...selectedData,
              status: e.target.value,
            })
          }
          className="w-full border border-gray-300 p-2 rounded-md bg-white" 
        >
          <option value="kontrak">Kontrak</option>
          <option value="tetap">Tetap</option>
        </select>
      </div>

   
      <div className="mt-2">
        <label className="block text-black">Status Pernikahan</label>
        <select
            value={selectedData?.status_pernikahan ?? ""}
            onChange={(e) =>
              setSelectedData({
                ...selectedData,
                status_pernikahan: e.target.value, // TANPA parseInt juga boleh
              })
            }
          className="w-full border border-gray-300 p-2 rounded-md bg-white" 
          >
            <option value="">Pilih</option>
            <option value="1">Menikah</option>
            <option value="0">Belum menikah</option>
          </select>
      </div>

      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        >
        Simpan
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

{showModalHistory && (
  <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg w-[600px]">

      <h2 className="text-lg font-bold mb-3 text-center">
        History Pembayaran
      </h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Bulan</th>
            <th className="border p-2">Tahun</th>
            <th className="border p-2">Rumah</th>
            <th className="border p-2">Jumlah</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {historyBayar.length > 0 ? (
            historyBayar.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="border p-2">{item.namaBulan}</td>
                <td className="border p-2">{item.tahun}</td> 
                <td className="border p-2">
                  {item.rumah?.nomor_rumah}
                </td>
                <td className="border p-2">
                  Rp {Number(item.total).toLocaleString()}
                </td>
                {/* <td className="border p-2">{item.status}</td>  */}
                <td className="p-3 border">
                <span className={item.status === "lunas" ? "text-green-600" : "text-red-500"}>
                  {item.status}
                </span>
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-3">
                Belum ada pembayaran
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={() => setShowModalHistory(false)}
        className="bg-red-500 text-white px-4 py-2 mt-3 rounded w-full"
      >
        Tutup
      </button>
    </div>
  </div>
)}


    </div>
  );
}

export default Penghuni;