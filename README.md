[README.txt](https://github.com/user-attachments/files/30866398/README.txt)
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
