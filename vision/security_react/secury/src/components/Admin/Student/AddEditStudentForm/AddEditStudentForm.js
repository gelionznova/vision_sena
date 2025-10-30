import React, { useState, useCallback } from "react";
import { Form, Image, Button } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useStudent } from "../../../../hooks";
import "./AddEditStudentForm.scss";

export function AddEditStudentForm(props) {
  const { onClose, onRefetch, student } = props;
  const [previewImage, setPreviewImage] = useState(student?.image || null);
  const { addStudent, updateStudent } = useStudent();

  const formik = useFormik({
    initialValues: initialValues(student),
    validationSchema: Yup.object(student ? updateSchema() : newSchema()),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      if (student) await updateStudent(student.id, formValue);
      else await addStudent(formValue);

      onRefetch();
      onClose();
    },
  });

  const onDrop = useCallback(async (acceptedFile) => {
    const file = acceptedFile[0];
    await formik.setFieldValue("image", file);
    setPreviewImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  return (
    <Form className="add-edit-student-form" onSubmit={formik.handleSubmit}>
      <Form.Input
        label="ID"
        name="student_id"
        value={formik.values.student_id}
        onChange={formik.handleChange}
        error={formik.errors.student_id}
      />

      <Form.Input
        label="Nombre y apellidos"
        name="full_name"
        placeholder="Nombre completo"
        value={formik.values.full_name}
        onChange={formik.handleChange}
        error={formik.errors.full_name}
      />

      <Form.Input
        label="Programa de formacion"
        name="training_program"
        placeholder="Programa de Formacion"
        value={formik.values.training_program}
        onChange={formik.handleChange}
        error={formik.errors.training_program}
      />

      <Button
        type="button"
        fluid
        {...getRootProps()}
        color={formik.errors.image && "red"}
      >
        {previewImage ? "Cambiar imagen" : "Subir imagen"}
      </Button>
      <input {...getInputProps()} />
      <Image src={previewImage} />

      <Button
        type="submit"
        primary
        fluid
        content={student ? "Actualizar" : "Crear"}
      />
    </Form>
  );
}

function initialValues(data) {
  return {
    student_id: data?.student_id || "",
    full_name: data?.full_name || "",
    training_program: data?.training_program || "",
    image: "",
  };
}

function newSchema() {
  return {
    student_id: Yup.string().required(true),
    full_name: Yup.string().required(true),
    training_program: Yup.string().required(true),
    image: Yup.string().required(true),
  };
}

function updateSchema() {
  return {
    student_id: Yup.string().required(true),
    full_name: Yup.string().required(true),
    training_program: Yup.string().required(true),
    image: Yup.string(),
  };
}
