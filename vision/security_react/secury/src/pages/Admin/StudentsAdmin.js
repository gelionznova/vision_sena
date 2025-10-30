import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import {
  HeaderPage,
  TableStudentAdmin,
  AddEditStudentForm,
} from "../../components/Admin";
import { ModalBasic } from "../../components/Common";
import { useStudent } from "../../hooks";

export function StudentsAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const { loading, students, getStudents, deleteStudent } = useStudent();

  useEffect(() => {
    getStudents();
  }, [refetch]);

  const openCloseModal = () => setShowModal((prev) => !prev);
  const onRefetch = () => setRefetch((prev) => !prev);

  const addStudent = () => {
    setTitleModal("Nuevo Estudiante");
    setContentModal(
      <AddEditStudentForm onClose={openCloseModal} onRefetch={onRefetch} />
    );
    openCloseModal();
  };

  const updateStudent = (data) => {
    setTitleModal("Actualizar datos");
    setContentModal(
      <AddEditStudentForm
        onClose={openCloseModal}
        onRefetch={onRefetch}
        student={data}
      />
    );
    openCloseModal();
  };

  const onDeleteStudent = async (data) => {
    const result = window.confirm(`¿Eliminar estudiante ${data.full_name}?`);
    if (result) {
      await deleteStudent(data.id);
      onRefetch();
    }
  };

  return (
    <>
      <HeaderPage
        title="Estudiantes"
        btnTitle="Nuevo Estudiante"
        btnClick={addStudent}
      />
      {loading ? (
        <Loader active inline="centered">
          Cargando...
        </Loader>
      ) : (
        <TableStudentAdmin
          students={students}
          updateStudent={updateStudent}
          onDeleteStudent={onDeleteStudent}
        />
      )}

      <ModalBasic
        show={showModal}
        onClose={openCloseModal}
        title={titleModal}
        children={contentModal}
      />
    </>
  );
}
