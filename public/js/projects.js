const projectsGrid =
  document.getElementById("projects-container") ||
  document.getElementById("projectsGrid");
const projectDetails =
  document.getElementById("project-details") ||
  document.getElementById("projectDetails");

function renderChips(items) {
  return items.map((item) => `<span class="tag">${item}</span>`).join("");
}

function renderProjectCards(projects) {
  if (!projects.length) {
    projectsGrid.innerHTML = "<p>No active projects found.</p>";
    return;
  }

  projectsGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <h3>${project.title}</h3>
          <p>${project.tagline}</p>
          <div class="tags">${renderChips(project.stack || [])}</div>
          <button class="details-button" data-id="${project.id}">Details</button>
        </article>
      `
    )
    .join("");
}

function renderProjectDetails(project) {
  projectDetails.innerHTML = `
    <h2>${project.title}</h2>
    <p><strong>${project.tagline}</strong></p>
    <p>${project.description}</p>
    <div class="tags">${renderChips(project.tags || [])}</div>
    <div class="project-images">
      ${(project.images || [])
        .map((image) => `<img src="${image.path}" alt="${image.alt}" />`)
        .join("")}
    </div>
  `;
}

async function loadProjects() {
  try {
    const response = await fetch("/api/projects");

    if (!response.ok) {
      throw new Error("Failed to load projects list.");
    }

    const projects = await response.json();
    renderProjectCards(projects);
  } catch (error) {
    projectsGrid.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

async function loadProjectDetails(id) {
  try {
    const response = await fetch(`/api/projects/${id}`);

    if (!response.ok) {
      throw new Error("Unable to load project details.");
    }

    const project = await response.json();
    renderProjectDetails(project);
  } catch (error) {
    projectDetails.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

projectsGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".details-button");
  if (!button) {
    return;
  }

  const { id } = button.dataset;
  loadProjectDetails(id);
});

loadProjects();
