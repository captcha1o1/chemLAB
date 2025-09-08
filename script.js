// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f2027);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
const viewerElement = document.getElementById('viewer');
renderer.setSize(viewerElement.clientWidth, viewerElement.clientHeight);
viewerElement.appendChild(renderer.domElement);

// Remove loading message
document.querySelector('.loading').style.display = 'none';

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Atom colors and sizes
const atomColors = {
    H: 0xFFFFFF,  // White
    C: 0x404040,  // Dark gray
    N: 0x3050F8,  // Blue
    O: 0xFF0D0D,  // Red
    S: 0xFFFF30,  // Yellow
    P: 0xFF8000,  // Orange
    F: 0x90E050,  // Light green
    Cl: 0x1FF01F, // Green
    Br: 0xA62929, // Dark red
    I: 0x940094   // Purple
};

const atomSizes = {
    H: 0.25,
    C: 0.35,
    N: 0.32,
    O: 0.30,
    S: 0.40,
    P: 0.38,
    F: 0.28,
    Cl: 0.37,
    Br: 0.39,
    I: 0.42
};

// Molecule data with detailed analysis
const molecules = {
    water: {
        name: "Water",
        formula: "H₂O",
        description: "Water is a polar molecule essential for life on Earth. It has a bent molecular geometry with a bond angle of 104.5°.",
        atoms: [
            { element: 'O', position: [0, 0, 0] },
            { element: 'H', position: [0.757, 0.587, 0] },
            { element: 'H', position: [-0.757, 0.587, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Two single bonds (O-H)<br>
            • <strong>Bond angles:</strong> 104.5°<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> O (δ-), H (δ+)<br>
            • <strong>Lone pairs on central atom:</strong> 2<br>
            • <strong>Bond pairs on central atom:</strong> 2<br>
            • <strong>Dipole moment:</strong> 1.85 D (polar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Bent/Angular<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    hydrogen: {
        name: "Hydrogen",
        formula: "H₂",
        description: "The simplest molecule consisting of two hydrogen atoms bonded together.",
        atoms: [
            { element: 'H', position: [-0.5, 0, 0] },
            { element: 'H', position: [0.5, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One single bond (H-H)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> None (nonpolar)<br>
            • <strong>Lone pairs:</strong> 0<br>
            • <strong>Bond pairs:</strong> 1<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> None (s orbitals)<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Linear
        `
    },
    oxygen: {
        name: "Oxygen",
        formula: "O₂",
        description: "Molecular oxygen essential for respiration, with a double bond between two oxygen atoms.",
        atoms: [
            { element: 'O', position: [-0.6, 0, 0] },
            { element: 'O', position: [0.6, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 2 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One double bond (O=O)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> None (nonpolar)<br>
            • <strong>Lone pairs per atom:</strong> 2<br>
            • <strong>Bond pairs:</strong> 2<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp²<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Linear
        `
    },
    nitrogen: {
        name: "Nitrogen",
        formula: "N₂",
        description: "Molecular nitrogen with a triple bond, making up 78% of Earth's atmosphere.",
        atoms: [
            { element: 'N', position: [-0.55, 0, 0] },
            { element: 'N', position: [0.55, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 3 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One triple bond (N≡N)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> None (nonpolar)<br>
            • <strong>Lone pairs per atom:</strong> 1<br>
            • <strong>Bond pairs:</strong> 3<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Linear
        `
    },
    carbon_monoxide: {
        name: "Carbon Monoxide",
        formula: "CO",
        description: "A toxic gas with a triple bond between carbon and oxygen atoms.",
        atoms: [
            { element: 'C', position: [-0.57, 0, 0] },
            { element: 'O', position: [0.57, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 3 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One triple bond (C≡O)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> C (δ+), O (δ-)<br>
            • <strong>Lone pairs on carbon:</strong> 0<br>
            • <strong>Lone pairs on oxygen:</strong> 1<br>
            • <strong>Bond pairs:</strong> 3<br>
            • <strong>Dipole moment:</strong> 0.11 D (slightly polar)<br>
            • <strong>Hybridization:</strong> sp<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Linear
        `
    },
    ozone: {
        name: "Ozone",
        formula: "O₃",
        description: "A triatomic molecule with a bent structure, important for atmospheric protection.",
        atoms: [
            { element: 'O', position: [0, 0, 0] },
            { element: 'O', position: [1.28, 0, 0] },
            { element: 'O', position: [-0.64, 1.11, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 2 },
            { atoms: [0, 2], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One double bond (O=O), one single bond (O-O)<br>
            • <strong>Bond angles:</strong> 116.8°<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> Terminal O (δ-), central O (δ+)<br>
            • <strong>Lone pairs on central atom:</strong> 1<br>
            • <strong>Lone pairs on terminal atoms:</strong> 2, 3<br>
            • <strong>Bond pairs:</strong> 3<br>
            • <strong>Dipole moment:</strong> 0.53 D (polar)<br>
            • <strong>Hybridization:</strong> sp²<br>
            • <strong>Molecular geometry:</strong> Bent<br>
            • <strong>Electron domain geometry:</strong> Trigonal planar
        `
    },
    ethanol: {
        name: "Ethanol",
        formula: "C₂H₅OH",
        description: "Ethanol is the alcohol found in alcoholic beverages. It has a hydroxyl group (-OH) attached to an ethyl group.",
        atoms: [
            { element: 'C', position: [0, 0, 0] },
            { element: 'C', position: [1.5, 0, 0] },
            { element: 'O', position: [2.2, 1.0, 0] },
            { element: 'H', position: [-0.5, 0.9, 0] },
            { element: 'H', position: [-0.5, -0.9, 0] },
            { element: 'H', position: [0, 0, 1.0] },
            { element: 'H', position: [2.0, -0.9, 0] },
            { element: 'H', position: [1.5, 0, 1.0] },
            { element: 'H', position: [3.2, 1.0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [1, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 },
            { atoms: [0, 5], type: 1 },
            { atoms: [1, 6], type: 1 },
            { atoms: [1, 7], type: 1 },
            { atoms: [2, 8], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Seven single bonds (C-C, C-H, O-H)<br>
            • <strong>Bond angles:</strong> 109.5° (tetrahedral)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> C (δ-), H (δ+), O (δ-)<br>
            • <strong>Lone pairs on oxygen:</strong> 2<br>
            • <strong>Bond pairs:</strong> 8<br>
            • <strong>Dipole moment:</strong> 1.69 D (polar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Tetrahedral<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    methane: {
        name: "Methane",
        formula: "CH₄",
        description: "The simplest hydrocarbon with a tetrahedral geometry. It's the main component of natural gas.",
        atoms: [
            { element: 'C', position: [0, 0, 0] },
            { element: 'H', position: [0.629, 0.629, 0.629] },
            { element: 'H', position: [-0.629, -0.629, 0.629] },
            { element: 'H', position: [-0.629, 0.629, -0.629] },
            { element: 'H', position: [0.629, -0.629, -0.629] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Four single bonds (C-H)<br>
            • <strong>Bond angles:</strong> 109.5° (tetrahedral)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> C (δ-), H (δ+)<br>
            • <strong>Lone pairs on central atom:</strong> 0<br>
            • <strong>Bond pairs on central atom:</strong> 4<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Tetrahedral<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    ethylene: {
        name: "Ethylene",
        formula: "C₂H₄",
        description: "An unsaturated hydrocarbon with a double bond between two carbon atoms.",
        atoms: [
            { element: 'C', position: [-0.664, 0, 0] },
            { element: 'C', position: [0.664, 0, 0] },
            { element: 'H', position: [-1.24, 0.928, 0] },
            { element: 'H', position: [-1.24, -0.928, 0] },
            { element: 'H', position: [1.24, 0.928, 0] },
            { element: 'H', position: [1.24, -0.928, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 2 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [1, 4], type: 1 },
            { atoms: [1, 5], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One double bond (C=C), four single bonds (C-H)<br>
            • <strong>Bond angles:</strong> 120° around each carbon<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> None (nonpolar)<br>
            • <strong>Lone pairs:</strong> 0<br>
            • <strong>Bond pairs:</strong> 5<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp²<br>
            • <strong>Molecular geometry:</strong> Planar<br>
            • <strong>Electron domain geometry:</strong> Trigonal planar
        `
    },
    acetylene: {
        name: "Acetylene",
        formula: "C₂H₂",
        description: "A hydrocarbon with a triple bond between two carbon atoms.",
        atoms: [
            { element: 'C', position: [-0.6, 0, 0] },
            { element: 'C', position: [0.6, 0, 0] },
            { element: 'H', position: [-1.66, 0, 0] },
            { element: 'H', position: [1.66, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 3 },
            { atoms: [0, 2], type: 1 },
            { atoms: [1, 3], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> One triple bond (C≡C), two single bonds (C-H)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> None (nonpolar)<br>
            • <strong>Lone pairs:</strong> 0<br>
            • <strong>Bond pairs:</strong> 4<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Linear
        `
    },
    ammonia: {
        name: "Ammonia",
        formula: "NH₃",
        description: "Ammonia has a trigonal pyramidal geometry. It's an important precursor to fertilizers and explosives.",
        atoms: [
            { element: 'N', position: [0, 0, 0] },
            { element: 'H', position: [0.94, 0, 0.38] },
            { element: 'H', position: [-0.47, 0.815, 0.38] },
            { element: 'H', position: [-0.47, -0.815, 0.38] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Three single bonds (N-H)<br>
            • <strong>Bond angles:</strong> 107°<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> N (δ-), H (δ+)<br>
            • <strong>Lone pairs on central atom:</strong> 1<br>
            • <strong>Bond pairs on central atom:</strong> 3<br>
            • <strong>Dipole moment:</strong> 1.47 D (polar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Trigonal pyramidal<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    phosphine: {
        name: "Phosphine",
        formula: "PH₃",
        description: "A colorless, flammable gas with a pyramidal structure similar to ammonia.",
        atoms: [
            { element: 'P', position: [0, 0, 0] },
            { element: 'H', position: [1.42, 0, 0] },
            { element: 'H', position: [-0.71, 1.22, 0] },
            { element: 'H', position: [-0.71, -1.22, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Three single bonds (P-H)<br>
            • <strong>Bond angles:</strong> 93.5°<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> P (δ+), H (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 1<br>
            • <strong>Bond pairs on central atom:</strong> 3<br>
            • <strong>Dipole moment:</strong> 0.58 D (polar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Trigonal pyramidal<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    glucose: {
        name: "Glucose",
        formula: "C₆H₁₂O₆",
        description: "Glucose is a simple sugar and important energy source in living organisms with a six-membered ring structure.",
        atoms: [
            { element: 'C', position: [0, 0, 0] },
            { element: 'C', position: [1.5, 0, 0] },
            { element: 'C', position: [2.25, 1.299, 0] },
            { element: 'C', position: [1.5, 2.598, 0] },
            { element: 'C', position: [0, 2.598, 0] },
            { element: 'C', position: [-0.75, 1.299, 0] },
            { element: 'O', position: [-0.75, -1.299, 0] },
            { element: 'O', position: [3.0, 1.299, 0] },
            { element: 'O', position: [1.5, 3.897, 0] },
            { element: 'O', position: [-0.75, 3.897, 0] },
            { element: 'O', position: [-1.5, 1.299, 0] },
            { element: 'O', position: [0, -1.299, 0] },
            { element: 'H', position: [0, -1.0, 0] },
            { element: 'H', position: [1.5, -1.0, 0] },
            { element: 'H', position: [2.25, 2.299, 0] },
            { element: 'H', position: [1.5, 1.598, 0] },
            { element: 'H', position: [0, 3.598, 0] },
            { element: 'H', position: [-0.75, 0.299, 0] },
            { element: 'H', position: [3.5, 1.299, 0] },
            { element: 'H', position: [1.5, 4.897, 0] },
            { element: 'H', position: [-0.75, 4.897, 0] },
            { element: 'H', position: [-2.0, 1.299, 0] },
            { element: 'H', position: [0, -2.299, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [1, 2], type: 1 },
            { atoms: [2, 3], type: 1 },
            { atoms: [3, 4], type: 1 },
            { atoms: [4, 5], type: 1 },
            { atoms: [5, 0], type: 1 },
            { atoms: [0, 6], type: 1 },
            { atoms: [2, 7], type: 1 },
            { atoms: [3, 8], type: 1 },
            { atoms: [4, 9], type: 1 },
            { atoms: [5, 10], type: 1 },
            { atoms: [0, 11], type: 1 },
            { atoms: [0, 12], type: 1 },
            { atoms: [1, 13], type: 1 },
            { atoms: [2, 14], type: 1 },
            { atoms: [3, 15], type: 1 },
            { atoms: [4, 16], type: 1 },
            { atoms: [5, 17], type: 1 },
            { atoms: [7, 18], type: 1 },
            { atoms: [8, 19], type: 1 },
            { atoms: [9, 20], type: 1 },
            { atoms: [10, 21], type: 1 },
            { atoms: [11, 22], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> 23 single bonds (C-C, C-O, C-H, O-H)<br>
            • <strong>Bond angles:</strong> 109.5° (tetrahedral)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> C (δ-), H (δ+), O (δ-)<br>
            • <strong>Lone pairs on oxygen atoms:</strong> 6<br>
            • <strong>Bond pairs:</strong> 23<br>
            • <strong>Dipole moment:</strong> 3.0 D (polar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Chair conformation<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    acetone: {
        name: "Acetone",
        formula: "C₃H₆O",
        description: "Acetone is the simplest ketone with a carbonyl group. It's a common solvent and the main component of nail polish remover.",
        atoms: [
            { element: 'C', position: [0, 0, 0] },
            { element: 'C', position: [-1.5, 0, 0] },
            { element: 'C', position: [1.5, 0, 0] },
            { element: 'O', position: [0, 1.2, 0] },
            { element: 'H', position: [-1.5, -1.0, 0] },
            { element: 'H', position: [-1.5, 0, 1.0] },
            { element: 'H', position: [-1.5, 0, -1.0] },
            { element: 'H', position: [1.5, -1.0, 0] },
            { element: 'H', position: [1.5, 0, 1.0] },
            { element: 'H', position: [1.5, 0, -1.0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 2 },
            { atoms: [1, 4], type: 1 },
            { atoms: [1, 5], type: 1 },
            { atoms: [1, 6], type: 1 },
            { atoms: [2, 7], type: 1 },
            { atoms: [2, 8], type: 1 },
            { atoms: [2, 9], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Seven single bonds (C-C, C-H), one double bond (C=O)<br>
            • <strong>Bond angles:</strong> 120° around carbonyl carbon<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> C (δ+), O (δ-), methyl C (δ-), H (δ+)<br>
            • <strong>Lone pairs on oxygen:</strong> 2<br>
            • <strong>Bond pairs:</strong> 9<br>
            • <strong>Dipole moment:</strong> 2.88 D (polar)<br>
            • <strong>Hybridization:</strong> sp² (carbonyl C), sp³ (methyl C)<br>
            • <strong>Molecular geometry:</strong> Trigonal planar (around carbonyl)<br>
            • <strong>Electron domain geometry:</strong> Trigonal planar
        `
    },
    formaldehyde: {
        name: "Formaldehyde",
        formula: "CH₂O",
        description: "Formaldehyde is the simplest aldehyde with a carbonyl group. It's used as a disinfectant and preservative.",
        atoms: [
            { element: 'C', position: [0, 0, 0] },
            { element: 'O', position: [0, 1.2, 0] },
            { element: 'H', position: [0.9, -0.6, 0] },
            { element: 'H', position: [-0.9, -0.6, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 2 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Two single bonds (C-H), one double bond (C=O)<br>
            • <strong>Bond angles:</strong> 120°<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> C (δ+), O (δ-), H (δ+)<br>
            • <strong>Lone pairs on oxygen:</strong> 2<br>
            • <strong>Bond pairs:</strong> 4<br>
            • <strong>Dipole moment:</strong> 2.33 D (polar)<br>
            • <strong>Hybridization:</strong> sp²<br>
            • <strong>Molecular geometry:</strong> Trigonal planar<br>
            • <strong>Electron domain geometry:</strong> Trigonal planar
        `
    },
    "hydrogen-peroxide": {
        name: "Hydrogen Peroxide",
        formula: "H₂O₂",
        description: "Hydrogen peroxide is a reactive oxygen species with an open book structure and weak O-O bond.",
        atoms: [
            { element: 'O', position: [-0.5, 0, 0] },
            { element: 'O', position: [0.5, 0, 0] },
            { element: 'H', position: [-1.1, 0.8, 0] },
            { element: 'H', position: [1.1, 0.8, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [1, 3], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Three single bonds (O-O, O-H)<br>
            • <strong>Bond angles:</strong> 94.8° (O-O-H), 180° (H-O-O-H)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> O (δ-), H (δ+)<br>
            • <strong>Lone pairs on oxygen atoms:</strong> 4<br>
            • <strong>Bond pairs:</strong> 3<br>
            • <strong>Dipole moment:</strong> 2.26 D (polar)<br>
            • <strong>Hybridization:</strong> sp³<br>
            • <strong>Molecular geometry:</strong> Skew conformation<br>
            • <strong>Electron domain geometry:</strong> Tetrahedral
        `
    },
    phosphorus_pentachloride: {
        name: "Phosphorus Pentachloride",
        formula: "PCl₅",
        description: "A yellow crystalline solid that exists as a trigonal bipyramidal molecule.",
        atoms: [
            { element: 'P', position: [0, 0, 0] },
            { element: 'Cl', position: [2.14, 0, 0] },
            { element: 'Cl', position: [-2.14, 0, 0] },
            { element: 'Cl', position: [0, 2.14, 0] },
            { element: 'Cl', position: [0, -2.14, 0] },
            { element: 'Cl', position: [0, 0, 2.14] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 },
            { atoms: [0, 5], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Five single bonds (P-Cl)<br>
            • <strong>Bond angles:</strong> 90° (equatorial), 120° (axial-equatorial)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> P (δ+), Cl (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 0<br>
            • <strong>Bond pairs on central atom:</strong> 5<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp³d<br>
            • <strong>Molecular geometry:</strong> Trigonal bipyramidal<br>
            • <strong>Electron domain geometry:</strong> Trigonal bipyramidal
        `
    },
    phosphorus_pentafluoride: {
        name: "Phosphorus Pentafluoride",
        formula: "PF₅",
        description: "A colorless gas with trigonal bipyramidal geometry.",
        atoms: [
            { element: 'P', position: [0, 0, 0] },
            { element: 'F', position: [1.58, 0, 0] },
            { element: 'F', position: [-1.58, 0, 0] },
            { element: 'F', position: [0, 1.58, 0] },
            { element: 'F', position: [0, -1.58, 0] },
            { element: 'F', position: [0, 0, 1.58] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 },
            { atoms: [0, 5], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Five single bonds (P-F)<br>
            • <strong>Bond angles:</strong> 90° (equatorial), 120° (axial-equatorial)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> P (δ+), F (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 0<br>
            • <strong>Bond pairs on central atom:</strong> 5<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp³d<br>
            • <strong>Molecular geometry:</strong> Trigonal bipyramidal<br>
            • <strong>Electron domain geometry:</strong> Trigonal bipyramidal
        `
    },
    sulfur_hexafluoride: {
        name: "Sulfur Hexafluoride",
        formula: "SF₆",
        description: "A colorless, odorless gas with octahedral geometry.",
        atoms: [
            { element: 'S', position: [0, 0, 0] },
            { element: 'F', position: [1.56, 0, 0] },
            { element: 'F', position: [-1.56, 0, 0] },
            { element: 'F', position: [0, 1.56, 0] },
            { element: 'F', position: [0, -1.56, 0] },
            { element: 'F', position: [0, 0, 1.56] },
            { element: 'F', position: [0, 0, -1.56] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 },
            { atoms: [0, 5], type: 1 },
            { atoms: [0, 6], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Six single bonds (S-F)<br>
            • <strong>Bond angles:</strong> 90°<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> S (δ+), F (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 0<br>
            • <strong>Bond pairs on central atom:</strong> 6<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp³d²<br>
            • <strong>Molecular geometry:</strong> Octahedral<br>
            • <strong>Electron domain geometry:</strong> Octahedral
        `
    },
    chlorine_trifluoride: {
        name: "Chlorine Trifluoride",
        formula: "ClF₃",
        description: "A greenish-yellow gas with T-shaped geometry.",
        atoms: [
            { element: 'Cl', position: [0, 0, 0] },
            { element: 'F', position: [1.7, 0, 0] },
            { element: 'F', position: [-0.85, 1.47, 0] },
            { element: 'F', position: [0, 0, 1.7] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Three single bonds (Cl-F)<br>
            • <strong>Bond angles:</strong> 87.5° (equatorial), 175° (axial)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> Cl (δ+), F (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 2<br>
            • <strong>Bond pairs on central atom:</strong> 3<br>
            • <strong>Dipole moment:</strong> 0.55 D (polar)<br>
            • <strong>Hybridization:</strong> sp³d<br>
            • <strong>Molecular geometry:</strong> T-shaped<br>
            • <strong>Electron domain geometry:</strong> Trigonal bipyramidal
        `
    },
    bromine_pentafluoride: {
        name: "Bromine Pentafluoride",
        formula: "BrF₅",
        description: "A colorless liquid with square pyramidal geometry.",
        atoms: [
            { element: 'Br', position: [0, 0, 0] },
            { element: 'F', position: [1.77, 0, 0] },
            { element: 'F', position: [-1.77, 0, 0] },
            { element: 'F', position: [0, 1.77, 0] },
            { element: 'F', position: [0, -1.77, 0] },
            { element: 'F', position: [0, 0, 1.77] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 },
            { atoms: [0, 5], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Five single bonds (Br-F)<br>
            • <strong>Bond angles:</strong> 84.8° (basal), 89.9° (basal-axial)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> Br (δ+), F (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 1<br>
            • <strong>Bond pairs on central atom:</strong> 5<br>
            • <strong>Dipole moment:</strong> 1.51 D (polar)<br>
            • <strong>Hybridization:</strong> sp³d²<br>
            • <strong>Molecular geometry:</strong> Square pyramidal<br>
            • <strong>Electron domain geometry:</strong> Octahedral
        `
    },
    xenon_difluoride: {
        name: "Xenon Difluoride",
        formula: "XeF₂",
        description: "A white crystalline solid with linear geometry.",
        atoms: [
            { element: 'Xe', position: [0, 0, 0] },
            { element: 'F', position: [2.0, 0, 0] },
            { element: 'F', position: [-2.0, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Two single bonds (Xe-F)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> Xe (δ+), F (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 3<br>
            • <strong>Bond pairs on central atom:</strong> 2<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp³d<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Trigonal bipyramidal
        `
    },
    xenon_oxytetrafluoride: {
        name: "Xenon Oxytetrafluoride",
        formula: "XeOF₄",
        description: "A colorless liquid with square pyramidal geometry.",
        atoms: [
            { element: 'Xe', position: [0, 0, 0] },
            { element: 'O', position: [0, 0, 1.8] },
            { element: 'F', position: [1.8, 0, 0] },
            { element: 'F', position: [-1.8, 0, 0] },
            { element: 'F', position: [0, 1.8, 0] },
            { element: 'F', position: [0, -1.8, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 },
            { atoms: [0, 3], type: 1 },
            { atoms: [0, 4], type: 1 },
            { atoms: [0, 5], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Five single bonds (Xe-F), one single bond (Xe-O)<br>
            • <strong>Bond angles:</strong> 90° (basal), 89.9° (basal-axial)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> Xe (δ+), F (δ-), O (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 1<br>
            • <strong>Bond pairs on central atom:</strong> 5<br>
            • <strong>Dipole moment:</strong> 1.51 D (polar)<br>
            • <strong>Hybridization:</strong> sp³d²<br>
            • <strong>Molecular geometry:</strong> Square pyramidal<br>
            • <strong>Electron domain geometry:</strong> Octahedral
        `
    },
    krypton_difluoride: {
        name: "Krypton Difluoride",
        formula: "KrF₂",
        description: "A white crystalline solid with linear geometry.",
        atoms: [
            { element: 'Kr', position: [0, 0, 0] },
            { element: 'F', position: [2.0, 0, 0] },
            { element: 'F', position: [-2.0, 0, 0] }
        ],
        bonds: [
            { atoms: [0, 1], type: 1 },
            { atoms: [0, 2], type: 1 }
        ],
        analysis: `
            <strong>Detailed Analysis:</strong><br>
            • <strong>Bond types:</strong> Two single bonds (Kr-F)<br>
            • <strong>Bond angles:</strong> 180° (linear)<br>
            • <strong>Molecular charge:</strong> 0 (neutral)<br>
            • <strong>Partial charges:</strong> Kr (δ+), F (δ-)<br>
            • <strong>Lone pairs on central atom:</strong> 3<br>
            • <strong>Bond pairs on central atom:</strong> 2<br>
            • <strong>Dipole moment:</strong> 0 D (nonpolar)<br>
            • <strong>Hybridization:</strong> sp³d<br>
            • <strong>Molecular geometry:</strong> Linear<br>
            • <strong>Electron domain geometry:</strong> Trigonal bipyramidal
        `
    }
};

let currentMolecule = null;
let rotationEnabled = true;
let labelsVisible = false;
let labelGroup = new THREE.Group();
scene.add(labelGroup);

// Create atom
function createAtom(element, position) {
    const geometry = new THREE.SphereGeometry(atomSizes[element], 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: atomColors[element],
        shininess: 100
    });
    const atom = new THREE.Mesh(geometry, material);
    atom.position.set(...position);
    return atom;
}

// Create bond
function createBond(start, end, type) {
    const direction = new THREE.Vector3().subVectors(
        new THREE.Vector3(...end),
        new THREE.Vector3(...start)
    );
    const length = direction.length();
    const center = new THREE.Vector3().addVectors(
        new THREE.Vector3(...start),
        new THREE.Vector3(...end)
    ).multiplyScalar(0.5);

    // Make double bonds thicker and more visible
    const thickness = type === 2 ? 0.08 : (type === 3 ? 0.10 : 0.05);
    const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 8);
    const material = new THREE.MeshPhongMaterial({
        color: type === 2 ? 0x444444 : (type === 3 ? 0x222222 : 0x666666)
    });
    const bond = new THREE.Mesh(geometry, material);

    bond.position.copy(center);
    bond.lookAt(new THREE.Vector3(...end));
    bond.rotateX(Math.PI / 2);

    return bond;
}

// Create molecule
function createMolecule(moleculeData) {
    if (currentMolecule) {
        scene.remove(currentMolecule);
    }

    const molecule = new THREE.Group();

    // Add atoms
    moleculeData.atoms.forEach((atomData, index) => {
        const atom = createAtom(atomData.element, atomData.position);
        atom.userData = { element: atomData.element, index: index };
        molecule.add(atom);
    });

    // Add bonds
    moleculeData.bonds.forEach(bondData => {
        const start = moleculeData.atoms[bondData.atoms[0]].position;
        const end = moleculeData.atoms[bondData.atoms[1]].position;
        const bond = createBond(start, end, bondData.type);
        molecule.add(bond);
    });

    currentMolecule = molecule;
    scene.add(molecule);

    // Update info panel
    document.getElementById('molecule-name').textContent = moleculeData.name;
    document.getElementById('molecule-formula').textContent = moleculeData.formula;
    document.getElementById('molecule-description').textContent = moleculeData.description;
}

// Load initial molecule
createMolecule(molecules.water);

// Button event listeners
document.querySelectorAll('.molecule-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.molecule-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const moleculeName = this.getAttribute('data-molecule');
        const moleculeData = molecules[moleculeName];
        createMolecule(moleculeData);

        // Show detailed analysis for preset molecules
        if (moleculeData.analysis) {
            document.getElementById('ai-details').innerHTML = moleculeData.analysis;
            document.getElementById('ai-analysis').style.display = 'block';
        }
    });
});

// Toggle molecule list visibility
function toggleMoleculeList() {
    const moleculeList = document.getElementById('molecule-list');
    const minimizeBtn = document.getElementById('minimize-btn');

    if (moleculeList.style.display === 'none') {
        moleculeList.style.display = 'block';
        minimizeBtn.textContent = '− Minimize';
        showNotification('Molecule list expanded', 'info');
    } else {
        moleculeList.style.display = 'none';
        minimizeBtn.textContent = '+ Expand';
        showNotification('Molecule list minimized', 'info');
    }
}

// Custom molecule creation
document.getElementById('create-custom').addEventListener('click', function() {
    const name = document.getElementById('custom-name').value || 'Custom Molecule';
    const formula = document.getElementById('custom-formula').value || '';
    const description = document.getElementById('custom-description').value || '';
    const structureText = document.getElementById('custom-structure').value;

    const moleculeData = parseMoleculeStructure(structureText);
    if (moleculeData) {
        moleculeData.name = name;
        moleculeData.formula = formula;
        moleculeData.description = description;
        document.querySelectorAll('.molecule-btn').forEach(b => b.classList.remove('active'));
        createMolecule(moleculeData);
    } else {
        alert('Invalid molecule structure. Please check the format.');
    }
});

// AI molecule generation
document.getElementById('generate-ai').addEventListener('click', async function() {
    const description = document.getElementById('ai-description').value.trim();

    if (!description) {
        alert('Please describe the molecule you want to create.');
        return;
    }

    // Show loading state
    const button = this;
    const originalText = button.textContent;
    button.textContent = 'Generating...';
    button.disabled = true;

    try {
        const result = await generateMoleculeWithAI(description);
        if (result) {
            document.getElementById('custom-structure').value = result.structure;
            document.getElementById('custom-name').value = result.name;
            document.getElementById('custom-formula').value = result.formula;
            document.getElementById('custom-description').value = result.description;

            // Show AI analysis
            document.getElementById('ai-details').innerHTML = result.analysis;
            document.getElementById('ai-analysis').style.display = 'block';

            alert('Molecule structure and analysis generated! You can now create the 3D molecule using the "Create Custom Molecule" button.');
        } else {
            alert('Failed to generate molecule structure. Please try again.');
        }
    } catch (error) {
        console.error('AI generation error:', error);
        alert('Error generating molecule: ' + error.message);
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
});

// Generate molecule structure using OpenRouter AI
async function generateMoleculeWithAI(description) {
    // Hardcoded API key - replace with your actual OpenRouter API key
    const apiKey = "sk-or-v1-code";

    const prompt = `You are a chemistry expert. Generate a complete molecular analysis for: "${description}"

Please provide a comprehensive analysis including:

1. MOLECULE NAME: [Name]
2. CHEMICAL FORMULA: [Formula]
3. DESCRIPTION: [Brief description of the molecule]
4. ATOMIC STRUCTURE:
Atoms:
[Element] [X] [Y] [Z]
[Element] [X] [Y] [Z]
...

Bonds:
[index1]-[index2] [type]
[index1]-[index2] [type]
...

5. DETAILED ANALYSIS:
- Bond types present (single, double, triple bonds)
- Bond angles (in degrees)
- Molecular charge (if any)
- Partial charges on atoms
- Lone pairs on central atom
- Bond pairs on central atom
- Dipole moment (if polar)
- Hybridization (sp, sp2, sp3, etc.)
- Molecular geometry (linear, trigonal planar, tetrahedral, trigonal pyramidal, bent/ angular, trigonal bipyramidal, octahedral, square planar, etc.)

Rules for structure generation:
- Use standard element symbols (H, C, N, O, S, P, F, Cl, Br, I)
- Positions should be in Angstroms (Å), realistic for molecular structures
- Bond types: single, double, triple (or 1, 2, 3)
- Indices start from 0
- Make sure the structure is chemically reasonable
- For complex molecules, use appropriate 3D coordinates

Example for water:
MOLECULE NAME: Water
CHEMICAL FORMULA: H₂O
DESCRIPTION: Water is a polar molecule essential for life on Earth with bent molecular geometry.

ATOMIC STRUCTURE:
Atoms:
O 0 0 0
H 0.757 0.587 0
H -0.757 0.587 0

Bonds:
0-1 single
0-2 single

DETAILED ANALYSIS:
- Bond types: Two single bonds (O-H)
- Bond angles: 104.5°
- Molecular charge: 0 (neutral)
- Partial charges: O (δ-), H (δ+)
- Lone pairs on central atom: 2
- Bond pairs on central atom: 2
- Dipole moment: 1.85 D (polar)
- Hybridization: sp³
- Molecular geometry: Bent/Angular

Generate the complete analysis now:`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "3D Molecule Visualizer",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "moonshotai/kimi-k2:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content.trim();
            return parseAIResponse(content);
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw error;
    }
}

// Parse AI response to extract structured data
function parseAIResponse(content) {
    const lines = content.split('\n');
    let name = '';
    let formula = '';
    let description = '';
    let structure = '';
    let analysis = '';
    let inStructure = false;
    let inAnalysis = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('MOLECULE NAME:')) {
            name = trimmed.replace('MOLECULE NAME:', '').trim();
        } else if (trimmed.startsWith('CHEMICAL FORMULA:')) {
            formula = trimmed.replace('CHEMICAL FORMULA:', '').trim();
        } else if (trimmed.startsWith('DESCRIPTION:')) {
            description = trimmed.replace('DESCRIPTION:', '').trim();
        } else if (trimmed.startsWith('ATOMIC STRUCTURE:')) {
            inStructure = true;
            inAnalysis = false;
            structure += trimmed + '\n';
        } else if (trimmed.startsWith('DETAILED ANALYSIS:')) {
            inStructure = false;
            inAnalysis = true;
            analysis += '<strong>Detailed Analysis:</strong><br>';
        } else if (inStructure) {
            structure += trimmed + '\n';
        } else if (inAnalysis) {
            if (trimmed.startsWith('-')) {
                analysis += '• ' + trimmed.substring(1).trim() + '<br>';
            } else if (trimmed) {
                analysis += trimmed + '<br>';
            }
        }
    }

    // Extract just the Atoms and Bonds sections from structure
    const structureLines = structure.split('\n');
    let atomsSection = '';
    let bondsSection = '';
    let inAtoms = false;
    let inBonds = false;

    for (const line of structureLines) {
        if (line.toLowerCase().includes('atoms:')) {
            inAtoms = true;
            inBonds = false;
            atomsSection += 'Atoms:\n';
        } else if (line.toLowerCase().includes('bonds:')) {
            inAtoms = false;
            inBonds = true;
            atomsSection += '\nBonds:\n';
        } else if (inAtoms && line.trim()) {
            atomsSection += line + '\n';
        } else if (inBonds && line.trim()) {
            atomsSection += line + '\n';
        }
    }

    return {
        name: name || 'Generated Molecule',
        formula: formula || '',
        description: description || 'AI-generated molecule description',
        structure: atomsSection.trim(),
        analysis: analysis || 'Analysis not available'
    };
}

// Parse molecule structure text
function parseMoleculeStructure(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const atoms = [];
    const bonds = [];
    let parsingAtoms = false;
    let parsingBonds = false;

    for (const line of lines) {
        if (line.toLowerCase().startsWith('atoms:')) {
            parsingAtoms = true;
            parsingBonds = false;
            continue;
        } else if (line.toLowerCase().startsWith('bonds:')) {
            parsingAtoms = false;
            parsingBonds = true;
            continue;
        }

        if (parsingAtoms) {
             const parts = line.split(/\s+/);
             if (parts.length >= 4) {
                const element = parts[0];
                // Normalize different types of dashes to regular minus signs
                const x = parseFloat(parts[1].replace(/[–—−]/g, '-'));
                const y = parseFloat(parts[2].replace(/[–—−]/g, '-'));
                const z = parseFloat(parts[3].replace(/[–—−]/g, '-'));
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                    atoms.push({ element, position: [x, y, z] });
                }
            }
        } else if (parsingBonds) {
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                // Handle different dash characters (regular dash, en dash, em dash)
                const bondParts = parts[0].split(/[-–—]/);
                if (bondParts.length === 2) {
                    const atom1 = parseInt(bondParts[0]);
                    const atom2 = parseInt(bondParts[1]);
                    let type = 1;
                    if (parts[1]) {
                        const typeStr = parts[1].toLowerCase();
                        if (typeStr === 'single' || typeStr === '1') type = 1;
                        else if (typeStr === 'double' || typeStr === '2') type = 2;
                        else if (typeStr === 'triple' || typeStr === '3') type = 3;
                        else if (!isNaN(parseFloat(typeStr))) type = parseFloat(typeStr);
                    }
                    if (!isNaN(atom1) && !isNaN(atom2)) {
                        bonds.push({ atoms: [atom1, atom2], type });
                    }
                }
            }
        }
    }

    if (atoms.length > 0) {
        return { atoms, bonds };
    }
    return null;
}

// Control functions
function toggleRotation() {
    rotationEnabled = !rotationEnabled;
}

function resetView() {
    camera.position.set(0, 0, 5);
    controls.reset();
}

function toggleLabels() {
    labelsVisible = !labelsVisible;
    labelGroup.visible = labelsVisible;

    if (labelsVisible && currentMolecule) {
        // Clear existing labels
        while(labelGroup.children.length > 0) {
            labelGroup.remove(labelGroup.children[0]);
        }

        // Add labels for each atom
        currentMolecule.children.forEach(child => {
            if (child.userData && child.userData.element) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 64;
                canvas.height = 64;

                context.fillStyle = 'rgba(255, 255, 255, 0.8)';
                context.fillRect(0, 0, canvas.width, canvas.height);

                context.fillStyle = 'black';
                context.font = 'Bold 24px Arial';
                context.textAlign = 'center';
                context.fillText(child.userData.element, canvas.width/2, canvas.height/2 + 8);

                const texture = new THREE.CanvasTexture(canvas);
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(spriteMaterial);

                sprite.position.copy(child.position);
                sprite.position.y += atomSizes[child.userData.element] + 0.3;
                sprite.scale.set(0.5, 0.5, 0.5);

                labelGroup.add(sprite);
            }
        });
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (rotationEnabled && currentMolecule) {
        currentMolecule.rotation.y += 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = viewerElement.clientWidth / viewerElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewerElement.clientWidth, viewerElement.clientHeight);
});

// Start animation
animate();

// ===== NEW FEATURES =====

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        showNotification('Switched to Dark Mode', 'success');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.textContent = '☀️';
        showNotification('Switched to Light Mode', 'success');
    }
}

// Mobile Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Clear AI Input
function clearAI() {
    document.getElementById('ai-description').value = '';
    document.getElementById('ai-analysis').style.display = 'none';
    showNotification('AI input cleared', 'info');
}

// Clear Custom Input
function clearCustom() {
    document.getElementById('custom-name').value = '';
    document.getElementById('custom-formula').value = '';
    document.getElementById('custom-description').value = '';
    document.getElementById('custom-structure').value = `Atoms:
C 0 0 0
H 1 0 0
O 0 1 0

Bonds:
0-1 single
0-2 double`;
    showNotification('Custom input cleared', 'info');
}

// Hide AI Analysis
function hideAIAnalysis() {
    document.getElementById('ai-analysis').style.display = 'none';
    showNotification('AI analysis hidden', 'info');
}

// Export Molecule Data
function exportData() {
    if (!currentMolecule) {
        showNotification('No molecule to export', 'warning');
        return;
    }

    const moleculeData = {
        name: document.getElementById('molecule-name').textContent,
        formula: document.getElementById('molecule-formula').textContent,
        description: document.getElementById('molecule-description').textContent,
        atoms: currentMolecule.children
            .filter(child => child.userData && child.userData.element)
            .map(child => ({
                element: child.userData.element,
                position: [child.position.x, child.position.y, child.position.z]
            })),
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(moleculeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${moleculeData.name.replace(/\s+/g, '_')}_data.json`;
    link.click();

    showNotification('Molecule data exported!', 'success');
}

// Random Molecule
function randomMolecule() {
    const moleculeKeys = Object.keys(molecules);
    const randomKey = moleculeKeys[Math.floor(Math.random() * moleculeKeys.length)];

    document.querySelectorAll('.molecule-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-molecule') === randomKey) {
            btn.classList.add('active');
        }
    });

    createMolecule(molecules[randomKey]);
    updateStats();
    showNotification(`Loaded: ${molecules[randomKey].name}`, 'success');
}

// Duplicate Current Molecule
function duplicateMolecule() {
    if (!currentMolecule) {
        showNotification('No molecule to duplicate', 'warning');
        return;
    }

    const currentName = document.getElementById('molecule-name').textContent;
    document.getElementById('custom-name').value = `${currentName} (Copy)`;
    document.getElementById('custom-formula').value = document.getElementById('molecule-formula').textContent;
    document.getElementById('custom-description').value = `Copy of ${currentName}`;

    // Generate structure from current molecule
    let structureText = 'Atoms:\n';
    let bondsText = '\nBonds:\n';

    currentMolecule.children.forEach((child, index) => {
        if (child.userData && child.userData.element) {
            structureText += `${child.userData.element} ${child.position.x.toFixed(3)} ${child.position.y.toFixed(3)} ${child.position.z.toFixed(3)}\n`;
        }
    });

    // Note: Bond information is not stored in the mesh, so we can't reconstruct it
    // This is a limitation - we'd need to store bond data separately
    structureText += bondsText + '// Bond data not available for duplication';

    document.getElementById('custom-structure').value = structureText;
    showNotification('Molecule copied to custom section', 'success');
}

// Reset All
function resetAll() {
    if (confirm('Are you sure you want to reset everything?')) {
        // Reset to water molecule
        document.querySelectorAll('.molecule-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-molecule') === 'water') {
                btn.classList.add('active');
            }
        });

        createMolecule(molecules.water);
        updateStats();

        // Clear all inputs
        clearAI();
        clearCustom();

        // Hide AI analysis
        document.getElementById('ai-analysis').style.display = 'none';

        // Reset theme
        document.body.removeAttribute('data-theme');
        document.getElementById('theme-icon').textContent = '🌙';

        showNotification('Everything reset to default', 'success');
    }
}

// Fullscreen Toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showNotification('Entered fullscreen', 'success');
    } else {
        document.exitFullscreen();
        showNotification('Exited fullscreen', 'info');
    }
}

// Take Screenshot
function takeScreenshot() {
    // Create a canvas to render the scene
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match renderer
    canvas.width = renderer.domElement.width;
    canvas.height = renderer.domElement.height;

    // Draw the WebGL canvas content
    ctx.drawImage(renderer.domElement, 0, 0);

    // Add watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.fillText('🧪 CaptchaLab', 20, canvas.height - 20);

    // Download the image
    const link = document.createElement('a');
    link.download = `molecule_screenshot_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    showNotification('Screenshot saved!', 'success');
}

// Update Stats Panel
function updateStats() {
    if (!currentMolecule) return;

    const atoms = currentMolecule.children.filter(child => child.userData && child.userData.element);
    const atomCount = atoms.length;

    // Count unique elements
    const elements = new Set(atoms.map(atom => atom.userData.element));
    const elementCount = elements.size;

    // Estimate bonds (this is approximate since we don't store bond count)
    const bondCount = Math.max(0, atomCount - 1);

    document.getElementById('atom-count').textContent = atomCount;
    document.getElementById('bond-count').textContent = bondCount;
    document.getElementById('element-count').textContent = elementCount;
    document.getElementById('molecule-status').textContent = 'Loaded';
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Help Modal Functions
function showHelp() {
    document.getElementById('help-modal').classList.remove('hidden');
}

function closeHelp() {
    document.getElementById('help-modal').classList.add('hidden');
}

// Initialize stats on page load
updateStats();

// Update stats when molecule changes
const originalCreateMolecule = createMolecule;
createMolecule = function(moleculeData) {
    originalCreateMolecule(moleculeData);
    updateStats();
};

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + R for random molecule
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        randomMolecule();
    }

    // F11 or Ctrl/Cmd + F for fullscreen
    if (event.key === 'F11' || ((event.ctrlKey || event.metaKey) && event.key === 'f')) {
        event.preventDefault();
        toggleFullscreen();
    }

    // Ctrl/Cmd + E for export
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        exportData();
    }

    // Escape to close modals
    if (event.key === 'Escape') {
        closeHelp();
    }
});

// Add help button to header
const header = document.querySelector('.header');
const helpButton = document.createElement('button');
helpButton.className = 'btn btn-secondary';
helpButton.innerHTML = '❓ Help';
helpButton.onclick = showHelp;
helpButton.style.marginTop = '10px';
header.appendChild(helpButton);

// Sidebar Width Adjustment
function updateSidebarWidth(width) {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.width = width + 'px';
    document.getElementById('width-value').textContent = width + 'px';
    showNotification(`Sidebar width set to ${width}px`, 'info');
}

function resetSidebarWidth() {
    const slider = document.getElementById('sidebar-width');
    slider.value = 320;
    updateSidebarWidth(320);
    showNotification('Sidebar width reset to default', 'success');
}
