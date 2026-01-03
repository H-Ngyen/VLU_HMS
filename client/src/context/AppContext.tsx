import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { INITIAL_RECORDS, INITIAL_PATIENTS, USERS } from "../mockData";
import type { Patient, Record, User, Document } from "../types";

interface AppContextType {
  user: User | null;
  records: Record[];
  patients: Patient[];
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addRecord: (newRecord: Record) => void;
  updateRecord: (updatedRecord: Record) => void;
  deleteRecord: (id: string) => void;
  addDocumentToRecord: (recordId: string, document: Document) => void;
  removeDocumentFromRecord: (recordId: string, docId: string) => void;
  updateDocumentInRecord: (recordId: string, docId: string, newName: string) => void;
  addPatient: (newPatient: Patient) => void;
  updatePatient: (updatedPatient: Patient) => void;
  addUser: (newUser: User) => void;
  updateUser: (username: string, updates: Partial<User>) => void;
  deleteUser: (username: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Default to Admin user for development/demo purposes
  // casting initial user to User type or null. 
  // Ideally, USERS from mockData should be typed as User[]
  const [user, setUser] = useState<User | null>({
    username: "admin",
    password: "123", // Adding password to satisfy User type
    role: "admin",
    name: "2274801030064-Cao Phan Khải - 71K28KTPM01",
    status: "active" // Adding status to satisfy User type
  });
  
  // Cast initial data to their respective types
  const [records, setRecords] = useState<Record[]>(INITIAL_RECORDS as unknown as Record[]);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS as unknown as Patient[]);
  const [users, setUsers] = useState<User[]>(USERS as unknown as User[]);

  const login = (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // --- Records ---
  const addRecord = (newRecord: Record) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const updateRecord = (updatedRecord: Record) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addDocumentToRecord = (recordId: string, document: Document) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id === recordId) {
          return {
            ...record,
            documents: [...(record.documents || []), document],
          };
        }
        return record;
      })
    );
  };

  const removeDocumentFromRecord = (recordId: string, docId: string) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id === recordId) {
          return {
            ...record,
            documents: record.documents.filter((d) => d.id !== docId),
          };
        }
        return record;
      })
    );
  };

  const updateDocumentInRecord = (recordId: string, docId: string, newName: string) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id === recordId) {
          return {
            ...record,
            documents: record.documents.map((d) =>
              d.id === docId ? { ...d, name: newName } : d
            ),
          };
        }
        return record;
      })
    );
  };

  const addPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  // --- Users ---
  const addUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (username: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.username === username ? { ...u, ...updates } : u))
    );
  };

  const deleteUser = (username: string) => {
    setUsers((prev) => prev.filter((u) => u.username !== username));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        records,
        patients,
        users,
        login,
        logout,
        addRecord,
        updateRecord,
        deleteRecord,
        addDocumentToRecord,
        removeDocumentFromRecord,
        updateDocumentInRecord,
        addPatient,
        updatePatient,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};