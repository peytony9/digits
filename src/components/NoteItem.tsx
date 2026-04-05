'use client'

import { Note } from '@prisma/client';  
import { ListGroup } from 'react-bootstrap';

// Renders a single note item in the list of notes for a contact.
const NoteItem = ({ note }: { note: Note }) => (
    <ListGroup.Item>
    <p className="fw-lighter">{note.createdAt.toLocaleDateString('en-US')}</p>
    <p>{note.note}</p>
  </ListGroup.Item>
);

export default NoteItem;