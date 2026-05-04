import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ProceduralFish = ({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], bodyColor = '#3e65ff', finColor = '#8a9cff', emissiveColor = '#1d2a5a' }) => {
  const group = useRef();
  const tailRef = useRef();
  const leftFinRef = useRef();
  const rightFinRef = useRef();
  const bodyRef = useRef();

  // Materials
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: bodyColor,
    emissive: emissiveColor,
    emissiveIntensity: 0.2,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 0.5,
    thickness: 0.5,
  }), [bodyColor, emissiveColor]);

  const finMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: finColor,
    transparent: true,
    opacity: 0.7,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.9,
    side: THREE.DoubleSide,
  }), [finColor]);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050a1f',
    roughness: 0.1,
    metalness: 0.8,
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Internal animation logic
    if (group.current) {
      // Gentle body rocking
      group.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      group.current.position.y = position[1] + Math.sin(t * 1.2) * 0.1;
    }

    if (tailRef.current) {
      // Tail wiggle
      tailRef.current.rotation.y = Math.sin(t * 6) * 0.3;
    }
  });

  return (
    <group ref={group} scale={scale} position={position} rotation={rotation}>
      {/* Main Body */}
      <mesh ref={bodyRef} material={bodyMaterial} castShadow receiveShadow scale={[1.5, 0.6, 0.4]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>

      {/* Eyes */}
      <mesh position={[1.1, 0.15, 0.2]} material={eyeMaterial}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      <mesh position={[1.1, 0.15, -0.2]} material={eyeMaterial}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>

      {/* Tail Fin */}
      <group position={[-1.4, 0, 0]} ref={tailRef}>
        <mesh position={[-0.4, 0, 0]} material={finMaterial} castShadow rotation={[Math.PI / 2, 0, -Math.PI / 2]} scale={[1, 1, 0.1]}>
          <coneGeometry args={[0.5, 1, 3]} />
        </mesh>
      </group>

      {/* Top Fin */}
      <mesh position={[-0.2, 0.6, 0]} material={finMaterial} rotation={[0, 0, -0.3]} scale={[1, 1, 0.1]}>
        <coneGeometry args={[0.4, 0.8, 3]} />
      </mesh>

    </group>
  );
};

export default ProceduralFish;
