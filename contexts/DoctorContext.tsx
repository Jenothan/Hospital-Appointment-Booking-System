'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';


export type TimeSlot = {
  time: string;
};

export type AvailableSchedule = {
  [weekday: string]: TimeSlot[];
};

export type Doctor = {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  availableSchedule: AvailableSchedule; // replace availableSlots
};

type DoctorContextType = {
  doctorss: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (updatedDoctor: Doctor) => void;
  deleteDoctor: (id: string) => void;
};

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider = ({ children }: { children: React.ReactNode }) => {
  const [doctorss, setDoctorss] = useState<Doctor[]>([]);

  // ✅ Load from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem('doctors');
    if (stored) {
      try {
        setDoctorss(JSON.parse(stored));
      } catch (err) {
        console.error('Error parsing doctors from localStorage:', err);
      }
    }
  }, []);

  // ✅ Save to localStorage whenever doctors list changes
  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctorss));
  }, [doctorss]);

  const addDoctor = (doctor: Doctor) => {
    setDoctorss((prev) => [...prev, doctor]);
  };

  const updateDoctor = (updatedDoctor: Doctor) => {
    setDoctorss((prev) =>
      prev.map((doc) => (doc.id === updatedDoctor.id ? updatedDoctor : doc))
    );
  };

  const deleteDoctor = (id: string) => {
    setDoctorss((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <DoctorContext.Provider value={{ doctorss, addDoctor, updateDoctor, deleteDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctorContext = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error('useDoctorContext must be used within DoctorProvider');
  return context;
};
