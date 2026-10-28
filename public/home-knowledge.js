/* Educational component explanations. Locations and internal geometry are schematic.
   Product specifications are linked separately from these general working principles. */
(() => {
  const parts = {};
  const add = (id, name, what, how, impact, sub, related = []) =>
    (parts[id] = { name, what, how, impact, sub, related });
  add(
    "display",
    "Display Assembly",
    "The complete screen combines protective glass, a touch-sensing layer, an OLED panel and electronic drivers. Each layer performs a different job; the glass alone does not produce an image.",
    "The display controller sends pixel data to the panel. Organic light-emitting subpixels create red, green and blue light, while capacitive electrodes detect changes caused by your finger. Refresh rate controls how often the picture can update; app frame rate controls how many new frames the app supplies.",
    "Resolution affects detail, brightness affects visibility and refresh rate affects motion. Higher brightness and demanding refresh settings can use more power. A screen with a high refresh rate cannot make an unsupported game run at that frame rate.",
    [
      [
        "Protective glass",
        "The outer barrier resists everyday contact and protects the layers below. Scratch resistance and drop resistance are different properties; neither makes a screen unbreakable.",
      ],
      [
        "OLED pixel layer",
        "Self-emitting subpixels generate the image. Dark pixels can emit little or no light, giving deep blacks; long exposure to fixed bright content can contribute to uneven aging.",
      ],
      [
        "Touch digitizer",
        "A grid of conductive electrodes measures changes in capacitance and maps them to touch coordinates. Touch sampling and display refresh describe different processes.",
      ],
      [
        "Driver and display flex",
        "Driver electronics control the panel while a flexible circuit carries power and data from the mainboard. The flex is an electrical connection, not a second display.",
      ],
    ],
    ["sensors", "frontcam"],
  );
  add(
    "battery",
    "Battery",
    "A rechargeable lithium-ion cell stores energy chemically. The battery pack also connects to monitoring and protection circuitry; the printed capacity is only one factor in battery life.",
    "During discharge, chemical reactions drive current through the phone. Charging reverses the energy-storage process under controlled voltage, current and temperature. The system reduces charging current as the cell approaches its upper charge limit.",
    "Capacity, display brightness, radio conditions, background work and battery age all affect runtime. A 5,000 mAh label cannot by itself predict how many hours a particular game will run.",
    [
      [
        "Electrochemical cell",
        "Electrodes, electrolyte and a separator enable controlled ion movement. This is where most of the pack’s energy is stored.",
      ],
      [
        "Protection and monitoring",
        "Circuits monitor operating conditions and help prevent charging or discharging outside allowed limits. These controls do not make physical cell damage harmless.",
      ],
      [
        "Battery connector",
        "Contacts and a short flex connect the pack to power circuits and monitoring lines. Poor contact can interrupt power even if the cell has charge.",
      ],
    ],
    ["charge", "cooling"],
  );
  add(
    "board",
    "Mainboard",
    "A multilayer printed circuit board connects the application processor, memory, radios, power management and peripheral modules. Conductive traces run within the board as well as on its surface.",
    "High-speed signal paths carry camera, memory, display and storage data. Power planes distribute regulated supplies, while grounding and shielding help control interference. Connectors join replaceable assemblies to the main board.",
    "The board coordinates the whole phone. A camera problem can involve a module, connector, supply or software path; it does not automatically identify one faulty chip.",
    [
      [
        "Printed circuit layers",
        "Copper traces, ground planes and insulating layers route signals in a compact area. Their exact stack-up is not documented by this prototype.",
      ],
      [
        "Power-management ICs",
        "Regulators convert battery power into the different voltage rails required by chips and peripherals.",
      ],
      [
        "Shielding and connectors",
        "Metal shields reduce electromagnetic coupling; board connectors link flex cables and modules. The reference diagram does not verify individual chip positions.",
      ],
    ],
    ["cpu", "ram", "stor", "antenna"],
  );
  add(
    "cpu",
    "Processor & SoC",
    "The system-on-chip integrates CPU cores and specialist engines such as graphics, image processing and AI acceleration. It is a collection of cooperating processors rather than one general-purpose engine.",
    "The CPU schedules instructions and operating-system work. The GPU handles highly parallel graphics tasks; an ISP processes camera signals, and dedicated accelerators can run supported machine-learning operations. Software assigns work to the appropriate engine.",
    "App responsiveness depends on workload, software and available thermal headroom. A clock frequency or manufacturing-node label alone cannot determine real game performance.",
    [
      [
        "CPU cores and cache",
        "Cores execute program instructions. Small, fast caches reduce trips to slower memory; performance and efficiency cores can serve different workloads.",
      ],
      [
        "Graphics processor",
        "The GPU renders interfaces and 3D scenes using many parallel execution units. Game support, resolution and drivers affect its delivered frame rate.",
      ],
      [
        "Image-signal processor",
        "The ISP processes raw camera information, including operations such as color reconstruction and noise reduction. Final image quality also depends on optics and software.",
      ],
      [
        "AI accelerator",
        "Dedicated compute units can accelerate compatible neural-network operations. Availability depends on the application and software stack.",
      ],
    ],
    ["ram", "stor", "cooling"],
  );
  add(
    "ram",
    "Memory / RAM",
    "RAM provides fast, temporary working space for active applications, operating-system services and graphics resources. Its contents normally disappear when power is removed.",
    "The processor reads and writes working data through a memory controller. The operating system allocates space, caches useful data and may close background processes when memory pressure rises.",
    "More RAM can reduce app reloads, but cannot compensate for every CPU, graphics or software bottleneck. Virtual-memory features use storage and are not equivalent to the same amount of physical RAM.",
    [
      [
        "DRAM cells",
        "Tiny storage cells hold bits and need refresh operations to maintain their state.",
      ],
      [
        "Memory controller",
        "Coordinates read and write requests, timing and power states between the processor and memory.",
      ],
      [
        "Software memory manager",
        "Allocates address space, manages caches and responds to memory pressure. It is software, not a separate physical chip.",
      ],
    ],
    ["cpu", "stor"],
  );
  add(
    "stor",
    "Internal Storage",
    "Non-volatile flash storage holds the operating system, applications, photographs and downloaded files even after the phone is turned off.",
    "A storage controller translates requests into flash operations. It manages error correction, wear leveling and logical-to-physical address mapping. Reading, writing and random access have different performance characteristics.",
    "Free capacity and storage responsiveness affect installs, recording and file handling. Advertised capacity differs from available space because formatting, system files and installed software use part of it.",
    [
      [
        "NAND flash",
        "Non-volatile memory cells retain data without continuous power. Cells have finite write endurance.",
      ],
      [
        "Storage controller",
        "Manages access, error correction and wear distribution across the flash.",
      ],
      [
        "File system and encryption",
        "Software organizes files and protects stored information. Encryption keys and authentication are separate from raw storage capacity.",
      ],
    ],
    ["ram", "cpu"],
  );
  add(
    "rearcam",
    "Rear Camera System",
    "Rear cameras combine optics, image sensors, focusing hardware and processing. Separate wide, ultrawide and telephoto modules provide different fields of view.",
    "Lenses focus light onto a sensor, which converts it into electrical measurements. Autofocus adjusts focus; supported stabilization compensates for some movement. The ISP and camera software then create the final photo or video.",
    "Megapixel count is only one factor. Sensor area, lens quality, exposure, motion, processing and available light all influence the result. Digital zoom crops or processes an image; optical zoom uses a different optical field of view.",
    [
      [
        "Wide camera",
        "The main camera is the everyday imaging module. The S23 Ultra reference lists 200 MP; output resolution and processing depend on the selected mode.",
      ],
      [
        "Ultrawide camera",
        "A wider field of view captures more of a scene. The reference lists 12 MP; perspective and edge distortion differ from the main camera.",
      ],
      [
        "3× telephoto camera",
        "A separate 10 MP module offers a narrower field of view for closer framing. Camera software can switch modules according to light and distance.",
      ],
      [
        "10× telephoto camera",
        "A separate 10 MP long-zoom module provides the reference’s 10× optical field of view. Optical design and stabilization matter at long focal lengths.",
      ],
      [
        "Lens elements and housing",
        "Several optical elements shape the light path. A housing maintains alignment and keeps the optical stack positioned over the sensor.",
      ],
      [
        "Image sensor",
        "A photosensitive pixel array converts light into signals. Exposure time, sensor gain and readout affect noise, motion and dynamic range.",
      ],
      [
        "Autofocus actuator",
        "Moves a lens group to place the subject in focus. Focus range and speed depend on the camera module and scene.",
      ],
      [
        "Stabilization assembly",
        "Supported modules shift optical elements to compensate for some hand movement. Stabilization cannot freeze a moving subject.",
      ],
      [
        "Laser autofocus assist",
        "An auxiliary distance-sensing system can help focus acquisition. It does not replace the camera sensor or perform all focusing by itself.",
      ],
      [
        "Camera flex and connector",
        "Carries power, control and image data between the module and mainboard. Its illustrated placement is schematic.",
      ],
    ],
    ["frontcam", "cpu", "stor"],
  );
  add(
    "frontcam",
    "Front Camera",
    "The front-facing camera supports selfies and video calls. The S23 Ultra reference lists a 12 MP autofocus front camera.",
    "Light passes through a compact lens onto an image sensor. Camera software adjusts exposure, focus and processing before the app receives an image stream.",
    "Call quality also depends on network bandwidth and the app’s compression. A standard selfie camera is not automatically a dedicated secure depth-based face-authentication system.",
    [
      [
        "Lens and autofocus",
        "The lens focuses the scene; autofocus adjusts for different subject distances.",
      ],
      [
        "Image sensor",
        "Converts incoming light into an electronic image. Small pixels and limited light can affect noise.",
      ],
      [
        "Module connector",
        "Connects the camera to its supply, control and image-data paths on the board.",
      ],
    ],
    ["display", "cpu"],
  );
  add(
    "charge",
    "USB-C & Charging Board",
    "The lower connector assembly links a compatible cable to charging and data circuitry. The complete charging system also involves the mainboard, battery and software.",
    "The device and compatible charger negotiate power. Charging controllers and regulators manage the electrical supply, while thermal and battery limits can reduce the accepted power. USB data capabilities are separate from charging wattage.",
    "The reference supports up to 45 W wired charging with suitable equipment. That is a maximum capability, not a constant charging rate or a guaranteed full-charge time.",
    [
      [
        "USB-C receptacle",
        "The reversible physical connector carries power and supported data signals. Connector shape alone does not specify speed.",
      ],
      [
        "Daughterboard and flex",
        "A small PCB and interconnect join the lower port to the mainboard. Module contents and layout vary by device revision.",
      ],
      [
        "Charging controller",
        "Controls power conversion and charge behavior together with the battery-management system. It is not necessarily located entirely on the lower board.",
      ],
      [
        "Port protection",
        "Protection components help manage electrostatic discharge and electrical transients on external connections.",
      ],
    ],
    ["battery", "wireless", "flex"],
  );
  add(
    "speaker",
    "Speakers",
    "Small electroacoustic drivers turn electrical audio signals into pressure waves. Stereo playback uses more than one acoustic output.",
    "An audio amplifier drives a moving element and diaphragm. The enclosure and outlet shape the resulting sound; software processing adjusts levels and tonal balance.",
    "Loudness, clarity and bass depend on driver size, enclosure, tuning and available power. A blocked grille can change sound without a failure in the processor.",
    [
      [
        "Driver and diaphragm",
        "A moving diaphragm creates sound waves from an electrical input.",
      ],
      [
        "Amplifier",
        "Provides controlled electrical power to the driver and can apply protection limits.",
      ],
      [
        "Acoustic chamber and outlet",
        "The enclosure, mesh and sound path affect resonance and how sound exits the phone.",
      ],
    ],
    ["microphone", "frame"],
  );
  add(
    "motor",
    "Haptic / Vibration Motor",
    "An electromechanical actuator creates tactile feedback for alerts, typing and interface actions. Haptics are separate from speaker sound.",
    "A driver applies a controlled waveform that moves a mass. The resulting force transfers into the enclosure. The exact actuator construction is not verified by this reference model.",
    "A precise actuator and well-tuned software can make feedback feel crisp. Stronger vibration is not necessarily more accurate feedback.",
    [
      [
        "Actuator assembly",
        "Converts electrical input into mechanical motion.",
      ],
      [
        "Moving mass and support",
        "An internal mass transfers vibration into the device structure; its illustrated geometry is schematic.",
      ],
      [
        "Haptic driver",
        "Controls pulse timing and strength in response to software events.",
      ],
    ],
    ["frame", "battery"],
  );
  add(
    "cooling",
    "Thermal / Cooling System",
    "Passive thermal materials move heat away from concentrated sources and spread it across a larger area. They do not actively refrigerate the phone.",
    "Heat conducts from chips through interface materials into spreaders, graphite or a vapor-chamber assembly. A vapor chamber uses evaporation and condensation to redistribute heat. The enclosure then releases heat to the surroundings.",
    "Cooling influences sustained performance. Ambient temperature, case, charging and workload all affect thermal limits; a larger spreader alone cannot establish exact temperatures or FPS.",
    [
      [
        "Thermal interface",
        "Bridges microscopic gaps between a chip package and its heat-transfer surface.",
      ],
      [
        "Vapor chamber / spreader",
        "Spreads localized heat over a larger region through conduction and, in a vapor chamber, a phase-change cycle.",
      ],
      [
        "Graphite and enclosure path",
        "Thin conductive sheets and structural parts help distribute heat. Actual material coverage is not mapped by the schematic.",
      ],
    ],
    ["cpu", "battery", "frame"],
  );
  add(
    "antenna",
    "Antennas & Radio System",
    "Antennas convert radio-frequency electrical energy into electromagnetic waves and receive waves from the environment. Different radio systems use different signal paths.",
    "The modem and radio transceiver process signals; amplifiers, filters and switches condition them before they reach antenna elements. Multiple antennas can support diversity and compatible multi-stream communication.",
    "Reception depends on supported bands, network coverage, hand position and the environment. Chipset radio capabilities do not guarantee that every feature or band is enabled on a particular phone.",
    [
      [
        "Antenna elements",
        "Conductive structures transmit and receive signals within designed frequency ranges.",
      ],
      [
        "RF front end",
        "Filters, switches and amplifiers route and condition radio signals.",
      ],
      [
        "Modem / baseband",
        "Handles cellular signal processing and network communication protocols.",
      ],
      [
        "Coax and contact paths",
        "Small cables and spring contacts connect radio circuits to antenna structures.",
      ],
    ],
    ["frame", "sim"],
  );
  add(
    "sensors",
    "Sensors & Biometrics",
    "Sensors measure motion, light, proximity and other physical conditions. Biometric sensors capture traits used by authentication software.",
    "Sensor elements turn physical changes into electrical measurements. Controllers and operating-system services combine those readings, for example to estimate orientation or adjust brightness. An ultrasonic fingerprint reader uses sound-based sensing.",
    "Sensors enable navigation assistance, screen rotation and call behavior. Permissions and software influence how readings are used; a sensor’s presence does not guarantee every app will access it.",
    [
      [
        "Accelerometer and gyroscope",
        "Measure linear acceleration and rotational movement, supporting orientation and motion-based interactions.",
      ],
      [
        "Ambient light and proximity",
        "Help adjust brightness and detect nearby objects, such as a face during a call.",
      ],
      [
        "Geomagnetic and barometric sensors",
        "Measure magnetic field and air pressure for compatible direction and altitude-related features.",
      ],
      [
        "Ultrasonic fingerprint reader",
        "Captures fingerprint information for supported biometric authentication. Authentication decisions also involve secure software.",
      ],
    ],
    ["display", "cpu"],
  );
  add(
    "frame",
    "Frame & Internal Support",
    "The outer frame and internal supports align the display, boards, battery and camera modules. They also form parts of the heat and radio design.",
    "Brackets, fasteners, adhesives and locating features hold assemblies in position. Antenna breaks isolate conductive regions; seals help protect openings under specified conditions.",
    "Structural rigidity, material choice and sealing affect durability and weight. A water-resistance rating applies to controlled test conditions and can change with wear or damage.",
    [
      [
        "Outer frame",
        "Forms the structural perimeter and supports external controls and openings.",
      ],
      [
        "Internal supports and brackets",
        "Hold modules at controlled positions and manage clearances.",
      ],
      [
        "Gaskets and adhesive seals",
        "Help limit ingress around joined surfaces. The prototype does not validate seal integrity.",
      ],
      [
        "Fasteners",
        "Retain compatible assemblies; exact screw types and positions are not supplied as repair instructions.",
      ],
    ],
    ["back", "antenna", "cooling"],
  );
  add(
    "back",
    "Back Cover",
    "The rear enclosure protects internal modules and provides camera openings. Its material also affects feel, wireless interactions and construction.",
    "The cover joins the frame through a designed attachment and sealing system. Camera surrounds protect the exposed optical openings while maintaining alignment and clearance.",
    "A glass back supports a premium finish but can still break. Wireless charging also needs the internal coil, shielding and power electronics; a glass cover does not provide charging by itself.",
    [
      [
        "Rear panel",
        "Protects the internal assembly and provides the exterior finish.",
      ],
      [
        "Camera surrounds",
        "Trim and openings surround the camera modules without replacing their lenses.",
      ],
      [
        "Perimeter adhesive",
        "Bonds the cover to the frame and contributes to sealing. Opening the device changes the original assembly condition.",
      ],
    ],
    ["frame", "rearcam", "wireless"],
  );
  add(
    "wireless",
    "Wireless Charging & NFC",
    "The wireless-charging receiver transfers energy without electrical contact at the charging surface. NFC is a separate short-range communication function that may share an assembly area.",
    "A compatible pad creates an alternating magnetic field. The receiver coil couples to that field, and electronics rectify and regulate the resulting power. NFC uses its own communication circuitry and operating conditions.",
    "Alignment, distance, cases and temperature affect charging. Wireless charging can generate additional heat and is not proof of magnetic accessory support.",
    [
      [
        "Receiver coil",
        "A wound conductor couples to the charging pad’s magnetic field.",
      ],
      [
        "Rectifier and controller",
        "Converts induced energy into controlled electrical power for the charging path.",
      ],
      [
        "Shield and carrier",
        "Support the coil and manage unwanted field interaction with nearby conductive parts.",
      ],
      [
        "NFC antenna and controller",
        "Enable supported close-range communication, such as compatible tags or payments. Availability depends on region, software and service support.",
      ],
    ],
    ["battery", "charge", "back"],
  );
  add(
    "pen",
    "S Pen & Digitizer",
    "The built-in stylus provides precision input through a pen-compatible sensing system. Writing input and Bluetooth remote features are different functions.",
    "The digitizer detects pen position and input information. Software converts that information into strokes or actions. Compatible remote functions use the pen’s communication electronics and application support.",
    "Pen accuracy also depends on the digitizer, app and surface conditions. Air Actions and remote controls are not the same feature as basic handwriting.",
    [
      [
        "Tip and input mechanism",
        "Transfers contact and pressure-related input into the pen’s sensing system.",
      ],
      [
        "Digitizer layer",
        "A sensing system associated with the display detects the compatible pen.",
      ],
      [
        "Button and communication circuit",
        "Supports compatible commands and remote actions. Behavior depends on the app and pen state.",
      ],
      [
        "Housing and retention",
        "Protects the electronics and keeps the pen positioned in its slot.",
      ],
    ],
    ["display", "buttons"],
  );
  add(
    "sim",
    "SIM Tray & Subscriber Identity",
    "The SIM carrier positions a removable SIM card against electrical contacts. An eSIM uses a different embedded provisioning path.",
    "The subscriber identity module stores credentials used during network authentication. The modem communicates with the network, while the tray simply provides mechanical alignment for a physical card.",
    "Supported physical-SIM and eSIM combinations depend on the exact regional variant and carrier. The presence of a tray alone does not establish every supported network band.",
    [
      ["SIM carrier", "The removable mechanical holder for compatible cards."],
      [
        "Electrical contacts",
        "Connect the physical card to the phone’s subscriber-identity interface.",
      ],
      [
        "eSIM provisioning",
        "Software and embedded hardware support downloadable carrier profiles where enabled. It is not a second removable tray.",
      ],
    ],
    ["antenna", "board"],
  );
  add(
    "microphone",
    "Microphones",
    "Microphones convert sound pressure into electrical information for calls, recording and voice input. Multiple microphones can support different capture paths.",
    "A small sensing diaphragm responds to pressure changes. The signal is amplified or digitized and processed by the audio system. Apps and system software may combine microphones for noise reduction.",
    "Recording quality depends on placement, wind, obstruction, acoustic design and processing. Noise reduction cannot isolate every sound in every environment.",
    [
      [
        "Microphone element",
        "The sensing element converts pressure changes into a usable signal.",
      ],
      [
        "Acoustic inlet and mesh",
        "Guide sound toward the element and help protect the opening.",
      ],
      [
        "Audio signal path",
        "Carries captured information into processing, recording or communication software.",
      ],
    ],
    ["speaker", "cpu"],
  );
  add(
    "buttons",
    "Side Controls",
    "Physical side controls trigger power, volume and configured actions through switches and connected electronics.",
    "Pressing the external button actuates a switch. A flex or circuit path carries that event to the system, and software determines the resulting action.",
    "The same button can perform different actions depending on a short press, long press, application or settings. The mechanical control and the software shortcut are different layers.",
    [
      ["External key cap", "The surface pressed by the user."],
      [
        "Switch and flex",
        "Convert movement into an electrical input and connect it to the board.",
      ],
      [
        "Software mapping",
        "Assigns actions such as volume, lock or configured shortcuts. This is software behavior.",
      ],
    ],
    ["frame", "flex"],
  );
  add(
    "flex",
    "Flex Cables & Connectors",
    "Flexible printed circuits join assemblies where rigid boards would be impractical. Their shape follows the device’s mechanical layout.",
    "Thin conductive traces in flexible insulating material carry power, control or data. Different connectors support different line counts and signal requirements.",
    "A cable’s appearance does not identify every signal it carries. Connections, shielding and routing can affect reliability and high-speed signal quality.",
    [
      [
        "Flexible conductor stack",
        "Conductive traces within a flexible substrate connect separated assemblies.",
      ],
      [
        "Board connector",
        "Provides the mating electrical and mechanical interface.",
      ],
      [
        "Shielding and strain relief",
        "Reduce interference and stress where needed; exact construction varies by cable.",
      ],
    ],
    ["board", "display", "charge"],
  );

  const groups = [
    [
      "Overview",
      "The selected S23 Ultra reference configuration, with launch information kept separate from installed software.",
      [
        ["Device", "Samsung Galaxy S23 Ultra"],
        ["Reference configuration", "12 GB RAM / 512 GB storage"],
        ["Launch period", "February 2023 · availability varied by market"],
        ["Launch software", "Android 13 / One UI 5.1"],
        ["Dimensions", "163.4 × 78.1 × 8.9 mm"],
        ["Weight", "Approximately 233–234 g · regional specification varies"],
        [
          "Profile scope",
          "Curated reference model; uploading an image does not identify arbitrary hardware",
        ],
      ],
      ["overall", "cam", "batt", "disp", "proc"],
    ],
    [
      "Processor & Graphics",
      "CPU, graphics and specialist accelerators cooperate; their capabilities do not establish a measured app frame rate.",
      [
        ["Chipset", "Snapdragon 8 Gen 2 for Galaxy"],
        ["CPU", "Octa-core · up to 3.36 GHz"],
        ["Graphics engine", "Qualcomm Adreno"],
        ["Manufacturing process", "4 nm platform"],
        ["Image processing", "Qualcomm Spectra ISP"],
        ["AI processing", "Qualcomm Hexagon accelerator"],
        ["Measured benchmark", "Not available in this prototype"],
      ],
      ["proc", "gfx"],
    ],
    [
      "Memory & Storage",
      "RAM is temporary working space; internal storage retains applications and files.",
      [
        ["Selected RAM", "12 GB"],
        ["Selected storage", "512 GB"],
        ["Other storage options", "256 GB / 1 TB · availability varies"],
        ["Expandable storage", "No microSD support"],
        [
          "Available space",
          "Varies with operating system, applications and files",
        ],
        ["Memory / flash part numbers", "Not verified in this reference"],
        [
          "Virtual memory",
          "Uses storage; not equivalent to additional physical RAM",
        ],
      ],
      ["mem", "stor"],
    ],
    [
      "Display",
      "Image quality, motion and touch responsiveness describe different parts of the display experience.",
      [
        ["Panel", "Dynamic AMOLED 2X"],
        ["Diagonal", "6.8 inches"],
        ["Resolution", "3088 × 1440"],
        ["Adaptive refresh", "Up to 120 Hz"],
        ["Peak brightness", "Up to 1,750 nits · specified conditions"],
        ["Protection", "Gorilla Glass Victus 2"],
        ["Pen support", "Built-in S Pen support"],
        ["Touch sampling rate", "Not available in this catalogue"],
      ],
      ["disp"],
    ],
    [
      "Rear Cameras",
      "Different optical modules provide different fields of view; digital zoom is not additional optical magnification.",
      [
        ["Main wide", "200 MP"],
        ["Ultrawide", "12 MP"],
        ["3× telephoto", "10 MP"],
        ["10× telephoto", "10 MP"],
        ["Autofocus", "Supported; laser autofocus assist"],
        ["Stabilization", "Optical stabilization on supported rear modules"],
        [
          "High-resolution recording",
          "Up to 8K at 30 fps · mode restrictions apply",
        ],
        ["Digital zoom", "Up to 100× Space Zoom · processed result"],
      ],
      ["cam", "photo", "low", "vid", "stab"],
    ],
    [
      "Front Camera",
      "Selfie and call quality also depend on exposure, software processing and network compression.",
      [
        ["Resolution", "12 MP"],
        ["Autofocus", "Supported"],
        ["Aperture", "f/2.2"],
        ["Video", "Up to 4K at 60 fps · app/mode dependent"],
        [
          "Use cases",
          "Selfies, video calls and compatible face-recognition features",
        ],
        [
          "Secure depth camera",
          "Not established by the front-camera specification",
        ],
      ],
      ["fcam"],
    ],
    [
      "Battery & Charging",
      "Maximum charging capability is not a constant rate; runtime depends on use and battery condition.",
      [
        ["Typical capacity", "5,000 mAh"],
        [
          "Wired charging",
          "Up to 45 W · compatible charger and cable required",
        ],
        ["Wireless charging", "Supported with compatible equipment"],
        ["Wireless PowerShare", "Supported for compatible devices"],
        ["User-removable battery", "No"],
        ["Measured app runtime", "Not available"],
        ["Battery condition", "Not read from the uploaded image"],
        [
          "Charge behavior",
          "Power can decrease with temperature and charge level",
        ],
      ],
      ["batt", "chg"],
    ],
    [
      "Thermal & Cooling",
      "The passive thermal system redistributes heat; software manages performance within operating limits.",
      [
        ["Cooling architecture", "Vapor-chamber thermal system"],
        ["Heat path", "Chip → interface materials → spreader → enclosure"],
        ["Active fan", "No active fan in this reference"],
        [
          "Thermal throttling",
          "Can reduce sustained performance under thermal limits",
        ],
        [
          "Measured temperatures",
          "Not available; Performance page uses simulation",
        ],
        [
          "Material dimensions",
          "Not verified in the supplied component diagrams",
        ],
      ],
      [],
    ],
    [
      "Network & SIM",
      "Bands, SIM combinations and carrier features must be checked for the exact regional model.",
      [
        ["Cellular generations", "2G / 3G / 4G LTE / 5G · regional bands vary"],
        ["Physical SIM", "Nano-SIM · variant dependent"],
        ["eSIM", "Region and carrier dependent"],
        ["Dual-SIM behavior", "Check exact variant and carrier"],
        ["Regional bands", "Consult the manufacturer source for your model"],
        ["PTA status / network lock", "Not checked by this prototype"],
      ],
      [],
    ],
    [
      "Connectivity",
      "Connector shape, data speed and wireless standard are separate capabilities.",
      [
        ["USB connector", "USB Type-C"],
        ["USB data interface", "USB 3.2 Gen 1"],
        ["Wi-Fi", "802.11 a/b/g/n/ac/ax · 2.4 / 5 / 6 GHz"],
        ["Bluetooth", "5.3"],
        ["NFC", "Supported · service availability varies"],
        ["Ultra-wideband", "Supported"],
        ["Positioning", "GPS, GLONASS, BeiDou, Galileo, QZSS"],
        [
          "Display / desktop use",
          "Samsung DeX supported · compatible setup required",
        ],
      ],
      [],
    ],
    [
      "Audio & Microphones",
      "Speakers produce sound; microphones capture it. Software and acoustic paths affect both.",
      [
        ["Playback", "Stereo speakers"],
        ["Audio connection", "USB-C / supported wireless audio"],
        ["3.5 mm headphone socket", "Not present"],
        [
          "Microphones",
          "Multiple capture paths; exact internal part assignment is schematic",
        ],
        [
          "Calls / recordings",
          "Depend on app, acoustic environment and network",
        ],
        ["Measured loudness / frequency response", "Not available"],
      ],
      [],
    ],
    [
      "Sensors & Biometrics",
      "Physical sensors and authentication software work together; readings are not extracted from the uploaded image.",
      [
        ["Fingerprint", "Under-display ultrasonic reader"],
        ["Motion", "Accelerometer and gyroscope"],
        ["Direction", "Geomagnetic sensor"],
        ["Environment", "Barometer and ambient-light sensor"],
        ["Proximity / magnetic state", "Proximity and Hall sensors"],
        [
          "Face recognition",
          "Supported feature; distinct from ultrasonic fingerprint sensing",
        ],
        ["Live sensor readings", "Not connected in this browser prototype"],
      ],
      [],
    ],
    [
      "Build & Durability",
      "Materials and controlled-test resistance ratings do not guarantee protection after wear or damage.",
      [
        ["Front / rear glass", "Gorilla Glass Victus 2"],
        ["Frame", "Armor Aluminum"],
        ["Dust / water rating", "IP68 under stated laboratory conditions"],
        [
          "Water-test conditions",
          "Up to 1.5 m of fresh water for up to 30 minutes",
        ],
        ["Resistance over time", "Can change with wear, damage or opening"],
        [
          "Repair geometry",
          "Exploded model is illustrative, not a service manual",
        ],
      ],
      ["build"],
    ],
    [
      "S Pen & Controls",
      "Precision writing, physical controls and remote actions use different hardware and software paths.",
      [
        ["Stylus", "Built-in S Pen and storage slot"],
        ["Writing input", "Compatible display digitizer"],
        ["Remote actions", "Supported Air Actions / compatible apps"],
        ["Physical keys", "Side key and volume controls"],
        ["Haptics", "Vibration feedback actuator"],
        ["Internal pen construction", "Schematic in the reference model"],
      ],
      [],
    ],
    [
      "Software & Security",
      "Launch software and the original support promise do not identify the software installed on a specific handset.",
      [
        ["Software at launch", "Android 13 / One UI 5.1"],
        ["Original OS upgrade commitment", "Four generations of OS upgrades"],
        ["Original security commitment", "Five years of security updates"],
        ["Security platform", "Samsung Knox / Knox Vault"],
        ["Desktop feature", "Samsung DeX"],
        [
          "Installed OS / patch level",
          "Not read from the image; check the actual device",
        ],
        ["Current update availability", "Depends on model, market and carrier"],
      ],
      [],
    ],
    [
      "Ratings",
      "These scores are illustrative profile values. They are not measured tests, purchase rankings or live benchmark results.",
      [],
      [
        "overall",
        "proc",
        "gfx",
        "cam",
        "batt",
        "disp",
        "mem",
        "stor",
        "chg",
        "build",
        "photo",
        "low",
        "vid",
        "stab",
        "fcam",
      ],
    ],
    [
      "Price & Sources",
      "Source links describe their own regional variants; this page keeps the selected reference configuration explicit.",
      [
        [
          "Current verified PKR price",
          "Not available for the S23 Ultra in this catalogue",
        ],
        ["Memory/storage used here", "12 GB / 512 GB sample configuration"],
        [
          "Regional variation",
          "Weight, SIM, bands and availability can differ",
        ],
        ["Data checked", "24 October 2026"],
        [
          "What the upload does",
          "Starts the curated S23 Ultra reference experience",
        ],
      ],
      [],
    ],
  ];
  const sources = [
    [
      "Samsung specifications",
      "https://www.samsung.com/africa_en/smartphones/galaxy-s/galaxy-s23-ultra-green-256gb-sm-s918bzgcafc/",
    ],
    [
      "Samsung launch / support reference",
      "https://image-us.samsung.com/SamsungUS/samsungbusiness/mobile/phones/galaxy-s/galaxy-s23-ultra/hhp-s23ultra-spec-vzw_apr23.pdf",
    ],
    [
      "Qualcomm platform",
      "https://www.qualcomm.com/smartphones/products/8-series/snapdragon-8-gen-2-mobile-platform",
    ],
    [
      "Samsung durability reference",
      "https://www.samsung.com/hk_en/news/product/samsung-galaxy-s23-series-integrated-with-innovative-galaxy-technology/",
    ],
  ];
  window.PeekHomeKnowledge = { parts, groups, sources };
})();
