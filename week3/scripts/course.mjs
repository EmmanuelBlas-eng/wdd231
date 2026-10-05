const byuiCourse = {
  code: "WDD231",
  name: "Web Frontend Development I",
  sections: [
    { sectionNum: 1, roomNum: "STC 353", enrolled: 88, days: "TTh", instructor: "Brother Bingham" },
    { sectionNum: 2, roomNum: "STC 347", enrolled: 81, days: "TTh", instructor: "Sister Shultz" },
    { sectionNum: 3, roomNum: "STC 358", enrolled: 95, days: "MWF", instructor: "Sister Smith" }
  ],
  changeEnrollment: function (sectionNum, add = true) {
    const sectionIndex = this.sections.findIndex(
      (section) => section.sectionNum === sectionNum
    );
    if (sectionIndex >= 0) {
      if (add) {
        this.sections[sectionIndex].enrolled++;
      } else {
        this.sections[sectionIndex].enrolled--;
      }
      // Note: renderSections call was removed as per instructions
    }
  }
};

export default byuiCourse;