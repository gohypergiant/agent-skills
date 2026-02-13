# Persona-Based Design Review

Evaluate Figma designs through the lens of specific operator personas, surfacing insights that generic UX reviews miss.

## Workflow

### 1. Load the Persona
- Parse the persona argument (e.g., `air-surveillance-tech`)
- Locate the matching profile in PERSONA PROFILES section below
- If persona not found, list available personas and ask user to choose

### 2. Gather Design Context
**If Figma URL provided:**
- Use Figma MCP to fetch the design from the URL

**If no URL (default):**
- Use Figma MCP desktop to get current file/selection
- If nothing selected, prompt user to select a frame or component

### 3. Search Supporting Documentation
**Note:** To use the Outline MCP server, you must use the flag `use millipedia`.

Use Outline MCP to find relevant docs:
- UI standards/guidelines for this operator role
- Previous design reviews or feedback
- System requirements or specifications
- Training materials or user guides

Prioritize documents that mention the persona's role, responsibilities, or systems they interact with.

### 4. Analyze & Critique

Evaluate the design against the persona's profile using this framework:

#### Cognitive Load Assessment
- **Information density**: Can they process all displayed data given their experience level and schedule?
- **Visual hierarchy**: Does the most critical info for their role stand out immediately?
- **Mental models**: Does the interface match their existing mental models from systems they already use?

#### Communication Pattern Alignment
- **"Says & Does" support**: Does the UI facilitate their typical actions and communications?
- **Workflow integration**: How well does this fit into their documented workflows?
- **Error prevention**: Does it prevent mistakes they're known to make?

#### Pain Point Mitigation
- **Direct pain relief**: Which documented pain points does this design address?
- **Inadvertent pain creation**: Does this introduce new friction or complexity?
- **System consolidation**: If they juggle multiple systems, does this reduce context switching?

#### Context Awareness
- **Experience calibration**: Is complexity appropriate for their rank/experience level (e.g., E4 vs E7)?
- **Responsibility alignment**: Does the design support their specific responsibilities?
- **Schedule considerations**: Can they use this effectively given their work schedule/tempo?

#### System Visibility
- **"Sees" coverage**: Are the systems they monitor visible/accessible (e.g., BCS-F, RS-4, ERSA)?
- **Integration gaps**: What critical systems are missing?
- **Redundancy**: Is there unnecessary duplication of information they already see elsewhere?

#### Communication Support
- **"Hears" integration**: Does the design support their communication channels (e.g., Surveillance Net, Crew Net)?
- **Information relay**: Can they easily relay information as documented in "Says & Does"?
- **Notification design**: Are alerts/notifications appropriate for their attention budget?

### 5. Structure the Output

Provide critique in this format:

```
## Persona Review: [Persona Name]

### Design Summary
[1-2 sentence summary of what you reviewed]

### Critical Findings
[2-3 most important insights specific to this persona]

### Detailed Evaluation

**Cognitive Load**: [Assessment with specific examples]

**Communication Patterns**: [How well it supports their "Says & Does"]

**Pain Point Mitigation**: [Which pain points addressed/created]

**Context Awareness**: [Appropriate for their experience/responsibilities]

**System Visibility**: [Coverage of their "Sees" systems]

**Communication Support**: [Integration with their "Hears" channels]

### Recommendations
[Prioritized list of actionable improvements]

### Supporting References
[Links to relevant Outline docs found during research]
```

## Evaluation Principles

**Be specific to the persona**: Generic UX advice ("make it more intuitive") is not helpful. Ground every observation in the persona's documented profile.

**Prioritize operational impact**: A minor UI inconsistency that breaks muscle memory for a high-tempo operator is more important than a major visual polish issue.

**Assume domain expertise**: These operators are experts in their field. Don't suggest "simplifications" that remove necessary complexity.

**Consider the full context**: Review their entire profile (Profile, About, Hears, Sees, Says & Does, Pain Points) - insights often emerge from connections between sections.

---

## PERSONA PROFILES

Add operator persona profiles here. Each profile should include: Profile (age, rank, schedule, position, responsibility), About them, Hears, Sees, Says & Does, and Pain Points.

### Air Surveillance Technician

**Persona ID**: `air-surveillance-tech`

