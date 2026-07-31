# Available Personas

Load individual persona files on demand by persona ID.

## Surveillance Roles

- **`air-surveillance-tech`** - Air Surveillance Technician (E4-E7)
  - Validates tracks, manages sensor health, and coordinates surveillance information
  - Moderate schedule, 4+ years of experience

- **`surveillance-tech`** - Surveillance Technician (E1-E6)
  - First in killchain: detect, identify, and maintain continuity
  - Busy schedule, entry level to 5 years of experience

## Weapons Roles

- **`weapons-director`** - Weapons Director (O1-O3)
  - Controls fighters and recommends tactical actions
  - Busy schedule, 2+ years of experience

- **`senior-director`** - Senior Director (O3-O4)
  - Approves tactical actions and missions
  - Busy schedule, 4+ years of experience

- **`air-weapons-officer`** - Air Weapons Officer (O1-O2)
  - Places alert base status orders and controls COMSEC
  - Moderate schedule, 2+ years of experience

## Command Roles

- **`mission-crew-commander`** - Mission Crew Commander (O4-O5)
  - Approves tactical actions and manages the crew
  - Busy schedule, 6+ years of experience

## Loading Personas

Use the Read tool to load a specific persona file:

```
Read references/personas/{persona-id}.md
```

Example:
```
Read references/personas/air-surveillance-tech.md
```
