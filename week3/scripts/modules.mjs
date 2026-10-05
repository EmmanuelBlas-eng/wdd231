import byuiCourse from './course.mjs';
import { setSectionSelection } from './section.mjs';
import { setTitle, renderSections } from './output.mjs';

// Initial render
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

// Event Listeners
document.querySelector("#enrollStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  if (sectionNum) {
    byuiCourse.changeEnrollment(sectionNum, true);
    renderSections(byuiCourse.sections);
  }
});

document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  if (sectionNum) {
    byuiCourse.changeEnrollment(sectionNum, false);
    renderSections(byuiCourse.sections);
  }
});