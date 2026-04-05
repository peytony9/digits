'use client'

import { Contact, Note } from '@prisma/client';
import { Card, Image, ListGroup } from 'react-bootstrap';
import NextLink from 'next/link';
import NoteItem from './NoteItem';
import AddNoteForm from './AddNoteForm';

const ContactCard = ({ contact, notes }: { contact: Contact, notes: Note[] }) => (
  <Card className="h-100">
    <Card.Header>
      {contact.image && <Image src={contact.image} alt="contacts" width={75} />}
      <Card.Title>
        {contact.firstName} {contact.lastName}
      </Card.Title>
      <Card.Subtitle>{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
      <ListGroup variant="flush">
    {notes.map((note) => <NoteItem key={note.id} note={note}/>)}
      </ListGroup>
      <AddNoteForm contact={contact} />
    </Card.Body>
    <Card.Footer>
      <NextLink href={`/edit/${contact.id}`} className="text-primary">
        Edit
      </NextLink>
    </Card.Footer>
  </Card>
);

export default ContactCard;