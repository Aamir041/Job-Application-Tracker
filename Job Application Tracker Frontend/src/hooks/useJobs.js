import { useState } from "react";
import { initialJobs } from "../data/initialJobs";

export function useJobs() {
  const [jobs, setJobs] = useState(initialJobs);
  const [nextId, setNextId] = useState(100);

  const addJob = (data) => {
    setJobs((prev) => [{ ...data, id: nextId }, ...prev]);
    setNextId((n) => n + 1);
  };

  const updateJob = (id, data) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...data, id } : j)));
  };

  const updateStatus = (id, status) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return { jobs, addJob, updateJob, updateStatus, deleteJob };
}
