import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Penghuni() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalTambah, setShowModalTambah] = useState(false);


  const openModal = (item) => {
    setSelectedData(item);
    setShowModalEdit(true);
  };

    const openModalTambah = () => {
  setSelectedData({
    name: "",
    ktp_photo: "",
    status: "",
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
    API.put(`/edit/penghuni/${selectedData.id}`, {
      name: selectedData.name,
      ktp_photo: selectedData.ktp_photo,
      status: selectedData.status,
      phone: selectedData.phone,
      status_pernikahan: selectedData.status_pernikahan,
    })
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
      console.log(err);
    });
  };

   const handleCreate = () => {
  const formData = new FormData();

  formData.append("name", selectedData.name);
  formData.append("ktp_photo", selectedData.ktp_photo);
  formData.append("status", selectedData.status);
  formData.append("phone", selectedData.phone);
  formData.append("status_pernikahan", selectedData.status_pernikahan);

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
        Swal.fire({
            title: "Error!",
            text: "Gagal menambahkan data",
            icon: "error"
        });
        console.log(err);
        });
    };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Data Penghuni
      </h1>

      <p>Total data: {data.length}</p>

      <div className="flex justify-end mr-56">
  <button
        onClick={openModalTambah}
        className="bg-green-600 hover:bg-gray-500 text-white px-3 py-1 rounded">
        Tambah rumah
    </button>
</div>

      <table className="mt-4 w-full border border-gray-300 border-collapse">
  <thead>
    <tr className="bg-gray-200">
      <th className="p-3 border">No</th>
      <th className="p-3 border">Nama</th>
      <th className="p-3 border">Nomor Rumah</th>
      <th className="p-3 border">No HP</th>
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
        <td className="p-3 border">
          <button 
          onClick={() => openModal(item)}
          className="bg-green-600 text-white px-2 py-1 rounded">
            Edit
          </button>
          <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">
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
        <label className="block text-black">Upload ktp</label>
        <input
          type="text"
          value={selectedData?.ktp_photo || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               ktp_photo: e.target.value,
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


    </div>
  );
}

export default Penghuni;