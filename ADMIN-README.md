# Admin mode: personal website

Owner-only admin panel for pankajsabhlock.github.io.

## How to open it
- Click the small gear icon at the top of the page (Site admin).
- Or press Ctrl+Shift+A (Cmd+Shift+A on a Mac).
- Or click your name in the header five times quickly.
- Or add #admin to the end of the web address.

The first time, you set a password. It is stored only as a hash in that browser. Click Lock to require it again.

## What the panel offers
- Hero: Flow animation (version 5) or the older Orbit visual.
- Animation: modes 1 to 11, each with a name.
- Chart style: options 6 to 11.
- Sliders: speed, density, size and similar.
- Keywords: show or hide.
- Download settings: saves the current choices as hero-config.json.

## Limits
- Changes show only in the browser where you made them.
- The password hides the panel from casual visitors. It is not security.
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
- index.html: the page and the admin icon.