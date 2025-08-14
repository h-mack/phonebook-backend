import data from "../models/data";

const persons = data.persons;
const currentDate = new Date();

export const info = `
<div>
  <p>Phonebook has info for ${persons.length} people</p>
  </br>
  <p>${currentDate.toString()}</p>
</div>
`;
