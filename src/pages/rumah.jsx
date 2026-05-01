import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Rumah() {
  const [data, setData] = useState([]);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const openModal = (item) => {
    setSelectedData(item);
    setShowModalEdit(true);
  };

  const openModalTambah = () => {
  setSelectedData({
    nomor_rumah: "",
    status: "",
  });
  setShowModalTambah(true);
};

  const closeModal = () => {
    setShowModalEdit(false);
    setShowModalTambah(false);
  };

  const fetchData = () => {
    API.get("/rumah")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  //EDIT
  const handleUpdate = () => {
    API.put(`/rumah/${selectedData.id}`, {
      status: selectedData.status,
      nomor_rumah: selectedData.nomor_rumah,
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

  //HAPUS
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
      API.delete(`/rumah/${id}`)
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
  
//TAMBAH RUMAHHHHH
const handleCreate = () => {
  API.post("/rumah", {
    nomor_rumah: selectedData.nomor_rumah,
    status: selectedData.status,
  })
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
         Data Rumah
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
      <th className="p-3 border border-gray-300">No</th>
      <th className="p-3 border border-gray-300">Nomor Rumah</th>
      <th className="p-3 border border-gray-300">Status Rumah</th> 
      <th className="p-3 border border-gray-300">Nama penghuni</th>
      <th className="p-3 border border-gray-300">Status Penghuni</th> 
      <th className="p-3 border border-gray-300">Aksi</th>
    </tr>
  </thead>

  <tbody>
    {data.map((item, index) => (
      <tr key={item.id} className="text-center hover:bg-gray-50">
        <td className="p-3 border border-gray-300">{index + 1}</td>
        <td className="p-3 border border-gray-300">{item.nomor_rumah}</td>
        <td className="p-3 border border-gray-300">{item.status}</td> 
        <td className="p-3 border border-gray-300">  {item.penghuni_relasi.length > 0
                                                         ? item.penghuni_relasi[0].penghuni?.name: "-"}</td>
        <td className="p-3 border border-gray-300">  {item.penghuni_relasi.length > 0
                                                         ? item.penghuni_relasi[0].penghuni?.status: "-"}</td> 
       
        <td className="p-3 border border-gray-300">
          <button
            onClick={() => openModal(item)}
            className="bg-green-600 hover:bg-gray-500 text-white px-3 py-1 rounded">
            Edit
            </button>
         <button 
         onClick={() => handleDelete(item.id)}
         className="bg-red-500 hover:bg-gray-500 text-white px-3 py-1 rounded ml-5">
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
        Edit Rumah
      </h2>

      <div className="mt-2">
        <label className="block text-black">Nomor Rumah</label>
        <input
          type="text"
          value={selectedData?.nomor_rumah || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               nomor_rumah: e.target.value,
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
          <option value="kosong">Kosong</option>
          <option value="terisi">Terisi</option>
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
        Tambah Rumah
      </h2>

      <div className="mt-2">
        <label className="block text-black">Nomor Rumah</label>
        <input
          type="text"
          value={selectedData?.nomor_rumah || ""}
           onChange={(e) =>
            setSelectedData({
              ...selectedData,
               nomor_rumah: e.target.value,
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
          <option value="kosong">Kosong</option>
          <option value="terisi">Terisi</option>
        </select>
      </div>

      <button
      onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        >
        Tambah rumah
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

export default Rumah;

