document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("members-container");
    const gridBtn = document.getElementById("grid-view");
    const listBtn = document.getElementById("list-view");
    const menuBtn = document.getElementById("hamburger-menu");
    const nav = document.getElementById("primary-nav");

    
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("open");
        menuBtn.classList.toggle("open");
        const isOpen = nav.classList.contains("open");
        menuBtn.setAttribute("aria-expanded", isOpen);
        menuBtn.innerHTML = isOpen ? "&#10005;" : "&#9776;";
    });

   
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;

    
    async function getMembers() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) {
                throw new Error("Failed to load JSON data.");
            }
            const data = await response.json();
            displayMembers(data);
        } catch (error) {
            console.error("Error loading directory data:", error);
            container.innerHTML = "<p>Failed to load member directory. Please try again later.</p>";
        }
    }

    
    function displayMembers(members) {
        container.innerHTML = ""; 

        members.forEach((member) => {
            const card = document.createElement("section");
            card.classList.add("member-card");

           
    const domain = member.website.replace("https://", "").replace("http://", "").replace("www.", "").split('/')[0];
    
    
    const email = `info@${domain}`;

    card.innerHTML = `
  <div class="card-header">
    <h2>${member.name}</h2>
    <p class="tagline">${member.tagline}</p>
  </div>
  <div class="card-body">
    <div class="image-box">
      <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
    </div>
    <div class="card-info">
      <p><strong>EMAIL:</strong> ${email}</p>
      <p><strong>PHONE:</strong> ${member.phone}</p>
      <p><strong>URL:</strong> <a href="${member.website}" target="_blank" rel="noopener">${domain}</a></p>
    </div>
  </div>
`;

    container.appendChild(card);
  });
}

   
    gridBtn.addEventListener("click", () => {
        container.classList.add("grid-view");
        container.classList.remove("list-view");
        gridBtn.classList.add("active-view");
        listBtn.classList.remove("active-view");
    });

    listBtn.addEventListener("click", () => {
        container.classList.add("list-view");
        container.classList.remove("grid-view");
        listBtn.classList.add("active-view");
        gridBtn.classList.remove("active-view");
    });

   
    getMembers();
});