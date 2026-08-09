// Add / edit projects here.
// imagePosition controls the crop inside the fixed 3:2 frame.
const projects = [
  {
    type: "image",
    media: "assets/ecologies.jpg",
    alt: "The Ecologies Project installation at MPRG",
    year: "2025",
    title: "The Ecologies Project",
    orientation: "landscape",
    studio: "Studio: Hours After",
    imagePosition: "50% 57%"
  },
  {
    type: "image",
    media: "assets/b2bar.jpg",
    alt: "Back to Back Theatre annual report spread",
    year: "2025",
    title: "Back to Back Theatre Annual Report",
    orientation: "landscape",
    studio: "Studio: Hours After",
    imagePosition: "50% 50%"
  }

  // VIDEO EXAMPLE:
  // {
  //   type: "video",
  //   media: "assets/project-video.mp4",
  //   poster: "assets/project-video-poster.jpg",
  //   alt: "Short description of the video",
  //   year: "2026",
  //   title: "Project Name",
  //   orientation: "landscape",
  //   studio: "Studio: Hours After"
  // }
];

const media = document.querySelector("#project-media");
const imageFrame = document.querySelector(".image-frame");
const imagePrevZone = document.querySelector(".image-hit-zone--prev");
const imageNextZone = document.querySelector(".image-hit-zone--next");
const year = document.querySelector("#project-year");
const title = document.querySelector("#project-title");
const studio = document.querySelector("#project-studio");
const previousButton = document.querySelector("#prev-project");
const nextButton = document.querySelector("#next-project");
const slider = document.querySelector(".slider");

let currentProject = 0;
let autoAdvanceTimer = null;

function createMediaElement(project) {
  if (project.type === "video") {
    const video = document.createElement("video");
    video.src = project.media;
    video.autoplay = true;
    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = "auto";
    if (project.poster) video.poster = project.poster;
    video.setAttribute("aria-label", project.alt || project.title || "Project video");
    return video;
  }

  const img = document.createElement("img");
  img.src = project.media;
  img.alt = project.alt || project.title || "Project image";
  img.decoding = "async";
  img.style.setProperty("--image-position", project.imagePosition || "50% 50%");
  return img;
}

function setMediaContent(project) {
  media.innerHTML = "";
  media.appendChild(createMediaElement(project));
  media.style.setProperty("--image-position", project.imagePosition || "50% 50%");
}

function updateMeta(project) {
  year.textContent = project.year;
  title.textContent = project.title;
  studio.textContent = project.studio;
}

function updateFrameOrientation(project) {
  imageFrame.classList.toggle("image-frame--portrait", project.orientation === "portrait");
}

function preloadProjects() {
  projects.forEach((project) => {
    if (project.type === "video") {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = project.media;
      video.load();

      if (project.poster) {
        const poster = new Image();
        poster.src = project.poster;
      }
    } else {
      const img = new Image();
      img.src = project.media;
      if (img.decode) img.decode().catch(() => {});
    }
  });
}

function resetAutoAdvance() {
  clearTimeout(autoAdvanceTimer);
  const project = projects[currentProject];

  if (project.type === "video") {
    const video = media.querySelector("video");
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
      video.onended = () => goToProject(currentProject + 1);
      return;
    }
  }

  autoAdvanceTimer = setTimeout(() => {
    goToProject(currentProject + 1);
  }, 5000);
}

function goToProject(targetIndex) {
  if (projects.length < 2) return;

  currentProject = (targetIndex + projects.length) % projects.length;
  const project = projects[currentProject];

  updateFrameOrientation(project);
  setMediaContent(project);
  updateMeta(project);
  resetAutoAdvance();
}

function nextProject() {
  goToProject(currentProject + 1);
}

function previousProject() {
  goToProject(currentProject - 1);
}

nextButton.addEventListener("click", nextProject);
previousButton.addEventListener("click", previousProject);

imagePrevZone.addEventListener("click", previousProject);
imageNextZone.addEventListener("click", nextProject);

document.querySelectorAll(".image-hit-zone").forEach((zone) => {
  const cursorArrow = zone.querySelector(".image-cursor-arrow");
  zone.addEventListener("pointermove", (event) => {
    if (!cursorArrow || event.pointerType === "touch") return;
    const rect = zone.getBoundingClientRect();
    cursorArrow.style.left = `${event.clientX - rect.left}px`;
    cursorArrow.style.top = `${event.clientY - rect.top}px`;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") nextProject();
  if (event.key === "ArrowLeft") previousProject();
});

let touchStartX = null;

slider.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

slider.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const distance = event.changedTouches[0].clientX - touchStartX;

  if (Math.abs(distance) > 50) {
    distance < 0 ? nextProject() : previousProject();
  }

  touchStartX = null;
}, { passive: true });

// Random link hover colours.
const hoverPalette = [
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#34c759",
  "#00c7be",
  "#007aff",
  "#5856d6",
  "#af52de",
  "#ff2d55"
];

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    const previousColour = link.dataset.lastHoverColour;

    const availableColours = hoverPalette.filter(
      (colour) => colour !== previousColour
    );

    const colour =
      availableColours[
        Math.floor(Math.random() * availableColours.length)
      ];

    link.style.color = colour;
    link.dataset.lastHoverColour = colour;
  });

  link.addEventListener("mouseleave", () => {
    link.style.color = "";
  });
});

// Preload all project media in the background.
preloadProjects();

// Initial state.
setMediaContent(projects[0]);
updateMeta(projects[0]);
updateFrameOrientation(projects[0]);
resetAutoAdvance();
