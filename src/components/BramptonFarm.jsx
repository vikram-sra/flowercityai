import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Farm Plots: Hexagonal structures representing different business areas
function HexPlot({ position, color, size = 1, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[size, size, 0.5, 6]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
      {/* Neon glowing edge */}
      <mesh position={[0, 0.26, 0]}>
        <ringGeometry args={[size - 0.05, size, 6]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </mesh>
  );
}

// Instanced Crops - Sowing Efficiency (Crystals)
function InstancedCrops({ count = 100, sowingTrigger }) {
  const meshRef = useRef();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Create randomized positions
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
        // distribute them randomly in the retail plot area
        const x = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        pos.push(new THREE.Vector3(x, 0.25, z));
    }
    return pos;
  }, [count]);

  const [scales, setScales] = useState(new Array(count).fill(0.01));

  useEffect(() => {
    if (sowingTrigger) {
      // Bloom them up
      const newScales = [...scales];
      gsap.to(newScales, {
        endArray: new Array(count).fill(1),
        duration: 2,
        stagger: 0.02,
        ease: 'back.out(1.5)',
        onUpdate: () => setScales([...newScales])
      });
    } else {
       // Reset down
       const newScales = [...scales];
       gsap.to(newScales, {
         endArray: new Array(count).fill(0.01),
         duration: 1,
         ease: 'power2.in',
         onUpdate: () => setScales([...newScales])
       });
    }
  }, [sowingTrigger]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    positions.forEach((pos, i) => {
      dummy.position.copy(pos);
      // scale them
      dummy.scale.set(scales[i], scales[i], scales[i]);
      // small rotation
      dummy.rotation.y = performance.now() * 0.001 + i;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  );
}

// Data Rocks/Rows (Logistics Plot)
function LogisticsData({ plowingProgress }) {
  const meshRef = useRef();
  const count = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initial jagged positions vs organized rows
  const initialPos = useMemo(() => {
    return Array.from({ length: count }, () => new THREE.Vector3((Math.random() - 0.5) * 4, 0.25, (Math.random() - 0.5) * 4));
  }, []);

  const organizedPos = useMemo(() => {
    const pos = [];
    const rows = 5;
    const cols = 10;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos.push(new THREE.Vector3(-2 + (c * 0.4), 0.25, -1.5 + (r * 0.6)));
      }
    }
    return pos;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
       dummy.position.lerpVectors(initialPos[i], organizedPos[i], plowingProgress);
       // when organized, make them glow more and conform shape
       dummy.scale.set(
           1 - (plowingProgress * 0.5), 
           1 + (plowingProgress * 2), 
           1 - (plowingProgress * 0.5)
       );
       dummy.rotation.set(0, plowingProgress * Math.PI, 0);
       dummy.updateMatrix();
       meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} toneMapped={false} />
    </instancedMesh>
  );
}

// Silo with Harvesting Effect
function AISilo({ isHarvesting }) {
    const siloRef = useRef();
    const ringRef = useRef();

    useFrame((state) => {
        if (siloRef.current) {
            siloRef.current.rotation.y += 0.005;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.5;
            ringRef.current.rotation.y = state.clock.elapsedTime;
            
            // Pulse effect when harvesting
            ringRef.current.scale.setScalar(isHarvesting ? 1 + Math.sin(state.clock.elapsedTime * 10) * 0.2 : 1);
        }
    });

    return (
        <group position={[0, 0, -5]}>
            <mesh ref={siloRef} position={[0, 2, 0]} castShadow>
                <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
                <meshStandardMaterial color="#0a0a0e" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Pulsating core */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[1.55, 1.55, 1, 16]} />
                <meshBasicMaterial color={isHarvesting ? "#8c00ff" : "#220044"} transparent opacity={0.6} toneMapped={false} />
            </mesh>
            {/* Spinning ring */}
            <mesh ref={ringRef} position={[0, 4, 0]}>
                <torusGeometry args={[2.5, 0.05, 16, 100]} />
                <meshBasicMaterial color={isHarvesting ? "#ff00ff" : "#440044"} toneMapped={false} />
            </mesh>
            {/* Beams */}
            {isHarvesting && (
                <mesh position={[0, 6, 0]}>
                    <cylinderGeometry args={[0.5, 2, 8, 16]} />
                    <meshBasicMaterial color="#8c00ff" transparent opacity={0.2} toneMapped={false} blending={THREE.AdditiveBlending} />
                </mesh>
            )}
        </group>
    );
}


