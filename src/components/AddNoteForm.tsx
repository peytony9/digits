'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { addNote } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddNoteSchema } from '@/lib/validationSchemas';
import { Contact } from '@prisma/client';

type AddNoteFormValues = {
  note: string;
  owner: string;
  contactId: number;
};

const AddNoteForm = ({ contact }: { contact: Contact }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const currentUser = session?.user?.email || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddNoteFormValues>({
    resolver: yupResolver(AddNoteSchema),
    defaultValues: {
      note: '',
      owner: currentUser,
      contactId: contact.id,
    },
  });

  // 🔄 Handle loading state
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // 🚫 Redirect properly (client-side)
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // ✅ Submit handler (moved inside component so it has access to reset)
  const onSubmit: SubmitHandler<AddNoteFormValues> = async (data) => {
    try {
      await addNote({
        ...data,
        contactId: Number(data.contactId), // ensure number
      });

      swal('Success', 'Your note has been added', 'success', {
        timer: 2000,
      });

      reset(); // clear form
      router.refresh(); // 🔥 refresh server data (important in Next.js)

    } catch (error) {
      swal('Error', 'Failed to add note', 'error'); 
      console.error(error);
    }
  };

  return (
    <Container className="py-3">
      <Card>
        <Card.Header>Add Timestamped Note</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>

            <Form.Group>
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                {...register('note')}
                isInvalid={!!errors.note}
              />
              <Form.Control.Feedback type="invalid">
                {errors.note?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Hidden fields */}
            <input
              type="hidden"
              {...register('owner')}
            />

            <input
              type="hidden"
              {...register('contactId', { valueAsNumber: true })}
            />

            <Row className="pt-3">
              <Col>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Col>
              <Col>
                <Button
                  type="button"
                  onClick={() => reset()}
                  variant="warning"
                  className="float-end"
                >
                  Reset
                </Button>
              </Col>
            </Row>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddNoteForm;