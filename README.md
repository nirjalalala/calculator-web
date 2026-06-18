# [Calculator Web App](https://nirjalalala.github.io/calculator-web/)

I built this project as part of my learning journey on [The Odin Project](https://www.theodinproject.com/) — revisiting the concepts and foundations of web development. What made this one special is that it became my first published PWA, and I am so happy that it works. I love exploring new ideas and trying out new concepts, and this was a great learning opportunity on many levels. I also use AI to help me go deeper into the never-ending depths of IT — and I am learning how to use AI to write code that I actually understand, not just code that runs.

---

## Features

| Feature | Details |
|---------|---------|
| Basic arithmetic | `+` `-` `×` `÷` |
| BODMAS | Correct operator precedence — `3 + 5 × 2 = 13` |
| Keyboard support | `0–9` `.` `+ - * /` `Enter` `Escape` `Backspace` |
| Dark / light theme | Toggle button, preference saved to `localStorage` |
| Responsive | Works on any screen size |
| PWA | Installable on Android, iOS, and desktop — works offline |

---

## Installing the app

The calculator is a Progressive Web App. It can be installed to your device's home screen and works without an internet connection.

**Android (Chrome)**
1. [Open the app in Chrome](https://nirjalalala.github.io/calculator-web/)
2. Tap the three-dot menu → **Install app**

**iOS (Safari)**
1. [Open the app in Safari](https://nirjalalala.github.io/calculator-web/)
2. Tap the Share button → **Add to Home Screen**

**Desktop (Chrome / Edge)**
1. [Open the app](https://nirjalalala.github.io/calculator-web/)
2. Click the install icon in the address bar

**Updating after a new release**
Bump `CACHE_NAME` in `service-worker.js` following semver (e.g. `1.0.2` → `1.1.0`). The new service worker installs on the user's next visit and replaces the old cache automatically.

---

## Running locally

You need nothing more than a terminal and a browser.

**1. Clone the repository**
```bash
git clone https://github.com/nirjalalala/calculator-web.git
cd calculator-web
```

**2. Serve the files**

Open `index.html` directly in your browser — double-click it in your file manager, or run a one-line local server from the project folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> Why a server instead of just opening the file? For this project, a file server is not strictly required — plain HTML/CSS/JS with no fetch calls works when opened directly. The server habit is good practice for when your project grows to make API calls, which won't work from a `file://` URL due to browser security restrictions.