export default function BramptonFarm({ activeSection }) {
  const groupRef = useRef();
  
  const [sowingState, setSowingState] = useState(false);
  const [harvestState, setHarvestState] = useState(false);
  const [plowingProgress, setPlowingProgress] = useState(0);

  // Handle cross-component events
  useEffect(() => {
    const handleSowing = () => {
      setSowingState(true);
      setTimeout(() => setSowingState(false), 3000);
    };

    const handleHarvest = (e) => setHarvestState(e.detail);

    window.addEventListener('triggerSowing', handleSowing);
    window.addEventListener('hoverHarvest', handleHarvest);

    return () => {
      window.removeEventListener('triggerSowing', handleSowing);
      window.removeEventListener('hoverHarvest', handleHarvest);
    };
  }, []);

  // Animate the farm based on scroll section
  useEffect(() => {
    if (!groupRef.current) return;

    let targetRotY = 0;
    let targetPosX = 0;
    let targetPosZ = 0;
    let targetPlow = 0;

    switch (activeSection) {
      case 'hero':
        targetRotY = 0;
        targetPosZ = -2;
        break;
      case 'pitch':
        targetRotY = Math.PI / 4; // Reveal Logistics
        targetPosZ = 2;
        targetPosX = -3;
        targetPlow = 1; // Trigger plowing
        break;
      case 'services':
        targetRotY = -Math.PI / 3; // Reveal Retail
        targetPosZ = 0;
        targetPosX = 3;
        targetPlow = 0;
        break;
      case 'contact':
        targetRotY = Math.PI; // Reveal Silo
        targetPosZ = 5;
        targetPosX = 0;
        targetPlow = 0;
        break;
      default:
        break;
    }

    gsap.to(groupRef.current.rotation, {
      y: targetRotY,
      duration: 2,
      ease: 'power3.inOut'
    });

    gsap.to(groupRef.current.position, {
      x: targetPosX,
      z: targetPosZ,
      duration: 2,
      ease: 'power3.inOut'
    });

    gsap.to({ val: plowingProgress }, {
      val: targetPlow,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: function() {
        setPlowingProgress(this.targets()[0].val);
      }
    });

  }, [activeSection]);

  useFrame((state, delta) => {
     if(groupRef.current && activeSection === 'hero') {
        groupRef.current.rotation.y += delta * 0.05;
     }
  });

  return (
    <group ref={groupRef} position={[0, -2, -2]}>
      {/* Base Foundation */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[10, 8, 1, 32]} />
        <meshStandardMaterial color="#0d1321" roughness={0.9} />
      </mesh>
      {/* Glowing ring under foundation */}
      <mesh position={[0, -0.9, 0]}>
         <torusGeometry args={[8.5, 0.05, 16, 100]} />
         <meshBasicMaterial color="#00f3ff" toneMapped={false} transparent opacity={0.3} />
      </mesh>

      {/* Plot 1: Logistics (Plowing AI) */}
      <group position={[-4, 0, 4]} rotation={[0, Math.PI/6, 0]}>
        <HexPlot color="#4a5d23" size={3.5} />
        <LogisticsData plowingProgress={plowingProgress} />
      </group>

      {/* Plot 2: Retail (Sowing Crystals) */}
      <group position={[5, 0, 3]}>
        <HexPlot color="#b87333" size={4} />
        <InstancedCrops count={120} sowingTrigger={sowingState} />
      </group>

      {/* Plot 3: Marketing (General geometric shapes) */}
      <group position={[4, 0, -4]}>
        <HexPlot color="#662244" size={3} />
        {/* Placeholder nodes */}
        {Array.from({length: 5}).map((_, i) => (
           <mesh key={i} position={[Math.sin(i)*1.5, 1, Math.cos(i)*1.5]}>
              <boxGeometry args={[0.5, 2, 0.5]} />
              <meshStandardMaterial color="#00f3ff" wireframe />
           </mesh>
        ))}
      </group>

      {/* Plot 4: Operations Silo (Harvesting) */}
      <AISilo isHarvesting={harvestState} />

    </group>
  );
}