**Profile:**
- **Age:** 23+ (~4+ years of experience)
- **Rank:** Staff Sergeant → Master Sergeant (E4-E7)
- **Schedule:** Moderate work schedule
- **Position:** Surveillance Filter to Killchain
- **Responsibility:** Validate Tracks/Weather, Manage Sensor Health, Manage Surveillance Section, Coord Surveillance info to Crew, E3 Coord/approval

**About them:**
- Responsible for Accurate Air Picture
- Validates "Tracks"
- Manages Sensor Health
- Coordinates w/ CFP (Comm Focal Point) for maintenance/sensor issues
- Certified ERSAOs (Enhanced Regional Situational Awareness Operator)
- Interpret Weather Data to best assess Track vs Weather validation
- Coordinate w/ Weapons Section for alternate frequencies for E-3s
- Pass pertinent surveillance information to crew
- RS-4 Operator (playback for validation)
- Reconstruction of TOI event(s)

**Hears:**
- Surveillance Net
- Crew Net
- CONR 1

**Sees:**
- BCS-F
- RS-4
- ERSA (Enhanced Regional Situational Awareness system)

**Says & Does:**
- Relays "Valid" "Not Valid" to ST regarding track validation
- Use of RS-4 for validation/weather patterns
- Use of ERSA for NCR validation (visual/EO/IR)

**Pain Points:**
- Manual decision of "valid" / "Not valid"
- Use of 7+ systems/sites to get the whole picture and enable decision making
- Phone calls to CFP for sensor status updates

### Surveillance Technician

**Persona ID**: `surveillance-tech`


**Profile:**
- **Age:** 18+ (Entry Position → ~4/5 years)
- **Rank:** Airman Basic → Technical Sergeant (E1-E6)
- **Schedule:** Busy work schedule
- **Position:** First in killchain
- **Responsibility:** Detect, Identify, Maintain continuity (F2T) Find Fix Track

**About them:**
- Identify radar patterns resembling that of aircraft
- Identify weather patterns of radar data
- Initiate "tracks" onto data sets resembling an aircraft (Pass to AST to validate)
- Identify "valid" tracks
- Primary DEN coordinator/"talker"
- Pass DEN info to the Crew
- Identify Potential TOIs (a/c close to breaking "rules" in NCR/TFR)
- Maintain continuity of TOIs/PTOIs (Hdg/Spd/Alt/M3 changes)
- Investigate for pertinent aircraft information
- Enforce ADIZ rules (M3/flt plan/etc)
- Coordinate for scheduled flying w/ Navy, Coast Guard, other agencies
- Update AEISS card

**Hears:**
- Surveillance Net
- Crew Net (Occasional)
- Phone Calls for Flight Coordination
- Domestic Events Network (DEN)
- E-3 Frequency (live fly TFR Voicetell) (Occasional)
- Auxiliary volume crew coordination (Voice)

**Sees:**
- BCS-F
- AMOSS (Air and Marines Operations Surveillance System)
- TSD
- NIPR (Unclass Internet)
- SIPR (Secret computer)
- ID Board
- MVP (Comms Device)
- Flight Aware
- Weather Patterns
- ADSB-Exchange
- AEISS

**Says & Does:**
- Requests Validation from AST on "possible" tracks via Surveillance Net
- Communicates w/ DEN via DEN phone/line
- Passes DEN info to Crew via Crew Net
- Coordinates w/ external agencies for flight coordination / NAVY ship locations
- Detects "tracks" & possible tracks
- Identifies A/C via use of AMOSS/TSD/Flight Aware/ ID Board / External Coord
- Fill out AEISS card w/ proper track information along w/ manifest etc

**Pain Points:**
- Differentiating weather from tracks
- Listening to multiple different nets/voices/lines
- Toggling between 8 different screens of information
- Unable to group data sets (plots) to create a track and associate to it / keeping tracks on data user establishes as part of the trail
- No system-inherent uses to aid in identification (agencies based on kinematics/location)
- No alerts/maintenance ability to be queued as to when kinematics change

### Weapons Director (WD)

**Persona ID**: `weapons-director`

**Profile:**
- **Age:** 22+ (~2+ years of experience)
- **Rank:** 2nd Lieutenant → Captain (O1-O3)
- **Schedule:** Busy work schedule
- **Position:** Weapons Lead
- **Responsibility:** Control Fighters, Recommend Tactical Actions and Missions to SD, Manage Weapons Section

