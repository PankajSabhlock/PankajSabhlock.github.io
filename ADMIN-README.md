# Admin mode: personal website

Owner-only admin panel for pankajsabhlock.github.io.

## Opening and closing
- The panel is hidden when the site loads.
- There is no visible admin button. Visitors never see one.
- Press Ctrl+Shift+A (Cmd+Shift+A on a Mac).
- Or click your name in the header five times quickly.
- Or add #admin to the end of the web address.
- Two quick clicks outside the panel slide it away to the right. One click outside does nothing.
- The Close button and the Lock button also hide the panel.
- A new browser or a cleared browser has no saved password, so it asks you to choose one again.

## Signing in
- There is no default password in the code. The first time you open admin in a browser, you choose a password (8 or more characters).
- Click Change password in the panel to set a new one. You need the current password first.
- Clicking outside the sign-in box does not close it. Use Cancel or Escape.
- The password is stored only as a hash in each browser.

## What the panel offers
- Hero: Flow animation (version 5) or the older Orbit visual.
- Animation: modes 1 to 11, each with a name.
- Chart style: options 6 to 11.
- Sliders: burst, dot density, speed, visibility, visual size, granule, ring opening.
- Keywords: show or hide.
- Download settings: saves the current choices as hero-config.json.

## Limits
- Changes show only in the browser where you made them.
- The password only hides the panel from casual visitors. It is not security, and anyone can set their own password in their own browser, but their changes never reach the live site.
- Visitors see whatever is in hero-config.json in the repository.

## Publish a choice for everyone
1. Open admin mode and choose your settings.
2. Click Download settings to get hero-config.json.
3. Replace hero-config.json in the repository folder with the downloaded file.
4. Commit and push to main.
5. Reload the live site and check it.

## Files involved
- admin.js: the admin panel.
- hero-config.json: the settings visitors see.
- hero-flow.js: the animation engine.
- index.html: the page.
- styles.css: the page styles, including the panel slide.