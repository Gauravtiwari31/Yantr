import React, { useState, useRef, useEffect } from 'react';
import { Calculator, MapPin, Ruler, Box } from 'lucide-react';
import * as THREE from 'three';

// Yantra Calculator Module
class YantraCalculator {
  constructor(latitude, longitude, baseSize = 10) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.baseSize = baseSize;
    this.phi = latitude * Math.PI / 180; // Convert to radians
  }

  // Samrat Yantra (Giant Sundial) - Triangular gnomon
  calculateSamratYantra() {
    const gnomonHeight = this.baseSize;
    const gnomonBase = gnomonHeight / Math.tan(this.phi);
    const hypotenuse = Math.sqrt(gnomonHeight * gnomonHeight + gnomonBase * gnomonBase);
    const dialRadius = gnomonBase * 1.5;
    
    return {
      name: "Samrat Yantra",
      type: "sundial",
      dimensions: {
        gnomonHeight,
        gnomonBase,
        hypotenuse,
        dialRadius,
        gnomonAngle: this.latitude,
        quadrantArcLength: dialRadius * Math.PI / 2
      },
      description: "Giant equinoctial sundial with gnomon aligned to Earth's axis"
    };
  }

  // Rama Yantra - Cylindrical structure
  calculateRamaYantra() {
    const cylinderRadius = this.baseSize;
    const cylinderHeight = cylinderRadius * 0.3;
    const pillarHeight = cylinderHeight * 1.5;
    
    return {
      name: "Rama Yantra",
      type: "altitude_azimuth",
      dimensions: {
        cylinderRadius,
        cylinderHeight,
        pillarHeight,
        sectorAngle: 90,
        numberOfSectors: 4
      },
      description: "Used to measure altitude and azimuth of celestial objects"
    };
  }

  // Chakra Yantra - Circular metal instrument
  calculateChakraYantra() {
    const outerRadius = this.baseSize * 0.8;
    const innerRadius = outerRadius * 0.15;
    const thickness = outerRadius * 0.05;
    
    return {
      name: "Chakra Yantra",
      type: "angular_measurement",
      dimensions: {
        outerRadius,
        innerRadius,
        thickness,
        graduations: 360,
        crossBarLength: outerRadius * 2,
        poleHeight: outerRadius * 1.5
      },
      description: "Metal ring instrument for measuring angular positions"
    };
  }

  // Jai Prakash Yantra - Hemispherical sundial
  calculateJaiPrakashYantra() {
    const hemisphereRadius = this.baseSize;
    const rimWidth = hemisphereRadius * 0.1;
    const crossWireSpacing = hemisphereRadius * 0.2;
    
    return {
      name: "Jai Prakash Yantra",
      type: "celestial_coordinates",
      dimensions: {
        hemisphereRadius,
        rimWidth,
        crossWireSpacing,
        numberOfMarbleSlabs: 2,
        depthOfHemisphere: hemisphereRadius
      },
      description: "Hemispherical sundial showing celestial coordinates"
    };
  }

  // Digamsa Yantra - Azimuth measuring instrument
  calculateDigamsaYantra() {
    const baseRadius = this.baseSize;
    const pillarHeight = baseRadius * 2;
    const circleRadius = baseRadius * 0.9;
    
    return {
      name: "Digamsa Yantra",
      type: "azimuth",
      dimensions: {
        baseRadius,
        pillarHeight,
        circleRadius,
        compassDivisions: 360,
        sightingBarLength: circleRadius * 2
      },
      description: "Used to measure azimuth angles of celestial bodies"
    };
  }

  calculateAllYantras() {
    return [
      this.calculateSamratYantra(),
      this.calculateRamaYantra(),
      this.calculateChakraYantra(),
      this.calculateJaiPrakashYantra(),
      this.calculateDigamsaYantra()
    ];
  }
}

// 2D Diagram Generator
const DiagramGenerator = ({ yantra }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !yantra) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const scale = 20;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#60a5fa';
    ctx.fillStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.font = '12px monospace';
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    if (yantra.type === 'sundial') {
      // Draw Samrat Yantra - side view
      const h = yantra.dimensions.gnomonHeight * scale;
      const b = yantra.dimensions.gnomonBase * scale;
      
      ctx.beginPath();
      ctx.moveTo(centerX - b/2, centerY + 50);
      ctx.lineTo(centerX - b/2, centerY + 50 - h);
      ctx.lineTo(centerX + b/2, centerY + 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Draw dial arc
      ctx.beginPath();
      ctx.arc(centerX - b/2, centerY + 50, yantra.dimensions.dialRadius * scale, 0, Math.PI, true);
      ctx.stroke();
      
      // Labels
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`H: ${yantra.dimensions.gnomonHeight.toFixed(2)}m`, centerX - b/2 - 60, centerY + 20);
      ctx.fillText(`B: ${yantra.dimensions.gnomonBase.toFixed(2)}m`, centerX - 30, centerY + 70);
      ctx.fillText(`Angle: ${yantra.dimensions.gnomonAngle.toFixed(1)}°`, centerX + b/2 + 10, centerY + 30);
      
    } else if (yantra.type === 'altitude_azimuth') {
      // Draw Rama Yantra - top view
      const r = yantra.dimensions.cylinderRadius * scale;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw sectors
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + r * Math.cos(angle), centerY + r * Math.sin(angle));
        ctx.stroke();
      }
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`R: ${yantra.dimensions.cylinderRadius.toFixed(2)}m`, centerX + r + 10, centerY);
      ctx.fillText(`4 Sectors`, centerX - 30, centerY - r - 10);
      
    } else if (yantra.type === 'angular_measurement') {
      // Draw Chakra Yantra
      const outer = yantra.dimensions.outerRadius * scale;
      const inner = yantra.dimensions.innerRadius * scale;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, outer, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, inner, 0, Math.PI * 2);
      ctx.stroke();
      
      // Crossbar
      ctx.beginPath();
      ctx.moveTo(centerX - outer, centerY);
      ctx.lineTo(centerX + outer, centerY);
      ctx.stroke();
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`R: ${yantra.dimensions.outerRadius.toFixed(2)}m`, centerX + outer + 10, centerY);
      
    } else if (yantra.type === 'celestial_coordinates') {
      // Draw Jai Prakash - hemisphere cross-section
      const r = yantra.dimensions.hemisphereRadius * scale;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY + 50, r, Math.PI, 0, true);
      ctx.stroke();
      
      // Rim
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY + 50, r, Math.PI, 0, true);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#60a5fa';
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`Hemisphere R: ${yantra.dimensions.hemisphereRadius.toFixed(2)}m`, centerX - 80, centerY + 80);
      
    } else if (yantra.type === 'azimuth') {
      // Draw Digamsa Yantra
      const r = yantra.dimensions.circleRadius * scale;
      const h = yantra.dimensions.pillarHeight * scale;
      
      // Base circle
      ctx.beginPath();
      ctx.arc(centerX, centerY + 50, r, 0, Math.PI * 2);
      ctx.stroke();
      
      // Central pillar
      ctx.fillRect(centerX - 5, centerY + 50 - h, 10, h);
      
      // Sighting bar
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(centerX - r, centerY + 50 - h);
      ctx.lineTo(centerX + r, centerY + 50 - h);
      ctx.stroke();
      ctx.strokeStyle = '#60a5fa';
      
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`H: ${yantra.dimensions.pillarHeight.toFixed(2)}m`, centerX + 20, centerY + 20);
    }
    
  }, [yantra]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={300}
      className="border border-blue-500 rounded bg-slate-900"
    />
  );
};

// 3D Model Renderer
const Model3D = ({ yantra }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || !yantra) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 400 / 300, 0.1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 300);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Build 3D model based on yantra type
    if (yantra.type === 'sundial') {
      // Samrat Yantra - triangular gnomon
      const h = yantra.dimensions.gnomonHeight;
      const b = yantra.dimensions.gnomonBase;
      
      const shape = new THREE.Shape();
      shape.moveTo(-b/2, 0);
      shape.lineTo(-b/2, h);
      shape.lineTo(b/2, 0);
      shape.lineTo(-b/2, 0);
      
      const extrudeSettings = { depth: 0.5, bevelEnabled: false };
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const gnomon = new THREE.Mesh(geometry, material);
      gnomon.rotation.x = -Math.PI / 2;
      scene.add(gnomon);
      
      // Dial arc
      const dialGeometry = new THREE.TorusGeometry(yantra.dimensions.dialRadius, 0.2, 16, 32, Math.PI);
      const dialMaterial = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
      const dial = new THREE.Mesh(dialGeometry, dialMaterial);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(-b/2, 0, 0);
      scene.add(dial);
      
    } else if (yantra.type === 'altitude_azimuth') {
      // Rama Yantra - cylinder with sectors
      const r = yantra.dimensions.cylinderRadius;
      const h = yantra.dimensions.cylinderHeight;
      
      const geometry = new THREE.CylinderGeometry(r, r, h, 32, 1, true);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.y = h / 2;
      scene.add(cylinder);
      
      // Central pillar
      const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, yantra.dimensions.pillarHeight);
      const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.y = yantra.dimensions.pillarHeight / 2;
      scene.add(pillar);
      
    } else if (yantra.type === 'angular_measurement') {
      // Chakra Yantra - ring
      const outer = yantra.dimensions.outerRadius;
      const inner = yantra.dimensions.innerRadius;
      
      const geometry = new THREE.TorusGeometry(outer, 0.3, 16, 64);
      const material = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      
      // Crossbar
      const barGeometry = new THREE.BoxGeometry(outer * 2, 0.2, 0.2);
      const barMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      scene.add(bar);
      
    } else if (yantra.type === 'celestial_coordinates') {
      // Jai Prakash - hemisphere
      const r = yantra.dimensions.hemisphereRadius;
      
      const geometry = new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        side: THREE.DoubleSide
      });
      const hemisphere = new THREE.Mesh(geometry, material);
      scene.add(hemisphere);
      
      // Rim
      const rimGeometry = new THREE.TorusGeometry(r, 0.2, 16, 64);
      const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.x = Math.PI / 2;
      scene.add(rim);
      
    } else if (yantra.type === 'azimuth') {
      // Digamsa Yantra
      const r = yantra.dimensions.circleRadius;
      const h = yantra.dimensions.pillarHeight;
      
      // Base circle
      const baseGeometry = new THREE.TorusGeometry(r, 0.2, 16, 64);
      const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.rotation.x = Math.PI / 2;
      scene.add(base);
      
      // Pillar
      const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, h);
      const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.y = h / 2;
      scene.add(pillar);
      
      // Sighting bar
      const barGeometry = new THREE.BoxGeometry(r * 2, 0.2, 0.2);
      const barMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.y = h;
      scene.add(bar);
    }

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [yantra]);

  return <div ref={mountRef} className="border border-blue-500 rounded" />;
};

// Main App Component
export default function YantraApp() {
  const [latitude, setLatitude] = useState(26.9124); // Jaipur default
  const [longitude, setLongitude] = useState(75.7873);
  const [baseSize, setBaseSize] = useState(10);
  const [yantras, setYantras] = useState([]);
  const [selectedYantra, setSelectedYantra] = useState(null);

  // Famous observatory locations
  const locations = [
    { name: "Jaipur (Jantar Mantar)", lat: 26.9124, lon: 75.7873 },
    { name: "Delhi (Jantar Mantar)", lat: 28.6271, lon: 77.2166 },
    { name: "Ujjain (Dongla)", lat: 23.1765, lon: 75.7885 },
    { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
    { name: "Mathura", lat: 27.4924, lon: 77.6737 }
  ];

  const calculateYantras = () => {
    const calculator = new YantraCalculator(latitude, longitude, baseSize);
    const calculated = calculator.calculateAllYantras();
    setYantras(calculated);
    setSelectedYantra(calculated[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2 flex items-center gap-2">
            <Calculator size={32} />
            Indian Astronomical Instruments Calculator
          </h1>
          <p className="text-gray-400">Generate dimensions and visualizations for Yantras based on location</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Latitude (°)</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Longitude (°)</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Base Size (m)</label>
              <input
                type="number"
                step="1"
                value={baseSize}
                onChange={(e) => setBaseSize(parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Quick Select Location:</label>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setLatitude(loc.lat);
                    setLongitude(loc.lon);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
                >
                  <MapPin size={14} className="inline mr-1" />
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateYantras}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            Calculate Dimensions
          </button>
        </div>

        {/* Results Section */}
        {yantras.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Yantra List */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Instruments</h3>
              <div className="space-y-2">
                {yantras.map((yantra, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedYantra(yantra)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedYantra?.name === yantra.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                    }`}
                  >
                    {yantra.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Details Panel */}
            {selectedYantra && (
              <div className="lg:col-span-3 space-y-6">
                {/* Info */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-blue-400 mb-2">{selectedYantra.name}</h2>
                  <p className="text-gray-400 mb-4">{selectedYantra.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedYantra.dimensions).map(([key, value]) => (
                      <div key={key} className="bg-slate-800 rounded p-3">
                        <div className="text-xs text-gray-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-lg font-mono text-blue-400">
                          {typeof value === 'number' ? value.toFixed(2) : value}
                          {typeof value === 'number' && !key.includes('ngle') && !key.includes('ivision') && !key.includes('umber') ? 'm' : ''}
                          {key.includes('ngle') ? '°' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visualizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <Ruler size={20} />
                      2D Diagram
                    </h3>
                    <DiagramGenerator yantra={selectedYantra} />
                  </div>

                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <Box size={20} />
                      3D Model
                    </h3>
                    <Model3D yantra={selectedYantra} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}