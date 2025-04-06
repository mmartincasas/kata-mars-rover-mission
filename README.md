# 🚀 Mars Rover Mission

A simulation of a Mars Rover navigating a square planetary surface, interpreting commands from Earth to move, turn, and avoid obstacles in real-time.

This project is an interactive UI built with Vue 3 where you control a Rover by entering commands, observing its path on a grid-based map, and receiving status feedback based on the mission outcome.

---

### 🌍 Planet Specs

- The planet is a 41x41 grid (coordinates range from 0 to 40 and are configurable via constants).
- The rover starts at a given (x, y) coordinate and faces a direction: N, S, E, or W.

---

### ✨ Features

- 🧭 **Directional Movement**  
  Send the rover a sequence of commands such as `FFRFLF`:
  - `F` → Move forward one unit
  - `L` → Turn left (90° counter-clockwise)
  - `R` → Turn right (90° clockwise)

- 🚧 **Obstacle Detection**  
  The rover stops if:
  - It's about to collide with an obstacle
  - It's about to appear on a tile occupied by an obstacle
  - It attempts to move outside the grid boundaries  
  Errors are clearly reported, stopping the rover before impact and preserving its position.

- 🔄 **Real-time Status Feedback**
  - States include: `waiting`, `executing`, `success`, `errorLimits`, `errorAppearInObstacle` and `errorObstacle`
  - Execution is visually animated on the grid.

- 🧪 **Input Validation**
  - Coordinates must be within the valid map range
  - Commands must only include `F`, `L`, `R`

---

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 3.3](https://tailwindcss.com/)

---

## 🚀 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/mmartincasas/kata-mars-rover-mission
```

2. **Go to the project root folder and install dependencies:**

```bash
npm install
```

3. **Run de development server:**

```bash
npm run dev
```

4. **This will start the Vite development server. By default, it runs at:**

```bash
http://localhost:5173
```

5. **Explore de simulation:**

  - Enter an initial position (x, y) and direction (N, E, S, W)
  - Type a command sequence (e.g., FFRFL)
  - Hit Send Commands to see the rover move across the grid
