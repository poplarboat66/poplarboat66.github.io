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
const nextMedia = document.querySelector("#project-media-next");
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
let isAnimating = false;

function createMediaElement(project) {
  if (project.type === "video") {
    const video = document.createElement("video");
    video.src = project.media;
    video.autoplay = true;
    video.muted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = "metadata";

    if (project.poster) {
      video.poster = project.poster;
    }

    video.setAttribute("aria-label", project.alt || project.title || "Project video");
    return video;
  }

  const img = document.createElement("img");
  img.src = project.media;
  img.alt = project.alt || project.title || "Project image";
  img.style.setProperty("--image-position", project.imagePosition || "50% 50%");
  return img;
}

function setMediaContent(container, project) {
  container.innerHTML = "";
  const element = createMediaElement(project);
  container.appendChild(element);

  if (project.type === "image") {
    container.style.setProperty("--image-position", project.imagePosition || "50% 50%");
  } else {
    container.style.removeProperty("--image-position");
  }

  return element;
}

function updateMeta(project) {
  year.textContent = project.year;
  title.textContent = project.title;
  studio.textContent = project.studio;
}

function updateFrameOrientation(project) {
  imageFrame.classList.toggle("image-frame--portrait", project.orientation === "portrait");
}

function resetAutoAdvance() {
  clearTimeout(autoAdvanceTimer);

  const project = projects[currentProject];

  if (project.type === "video") {
    const video = media.querySelector("video");

    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});

      video.onended = () => {
        goToProject(currentProject + 1, "next", false);
      };
      return;
    }
  }

  autoAdvanceTimer = setTimeout(() => {
    goToProject(currentProject + 1, "next", false);
  }, 5000);
}

function goToProject(targetIndex, direction = "next", resetTimer = true) {
  if (isAnimating || projects.length < 2) return;

  const newIndex = (targetIndex + projects.length) % projects.length;
  if (newIndex === currentProject) return;

  isAnimating = true;
  const incomingProject = projects[newIndex];

  // Position incoming image just outside the frame.
  nextMedia.style.transition = "none";
  nextMedia.style.transform =
    direction === "prev" ? "translateX(-100%)" : "translateX(100%)";

  setMediaContent(nextMedia, incomingProject);

  // Force the browser to register the starting position.
  nextMedia.getBoundingClientRect();

  nextMedia.style.transition = "";
  media.style.transition = "";

  requestAnimationFrame(() => {
    media.style.transform =
      direction === "prev" ? "translateX(100%)" : "translateX(-100%)";
    nextMedia.style.transform = "translateX(0)";
  });

  function completeTransition() {
    currentProject = newIndex;
    setMediaContent(media, incomingProject);
    updateMeta(incomingProject);
    updateFrameOrientation(incomingProject);

    // Reset both image layers without animating the reset.
    media.style.transition = "none";
    media.style.transform = "translateX(0)";
    nextMedia.style.transition = "none";
    nextMedia.style.transform =
      direction === "prev" ? "translateX(-100%)" : "translateX(100%)";

    media.getBoundingClientRect();

    media.style.transition = "";
    nextMedia.style.transition = "";
    isAnimating = false;

    resetAutoAdvance();
  }

  nextMedia.addEventListener("transitionend", completeTransition, {
    once: true
  });

  if (resetTimer) {
    clearTimeout(autoAdvanceTimer);
  }
}

function nextProject(resetTimer = true) {
  goToProject(currentProject + 1, "next", resetTimer);
}

function previousProject(resetTimer = true) {
  goToProject(currentProject - 1, "prev", resetTimer);
}

// Visible navigation arrows.
nextButton.addEventListener("click", () => nextProject(true));
previousButton.addEventListener("click", () => previousProject(true));

// Left/right halves of the image.
imagePrevZone.addEventListener("click", () => previousProject(true));
imageNextZone.addEventListener("click", () => nextProject(true));

// Matching desktop cursor arrows.
document.querySelectorAll(".image-hit-zone").forEach((zone) => {
  const cursorArrow = zone.querySelector(".image-cursor-arrow");

  zone.addEventListener("pointermove", (event) => {
    if (!cursorArrow || event.pointerType === "touch") return;

    const rect = zone.getBoundingClientRect();
    cursorArrow.style.left = `${event.clientX - rect.left}px`;
    cursorArrow.style.top = `${event.clientY - rect.top}px`;
  });
});

// Keyboard controls.
imageFrame.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    previousProject(true);
  }

  if (
    event.key === "ArrowRight" ||
    event.key === "Enter" ||
    event.key === " "
  ) {
    event.preventDefault();
    nextProject(true);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") nextProject(true);
  if (event.key === "ArrowLeft") previousProject(true);
});

// Swipe controls.
let touchStartX = null;

slider.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true }
);

slider.addEventListener(
  "touchend",
  (event) => {
    if (touchStartX === null) return;

    const distance =
      event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(distance) > 50) {
      if (distance < 0) {
        nextProject(true);
      } else {
        previousProject(true);
      }
    }

    touchStartX = null;
  },
  { passive: true }
);

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

// Initial state.
setMediaContent(media, projects[0]);
updateMeta(projects[0]);
updateFrameOrientation(projects[0]);
resetAutoAdvance();
