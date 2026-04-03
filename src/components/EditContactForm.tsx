'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Contact } from '@prisma/client';
import { EditContactSchema } from '@/lib/validationSchemas';
import { editContact } from '@/lib/dbActions';

type EditContactFormData = Omit<Contact, 'image'> & {
  image: string;
};

const onSubmit = async (data: EditContactFormData) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  await editContact(data);
  swal('Success', 'Your contact has been updated', 'success', {
    timer: 2000,
  });
};

const EditContactForm = ({ contact }: { contact: Contact }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditContactFormData>({
    resolver: yupResolver(EditContactSchema),
  });
  // console.log(contact);

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center">
            <h2>Edit Contact</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} value={contact.id} />
                <Row>
                  <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <input
                    type="text"
                    defaultValue={contact.firstName}
                    {...register('firstName')}
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{String(errors.firstName?.message || '')}</div>
                </Form.Group>
                </Col>
                <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <input
                    type="text"
                    defaultValue={contact.lastName}
                    {...register('lastName')}
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{String(errors.lastName?.message || '')}</div>
                </Form.Group>
                </Col>
                </Row>
                <Row>
                  <Col>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <input
                    type="text"
                    defaultValue={contact.address}
                    {...register('address')}
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{String(errors.address?.message || '')}</div>
                </Form.Group>
                </Col>
                <Col>
                <Form.Group>
                  <Form.Label>Image</Form.Label>
                  <input
                    type="text"
                    defaultValue={contact.image ?? ''}
                    {...register('image')}
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{String(errors.image?.message || '')}</div>
                </Form.Group>
                </Col>
                </Row>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <textarea
                    defaultValue={contact.description}
                    {...register('description')}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{String(errors.description?.message || '')}</div>
                </Form.Group>
                <input type="hidden" {...register('owner')} value={contact.owner} />
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditContactForm;