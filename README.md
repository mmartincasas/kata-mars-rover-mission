# 🚀 Mars Rover Mission

Simulation of an exploratory Rover navigating a square planet (200x200), receiving commands from Earth to move, turn, and detect obstacles.

As part of the Mars exploration team, your task is translates commands sent from Earth into instructions understood by the Rover.

### ✨ Features

- The rover has an initial position `(x, y)` and a facing direction (`N`, `S`, `E`, `W`).
- It receives a string of commands, e.g. `FFRRFFFRL`.
- Valid commands:
  - `F` → Move forward one unit in the current direction
  - `L` → Turn left
  - `R` → Turn right
- The planet is a **200x200** grid.
- The rover must **detect obstacles before moving**:
  - If it encounters an obstacle, it stops before the impact
  - Then, aborted sequence, and reports the last reachable position

## 🛠️ Tech Stack

- **Vue 3**
- **TypeScript**
- **Tailwind CSS 3.3**

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/mars-rover.git
cd mars-rover
npm install
npm run dev
```