**About them:**
- Control fighters via radios
- Manage Radio Status
- Place T.A. calls to the bases
- Threat Assess
- Mission Plan
- Place guard calls
- Calculate intercept points, navigate fighters to quickest route
- Pass orders, engagements, instructions to fighters
- Pass instructions to TOIs (turn around, squawk IDENT, and contact FAA)
- Update AEISS card

**Hears:**
- Weapons Net
- Crew Net
- AICC
- Domestic Events Network (DEN)
- Auxiliary volume crew coord (Voice)
- Fighter Comms
- TOI Comm (Guard Calls)
- JADOC Net

**Sees:**
- BCS-F
- NIPR
- SIPR
- MVP (Comms Device)
- WindyTV
- Radio Mx Board/Overlay

**Says & Does:**
- Acknowledges crew calls for track point outs
- Measures track to nearest defended point/searches for presumed target
- Recommends Scramble route and actions to SD
- Relay orders to ACA bases (T.A.s) as well as to fighters when airborne
- Conveys air picture to fighters/assets
- Relays T.A.s over DEN
- Mission plans for scrambles and LRA etc/ and POTUS movements to determine response times and assets
- Make Guard calls to PTOIs/TOIs in restricted airspace or approaching
- Update AEISS cards w/ weapons section / base status/ timings of placed calls/ 9LA/B and flares/missiles expended etc

**Pain Points:**
- No automatic way to track radio outages (radios are both input as land points and mutated points)
- Needs vector assist
- Manual math for threat assessment and scrambles routes and vectors for intercept points
- Manual COA generation/recommendations
- Manually chats and updates AEISS what information could be auto imported/copied
- Manually updates base status with overlay mutations

### Senior Director (SD)

**Persona ID**: `senior-director`

**Profile:**
- **Age:** 24+ (~4+ years of experience)
- **Rank:** Captain → Major (O3-O4)
- **Schedule:** Busy work schedule
- **Position:** Weapons Lead
- **Responsibility:** Approve Tactical Actions and Missions, Control Fighters, Manage Weapons Section, Approve Alert base status orders, Approve Tactical Actions

**About them:**
- Approves Tactical Actions
- Approves Mission Plans
- Approves T.A. calls to the bases
- Threat Assess
- Approves guard calls
- Approves intercept points, navigate fighters to quickest route
- Approves orders, engagements, instructions to fighters
- Approves instructions to TOIs (turn around, squawk IDENT, and contact FAA)
- Update AEISS card

**Hears:**
- Weapons Net
- Crew Net
- AICC
- Domestic Events Network (DEN)
- Auxiliary volume crew coord (Voice)
- Fighter Comms
- TOI Comm (Guard Calls)
- JADOC Net

**Sees:**
- BCS-F
- NIPR
- SIPR
- MVP (Comms Device)
- WindyTV
- Radio Mx Board/Overlay

**Says & Does:**
- Acknowledges crew calls for track point outs
- Approves track to nearest defended point/searches for presumed target
- Approves Scramble route and actions
- Approves orders to ACA bases (T.A.s) as well as to fighters when airborne
- Approves air picture to fighters/assets
- Approves T.A.s over DEN
- Approves mission plans for scrambles and LRA etc/ and POTUS movements to determine response times and assets
- Approves Guard calls to PTOIs/TOIs in restricted airspace or approaching
- Update AEISS cards w/ weapons section / base status/ timings of placed calls/ 9LA/B and flares/missiles expended etc

**Pain Points:**
- No automatic way to track radio outages (radios are both input as land points and mutated points)
- Needs vector assist
- Manual math for threat assessment and scrambles routes and vectors for intercept points
- Manual COA generation/recommendations
- Manually chats and updates AEISS what information could be auto imported/copied
- Manually updates base status with overlay mutations

### Mission Crew Commander (MCC)

**Persona ID**: `mission-crew-commander`

**Profile:**
- **Age:** 26+ (~6+ years of experience)
- **Rank:** Major → Lt Colonel (O4-O5)
- **Schedule:** Busy work schedule
- **Position:** Crew Lead
- **Responsibility:** Approve Tactical Actions and Missions, Control Fighters, Manage Crew, Approve Alert base status orders, Approve Tactical Actions

