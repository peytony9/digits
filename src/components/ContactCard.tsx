'use client'

import { Card, Image } from 'react-bootstrap';
import NextLink from 'next/link';

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  description: string;
  image: string;
};

const ContactCard = ({ contact }: { contact: Contact }) => (
  <Card className="h-100">
    <Card.Header>
      <Image src={contact.image} alt="contacts" width={75} />
      <Card.Title>
        {contact.firstName} {contact.lastName}
      </Card.Title>
      <Card.Subtitle>{contact.address}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>{contact.description}</Card.Text>
    </Card.Body>
    <Card.Footer>
      <NextLink href={`/edit/${contact.id}`} className="text-primary">
        Edit
      </NextLink>
    </Card.Footer>
  </Card>
);

export default ContactCard;