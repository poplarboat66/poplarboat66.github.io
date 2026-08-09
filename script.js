// Add / edit projects here.
// imagePosition controls the crop inside the fixed 3:2 frame.
const projects = [
  {
    image: "assets/ecologies.jpg",
    alt: "The Ecologies Project installation at MPRG",
    year: "2025",
    title: "The Ecologies Project",
    orientation: "landscape",
    studio: "Studio: Hours After",
    imagePosition: "50% 57%"
  },
  {
    image: "assets/b2bar.jpg",
    alt: "Back to Back Theatre annual report spread",
    year: "2025",
    title: "Back to Back Theatre Annual Report",
    orientation: "landscape",
    studio: "Studio: Hours After",
    imagePosition: "50% 50%"
  }
];

const image = document.querySelector("#project-image");
const nextImage = document.querySelector("#project-image-next");
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

function setImageContent(element, project) {
  element.src = project.image;
  element.alt = project.alt;
  element.style.setProperty(
    "--image-position",
    project.imagePosition || "50% 50%"
  );
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
  clearInterval(autoAdvanceTimer);

  autoAdvanceTimer = setInterval(() => {
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
  nextImage.style.transition = "none";
  nextImage.style.transform =
    direction === "prev" ? "translateX(-100%)" : "translateX(100%)";

  setImageContent(nextImage, incomingProject);

  // Force the browser to register the starting position.
  nextImage.getBoundingClientRect();

  nextImage.style.transition = "";
  image.style.transition = "";

  requestAnimationFrame(() => {
    image.style.transform =
      direction === "prev" ? "translateX(100%)" : "translateX(-100%)";
    nextImage.style.transform = "translateX(0)";
  });

  function completeTransition() {
    currentProject = newIndex;
    setImageContent(image, incomingProject);
    updateMeta(incomingProject);
    updateFrameOrientation(incomingProject);

    // Reset both image layers without animating the reset.
    image.style.transition = "none";
    image.style.transform = "translateX(0)";
    nextImage.style.transition = "none";
    nextImage.style.transform =
      direction === "prev" ? "translateX(-100%)" : "translateX(100%)";

    image.getBoundingClientRect();

    image.style.transition = "";
    nextImage.style.transition = "";
    isAnimating = false;
  }

  nextImage.addEventListener("transitionend", completeTransition, {
    once: true
  });

  if (resetTimer) resetAutoAdvance();
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
setImageContent(image, projects[0]);
updateMeta(projects[0]);
updateFrameOrientation(projects[0]);
resetAutoAdvance();