**About them:**
- Approves Tactical Actions
- Approves Mission Plans
- Approves T.A. calls to the bases
- Threat Assess
- Approves guard calls
- Approves intercept points, navigate fighters to quickest route
- Approves orders, engagements, instructions to fighters
- Approves instructions to TOIs (turn around, squawk IDENT, and contact FAA)
- Update AEISS card

**Hears:**
- Weapons Net
- Crew Net
- AICC
- Domestic Events Network (DEN)
- Auxiliary volume crew coord (Voice)
- Fighter Comms
- TOI Comm (Guard Calls)
- JADOC Net

**Sees:**
- BCS-F
- NIPR
- SIPR
- MVP (Comms Device)
- WindyTV
- Radio Mx Board/Overlay

**Says & Does:**
- Acknowledges crew calls for track point outs
- Approves track to nearest defended point/searches for presumed target
- Approves Scramble route and actions
- Approves orders to ACA bases (T.A.s) as well as to fighters when airborne
- Approves air picture to fighters/assets
- Approves T.A.s over DEN
- Approves mission plans for scrambles and LRA etc/ and POTUS movements to determine response times and assets
- Approves Guard calls to PTOIs/TOIs in restricted airspace or approaching
- Update AEISS cards w/ weapons section / base status/ timings of placed calls/ 9LA/B and flares/missiles expended etc

**Pain Points:**
- No automatic way to track radio outages (radios are both input as land points and mutated points)
- Needs vector assist
- Manual math for threat assessment and scrambles routes and vectors for intercept points
- Manual COA generation/recommendations
- Manually chats and updates AEISS what information could be auto imported/copied
- Manually updates base status with overlay mutations

### Air Weapons Officer (AWO)

**Persona ID**: `air-weapons-officer`

**Profile:**
- **Age:** 22+ (~2+ years of experience)
- **Rank:** 1st Lieutenant → 2nd Lieutenant (O1-O2)
- **Schedule:** Moderate work schedule
- **Position:** Weapons Lead
- **Responsibility:** Place Alert base status orders, Monitor alert base status, Control Fighters, Recommend Tactical Actions and Missions to MCC, Control COMSEC required to authenticate Safe passage and Alert Base Status Changes (AKAC 1553, AKAL1553)

**About them:**
- Control fighters via radios
- Manage Radio Status
- Place T.A. calls to the bases
- Threat Assess
- Mission Plan
- Place guard calls
- Calculate intercept points, navigate fighters to quickest route
- Pass orders, engagements, instructions to fighters
- Pass instructions to TOIs (turn around, squawk IDENT, and contact FAA)
- Update AEISS card

**Hears:**
- Weapons Net
- Crew Net
- AICC
- Domestic Events Network (DEN)
- Auxiliary volume crew coord (Voice)
- Fighter Comms
- TOI Comm (Guard Calls)
- JADOC Net

**Sees:**
- BCS-F
- NIPR
- SIPR
- MVP (Comms Device)
- WindyTV
- Radio Mx Board/Overlay

**Says & Does:**
- Acknowledges crew calls for track point outs
- Measures track to nearest defended point/searches for presumed target
- Recommends Scramble route and actions to SD
- Relay orders to ACA bases (T.A.s) as well as to fighters when airborne
- Conveys air picture to fighters/assets
- Relays T.A.s over DEN
- Mission plans for scrambles and LRA etc/ and POTUS movements to determine response times and assets
- Make Guard calls to PTOIs/TOIs in restricted airspace or approaching
- Update AEISS cards w/ weapons section / base status/ timings of placed calls/ 9LA/B and flares/missiles expended etc

**Pain Points:**
- No automatic way to track radio outages (radios are both input as land points and mutated points)
- Needs vector assist
- Manual math for threat assessment and scrambles routes and vectors for intercept points
- Manual COA generation/recommendations
- Manually chats and updates AEISS what information could be auto imported/copied
- Manually updates base status with overlay mutations


---

### [Add More Personas Here]

**Template for new personas:**

```markdown
### [Persona Name]

**Persona ID**: `persona-identifier`

**Profile:**
- **Age:**
- **Rank:**
- **Schedule:**
- **Position:**
- **Responsibility:**

**About them:**
[Bullet points describing their role, certifications, responsibilities]

**Hears:**
[Communication channels they monitor]

**Sees:**
[Systems and interfaces they interact with]

**Says & Does:**
[Typical actions and communications]

**Pain Points:**
[Known frustrations and challenges]
```
