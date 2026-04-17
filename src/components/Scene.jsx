import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerformanceMonitor, PerspectiveCamera, PointerLockControls } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import BramptonFarm from './BramptonFarm';

function Scene({ activeSection }) {
  return (
    <Canvas 
      dpr={[1, 1.5]} 
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
      
      <color attach="background" args={['#0a0a0e']} />
      {/* Fog for depth fading into the background */}
      <fog attach="fog" args={['#0a0a0e', 10, 40]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#b87333" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f3ff" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ff00ff" />
      
      <Suspense fallback={null}>
        {/* Core Farm geometry */}
        <BramptonFarm activeSection={activeSection} />
      </Suspense>

      {/* Post Processing for Neon Aesthetic */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          height={300}
          intensity={1.5} 
          mipmapBlur 
        />
      </EffectComposer>

      {/* Performance monitor to handle heavy scenes */}
      <PerformanceMonitor onDecline={() => {}} />
    </Canvas>
  );
}

export default Scene;
