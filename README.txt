Celeste portfolio — cleaned V10

This is a plain HTML / CSS / JavaScript site designed for GitHub Pages.

FILES

index.html
Page structure.

styles.css
Desktop, tablet and mobile layout.

script.js
Project data and slider behaviour.

assets/
Project images.

CNAME
Custom domain for GitHub Pages.


WHAT WAS CLEANED UP IN V10

- Removed the unused finishInstantly() JavaScript function.
- Removed old slide-state CSS classes that were no longer used.
- Consolidated duplicated SVG arrow styling.
- Restricted the tablet breakpoint to 601–900px so it no longer competes
  with the mobile breakpoint.
- Kept the existing desktop and mobile appearance and interaction behaviour.
- Kept the 5-second auto-advance.
- Kept swipe, keyboard and image-half navigation.
- Kept the reversed custom cursor arrows.
- Kept random link hover colours.


ADDING A PROJECT

1. Add the image to the assets folder.
2. Open script.js.
3. Duplicate one object in the projects array.
4. Change:
   image
   alt
   year
   title
   studio
   imagePosition

Example:

{
  image: "assets/project-name.jpg",
  alt: "Description of the project image",
  year: "2026",
  title: "Project Name",
  studio: "Studio: Hours After",
  imagePosition: "50% 50%"
}


BEFORE LAUNCH

The current HTML still contains placeholder contact links:

Email:
mailto:hello@example.com

Instagram:
https://www.instagram.com/

Replace these with the correct links in index.html.


GITHUB PAGES

Repository:
poplarboat66.github.io

Publish from:
main branch
/(root)

Custom domain:
celestenjoo.com


V11 DESIGN CHANGES

- Mobile outer page padding reduced from 28px to 16px so the layout sits
  closer to the screen edges.
- Mobile project metadata doubled from 8–10px to 16–20px.
- Desktop and tablet layouts are unchanged.


V12 — LANDSCAPE + PORTRAIT IMAGES

The slider now supports two image ratios:

Landscape: 3:2 — recommended export 2400 x 1600 px
Portrait: 2:3 — recommended export 1600 x 2400 px

For each project in script.js add:
orientation: "landscape",
or:
orientation: "portrait",

Because your source images will already be the exact ratio, use imagePosition:
"50% 50%".


V13 — VIDEO SUPPORT

The slider now supports both images and videos.

IMAGE PROJECT

{
  type: "image",
  media: "assets/project.jpg",
  alt: "Description of the image",
  year: "2026",
  title: "Project Name",
  orientation: "landscape",
  studio: "Studio: Hours After",
  imagePosition: "50% 50%"
}

VIDEO PROJECT

{
  type: "video",
  media: "assets/project-video.mp4",
  poster: "assets/project-video-poster.jpg",
  alt: "Description of the video",
  year: "2026",
  title: "Project Name",
  orientation: "landscape",
  studio: "Studio: Hours After"
}

VIDEO BEHAVIOUR

- Videos autoplay.
- Videos are muted.
- Videos play inline on mobile.
- Controls are hidden.
- A video plays once, then the slider automatically advances to the next project.
- Manual next/previous navigation still works.
- Swipe navigation still works.
- Left/right image-area navigation still works.
- poster is optional but recommended so there is an immediate still image while the
  video loads.

RECOMMENDED VIDEO EXPORTS

Landscape 3:2
1920 x 1280 px

Portrait 2:3
1280 x 1920 px

Use MP4 / H.264 for broad browser compatibility.
Try to keep individual files around 2–8 MB where practical.
