import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusService = ({ studentData }) => {
  const [assignedBus, setAssignedBus] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    studentData['assignedBusID'] &&
      axios
        .get(
          `https://schoolapi.vsngroups.com/api/Bus/${studentData['assignedBusID']}`
        )
        .then((res) => {
          !Object.keys(res.data).length == 0 &&
            setAssignedBus({ ...res.data, stops: JSON.parse(res.data?.stops) }),
            setLoading(false);
        });
  }, [studentData['assignedBusID']]);

  if (studentData['assignedBusID'] && loading) {
    return (
      <p className="text-center text-slate-400 text-lg py-4 italic">
        Loading bus details...
      </p>
    );
  }

  if (!studentData['assignedBusID']) {
    return (
      <p className="text-center text-slate-400 text-lg py-4 italic">
        You have not opted for the bus service.
      </p>
    );
  }

  return (
    <div>
      <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
        My Bus Service
        <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
      </h2>
      <div className="bg-white/90 backdrop-blur-md text-black p-8 rounded-2xl shadow-2xl hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300 w-full max-w-2xl mx-auto border-2 border-orange-300">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">
                Route
              </span>
              <span className="text-lg font-semibold">{assignedBus?.route}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">
                Bus No
              </span>
              <span className="text-lg font-semibold">{assignedBus?.busNo}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">
                Driver
              </span>
              <span className="text-lg font-semibold">{assignedBus?.driver}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">
                Contact
              </span>
              <span className="text-lg font-semibold">{assignedBus?.contact}</span>
            </div>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-orange-500 font-bold">
              Stops
            </span>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.isArray(assignedBus?.stops) &&
                assignedBus?.stops.map((stop, i) => (
                  <li
                    key={i}
                    className="bg-orange-50 border border-orange-300 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm hover:bg-orange-100 transition-colors"
                  >
                    <span className="font-semibold text-orange-600">{stop?.name}</span>
                    <span className="ml-auto text-xs text-gray-500">{stop?.time}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusService;

// // FileUpload.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// function FileUpload() {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     try {
//       setUploading(true);
//       const res = await axios.post("https://schoolapi.vsngroups.com/api/Upload", formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setMessage("Upload successful: " + res.data.fileName);
//     } catch (err) {
//       setMessage("Upload failed: " + err.response?.data || err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="upload-container">
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default FileUpload;
