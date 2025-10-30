import React from "react";
import { Table, Image, Button, Icon } from "semantic-ui-react";
import { map } from "lodash";
import "./TableStudentAdmin.scss";

export function TableStudentAdmin(props) {
  const { students, updateStudent, deleteStudent } = props;

  return (
    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
      <Table className="table-student-admin">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Nombre completo</Table.HeaderCell>
            <Table.HeaderCell>Programa/Formacion</Table.HeaderCell>
            <Table.HeaderCell>Foto</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {map(students, (student, index) => (
            <Table.Row key={index}>
              <Table.Cell>{student.student_id}</Table.Cell>
              <Table.Cell>{student.full_name}</Table.Cell>
              <Table.Cell>{student.training_program}</Table.Cell>
              <Table.Cell width={2}>
                <Image src={student.image} />
              </Table.Cell>

              <Actions
                student={student}
                updateStudent={updateStudent}
                deleteStudent={deleteStudent}
              />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function Actions(props) {
  const { student, updateStudent, deleteStudent } = props;

  return (
    <Table.Cell textAlign="right">
      <Button icon onClick={() => updateStudent(student)}>
        <Icon name="pencil" />
      </Button>
      <Button icon negative onClick={() => deleteStudent(student)}>
        <Icon name="close" />
      </Button>
    </Table.Cell>
  );
}
