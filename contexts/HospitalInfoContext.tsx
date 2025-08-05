// contexts/HospitalInfoContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface HospitalInfo {
  email: string;
  phone: string;
  address: string;
}

interface HospitalInfoContextType {
  hospitalInfo: HospitalInfo;
  updateHospitalInfo: (data: HospitalInfo) => void;
}

const HospitalInfoContext = createContext<HospitalInfoContextType | undefined>(undefined);

export const HospitalInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo>({
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('hospitalInfo');
    if (stored) {
      setHospitalInfo(JSON.parse(stored));
    }
  }, []);

  const updateHospitalInfo = (data: HospitalInfo) => {
    setHospitalInfo(data);
    localStorage.setItem('hospitalInfo', JSON.stringify(data));
  };

  return (
    <HospitalInfoContext.Provider value={{ hospitalInfo, updateHospitalInfo }}>
      {children}
    </HospitalInfoContext.Provider>
  );
};

export const useHospitalInfo = () => {
  const context = useContext(HospitalInfoContext);
  if (!context) {
    throw new Error('useHospitalInfo must be used within HospitalInfoProvider');
  }
  return context;
};
