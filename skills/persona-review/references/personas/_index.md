# Available Personas

Load individual persona files on-demand using their persona ID.

## Surveillance Roles

- **`air-surveillance-tech`** - Air Surveillance Technician (E4-E7)
  - Validates tracks, manages sensor health, coordinates surveillance info
  - Moderate schedule, 4+ years experience

- **`surveillance-tech`** - Surveillance Technician (E1-E6)
  - First in killchain: detect, identify, maintain continuity
  - Busy schedule, entry to 5 years experience

## Weapons Roles

- **`weapons-director`** - Weapons Director (O1-O3)
  - Control fighters, recommend tactical actions
  - Busy schedule, 2+ years experience

- **`senior-director`** - Senior Director (O3-O4)
  - Approve tactical actions and missions
  - Busy schedule, 4+ years experience

- **`air-weapons-officer`** - Air Weapons Officer (O1-O2)
  - Place alert base status orders, control COMSEC
  - Moderate schedule, 2+ years experience

## Command Roles

- **`mission-crew-commander`** - Mission Crew Commander (O4-O5)
  - Approve tactical actions, manage crew
  - Busy schedule, 6+ years experience

## Loading Personas

Use the Read tool to load specific persona files:

```
Read references/personas/{persona-id}.md
```

Example:
```
Read references/personas/air-surveillance-tech.md
```
