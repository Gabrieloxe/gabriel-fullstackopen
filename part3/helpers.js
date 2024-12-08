export const generateId = (persons) => {
  let id = Math.floor(Math.random() * 1000000);
  const numbers = persons.map(p => p.id);
  while (numbers.includes(id)) {
    id = Math.floor(Math.random() * 1000000);
  }
  return id;
};

export const validatePerson = person => {
  if (
    !person.name ||
    !person.number ||
    person.name === '' ||
    person.number === ''
  ) {
    return false;
  }
  return true;
};


