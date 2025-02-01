import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0xD53d36627214E5E9ACFb62594D152021F13902c3";

export default function App() {
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const [ids, names] = await contract.getAllStudents();
      const studentList = ids.map((id, index) => ({ id, name: names[index] }));
      setStudents(studentList);
    } catch (error) {
      console.error(error);
    }
  }

  async function registerStudent() {
    if (!window.ethereum) return alert("Please install MetaMask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    setLoading(true);
    try {
      const tx = await contract.registerStudent(id, name);
      await tx.wait();
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  async function removeStudent(studentId) {
    if (!window.ethereum) return alert("Please install MetaMask");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    setLoading(true);
    try {
      const tx = await contract.removeStudent(studentId);
      await tx.wait();
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Student Registry</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="Student ID"
          className="w-full p-2 border rounded mb-2"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Student Name"
          className="w-full p-2 border rounded mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={registerStudent}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Student"}
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-6">Registered Students</h2>
      <div className="mt-4 w-full max-w-md">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex justify-between items-center bg-white p-4 shadow-md rounded mb-2"
          >
            <span>{student.name} (ID: {student.id.toString()})</span>
            <button
              onClick={() => removeStudent(student.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
