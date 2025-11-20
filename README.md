Here's a GitHub README file for your THREE.js mobile game!

---

# 🚀 Thrust Delivery: A 3D Space Challenge

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About The Game

Thrust Delivery is an exhilarating 3D mobile game built with THREE.js, React, and Zustand. As a skilled space pilot, your mission is to navigate a delivery spaceship through challenging, wall-lined cosmic pathways. Deliver packages from point A to point B in the shortest possible time, all while avoiding collisions and aiming for a perfect three-star rating on every level!

Test your reflexes and precision in a series of increasingly complex levels, or push your limits in the endless mode where survival is the ultimate goal. Can you become the fastest and most accurate delivery pilot in the galaxy?

## Features

*   **Engaging 3D Graphics:** Immerse yourself in a beautiful space environment powered by THREE.js.

*   **Time Trial Levels:** Race against the clock to deliver packages across a variety of intricate levels.
*   **Star Rating System:** Achieve perfect runs and fast times to earn up to three stars per level. Challenge yourself to beat your own records!
*   **Endless Mode:** How far can you go? Survive as long as possible in an unending gauntlet of obstacles.
*   **Persistent Scores:** Your best times and star ratings are saved locally, allowing you to track your progress and continuously improve.
*   **Intuitive Mobile Controls:** Designed for a smooth and responsive experience on mobile devices.
*   **Weekly Level Updates:** New challenges are added regularly to keep the gameplay fresh and exciting.

## Technologies Used

*   **THREE.js:** For stunning 3D rendering and scene management.
*   **React:** Building the user interface and game components.
*   **Zustand:** A fast and scalable state management solution for React.
*   **Vite:** A lightning-fast build tool for modern web projects.
*   **Local Storage:** For client-side data persistence of scores and progress.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```sh
    git https://github.com/Akkibi/thrust-express.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Run the development server
    ```sh
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173` (or the port Vite specifies).

### Add your own maps

1. Add a new map image in the `public/mapImages` folder.
2. Run the python terrain generation script with make to generate the map data Json file.
    ```sh
    make maps
    ```
3. Create a new entry in the `src/levels.ts` file and link it to the new map image.
4. Run the development server to see the changes.

## How To Play

*   **Objective:** Navigate your spaceship through the walls from point A to point B in the shortest time.
*   **Controls:** (Explain your mobile controls here, e.g., "Tilt your device to steer," "Tap the screen to thrust," etc.)
*   **Star Rating:**
    *   **Time:** Faster times contribute to more stars.
    *   **Collisions:** Avoid hitting walls! Each collision reduces your potential star rating.
*   **Endless Mode:** Survive for as long as possible by avoiding all obstacles.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the Creative Commons NonCommercial (CC BY-NC, CC BY-NC-SA, CC BY-NC-ND) license.

## Contact

Valade Akira - akiravalade@gmail.com

Project Link: [github.com/Akkibi/thrust-express](https://github.com/Akkibi/thrust-express)

---
