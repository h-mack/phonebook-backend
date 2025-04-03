import { data } from "../data.js";

let currentDate = new Date();

export const info = `
<div>
  <p>Phonebook has info for ${data.length} people</p>
  </br>
  <p>${currentDate.toString()}</p>
</div>
`;
