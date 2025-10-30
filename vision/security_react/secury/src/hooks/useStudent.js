import { useState } from "react";
import {
  getStudentsApi,
  addStudentApi,
  updateStudentApi,
  deleteStudentApi,
  getStudentByIdApi,
} from "../api/student";
import { useAuth } from ".";

export function useStudent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [students, setStudents] = useState(null);
  const { auth } = useAuth();

  const getStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudentsApi();
      setLoading(false);
      setStudents(response);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const addStudent = async (data) => {
    try {
      setLoading(true);
      await addStudentApi(data, auth.token);
      setLoading(false);
    } catch (error) {
      setError("El estudiante ya esta");
      setLoading(false);
    }
  };

  const updateStudent = async (id, data) => {
    try {
      setLoading(true);
      await updateStudentApi(id, data, auth.token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      await deleteStudentApi(id, auth.token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const getStudentById = async (id) => {
    try {
      const student = await getStudentByIdApi(id);
      return student;
    } catch (error) {
      setError(error);
    }
  };

  return {
    loading,
    error,
    students,
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
  };
}
