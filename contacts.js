import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import colors from "colors";

const contactsPath = path.join("./db", "contacts.json");

// TODO: udokumentuj każdą funkcję
async function listContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });

  if (!contacts) {
    throw new Error("\nThere are no contacts".bgRed);
  }
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (!contact) {
    throw new Error(`\nThere is no contact with id ${contactId}`.bgRed);
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );

  if (filteredContacts.length === contacts.length) {
    throw new Error(`Contact with ID ${contactId} not found.`.bgRed);
  }
  fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const contactWithSameName = contacts.find((contact) => contact.name === name);

  if (contactWithSameName) {
    throw new Error(
      `Contact with name ${name} already exists in contacts.`.bgRed
    );
  }

  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

export { listContacts, getContactById, addContact, removeContact };
