export function setSectionSelection(sections) {
  const selectElement = document.querySelector("#sectionNumber");
  // Clean out existing dynamic options while keeping default `--`
  selectElement.innerHTML = `<option value="">--</option>`;
  
  sections.forEach((section) => {
    const option = document.createElement("option");
    option.value = section.sectionNum;
    option.textContent = section.sectionNum;
    selectElement.appendChild(option);
  });
}