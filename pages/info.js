import data from "../data.js";
let persons = data.persons;

let currentDate = new Date();

export const info = `
<div>
  <p>Phonebook has info for ${persons.length} people</p>
  </br>
  <p>${currentDate.toString()}</p>
</div>
`;
