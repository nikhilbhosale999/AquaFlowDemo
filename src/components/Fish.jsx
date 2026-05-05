import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Shared Material Factory ---
const createMaterial = (color, roughness = 0.3) => new THREE.MeshPhysicalMaterial({
  color,
  roughness,
  metalness: 0.1,
  clearcoat: 0.8,
  clearcoatRoughness: 0.2,
});

// ==========================================
// CLOWNFISH (Nemo style)
// ==========================================
export const Clownfish = ({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const group = useRef();
  const tailRef = useRef();
  const leftFinRef = useRef();
  const rightFinRef = useRef();

  const orangeMat = useMemo(() => createMaterial('#ff5e00'), []);
  const whiteMat = useMemo(() => createMaterial('#ffffff', 0.1), []);
  const blackMat = useMemo(() => createMaterial('#111111'), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 3) * 0.05; // Slightly faster wiggle
      group.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 10) * 0.3;
    if (leftFinRef.current && rightFinRef.current) {
      leftFinRef.current.rotation.z = Math.sin(t * 8) * 0.3;
      rightFinRef.current.rotation.z = -Math.sin(t * 8) * 0.3;
    }
  });

  return (
    <group ref={group} scale={scale} position={position} rotation={rotation}>
      {/* Head */}
      <mesh material={orangeMat} position={[0.6, 0, 0]} scale={[0.5, 0.45, 0.3]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* Stripe 1 */}
      <mesh material={whiteMat} position={[0.2, 0, 0]} scale={[0.2, 0.47, 0.32]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* Stripe 1 Black Borders */}
      <mesh material={blackMat} position={[0.38, 0, 0]} scale={[0.02, 0.48, 0.33]}><sphereGeometry args={[1, 32, 32]} /></mesh>
      <mesh material={blackMat} position={[0.02, 0, 0]} scale={[0.02, 0.48, 0.33]}><sphereGeometry args={[1, 32, 32]} /></mesh>

      {/* Mid Body */}
      <mesh material={orangeMat} position={[-0.2, 0, 0]} scale={[0.4, 0.42, 0.28]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* Stripe 2 */}
      <mesh material={whiteMat} position={[-0.6, 0, 0]} scale={[0.15, 0.35, 0.22]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* Stripe 2 Black Borders */}
      <mesh material={blackMat} position={[-0.47, 0, 0]} scale={[0.02, 0.36, 0.23]}><sphereGeometry args={[1, 32, 32]} /></mesh>
      <mesh material={blackMat} position={[-0.73, 0, 0]} scale={[0.02, 0.36, 0.23]}><sphereGeometry args={[1, 32, 32]} /></mesh>

      {/* Tail Base */}
      <mesh material={orangeMat} position={[-0.9, 0, 0]} scale={[0.3, 0.2, 0.12]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      {/* Stripe 3 */}
      <mesh material={whiteMat} position={[-1.15, 0, 0]} scale={[0.08, 0.15, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.9, 0.12, 0.2]} material={blackMat}><sphereGeometry args={[0.06, 16, 16]} /></mesh>
      <mesh position={[0.9, 0.12, -0.2]} material={blackMat}><sphereGeometry args={[0.06, 16, 16]} /></mesh>
      {/* Eye Whites */}
      <mesh position={[0.92, 0.14, 0.21]} material={whiteMat}><sphereGeometry args={[0.02, 8, 8]} /></mesh>
      <mesh position={[0.92, 0.14, -0.21]} material={whiteMat}><sphereGeometry args={[0.02, 8, 8]} /></mesh>

      {/* Top Fin */}
      <mesh material={orangeMat} position={[-0.2, 0.45, 0]} rotation={[0, 0, -0.2]} scale={[0.5, 0.25, 0.04]}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>
      <mesh material={blackMat} position={[-0.2, 0.68, 0]} rotation={[0, 0, -0.2]} scale={[0.52, 0.04, 0.05]}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>

      {/* Tail Fin */}
      <group position={[-1.2, 0, 0]} ref={tailRef}>
        <mesh material={orangeMat} position={[-0.25, 0, 0]} scale={[0.3, 0.4, 0.04]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        {/* Tail Black Edge */}
        <mesh material={blackMat} position={[-0.55, 0, 0]} scale={[0.04, 0.42, 0.05]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>

      {/* Pectoral Fins (Orange with black tips) */}
      <group position={[0.3, -0.1, 0.32]}>
        <mesh ref={leftFinRef} position={[-0.1, 0, 0]} material={orangeMat} rotation={[0, 0.4, 0]} scale={[0.2, 0.1, 0.02]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>
      <group position={[0.3, -0.1, -0.32]}>
        <mesh ref={rightFinRef} position={[-0.1, 0, 0]} material={orangeMat} rotation={[0, -0.4, 0]} scale={[0.2, 0.1, 0.02]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// BLUE TANG (Dory style)
// ==========================================
export const BlueTang = ({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const group = useRef();
  const tailRef = useRef();
  const leftFinRef = useRef();
  const rightFinRef = useRef();

  const blueMat = useMemo(() => createMaterial('#0026ff'), []);
  const yellowMat = useMemo(() => createMaterial('#ffea00'), []);
  const blackMat = useMemo(() => createMaterial('#111111'), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      group.current.position.y = position[1] + Math.sin(t * 1.2) * 0.05;
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 7) * 0.3;
    if (leftFinRef.current && rightFinRef.current) {
      leftFinRef.current.rotation.z = Math.sin(t * 5) * 0.3;
      rightFinRef.current.rotation.z = -Math.sin(t * 5) * 0.3;
    }
  });

  return (
    <group ref={group} scale={scale} position={position} rotation={rotation}>
      {/* Main Blue Body (Tall and flat) */}
      <mesh material={blueMat} scale={[1.2, 0.8, 0.15]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>

      {/* Black Swish Marking */}
      <mesh material={blackMat} position={[-0.2, 0.3, 0]} scale={[0.8, 0.4, 0.16]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      <mesh material={blueMat} position={[-0.1, 0.2, 0]} scale={[0.8, 0.4, 0.17]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>

      {/* Yellow Tail Base */}
      <mesh material={yellowMat} position={[-1.1, 0, 0]} scale={[0.2, 0.2, 0.08]}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>

      {/* Tail Fin */}
      <group position={[-1.2, 0, 0]} ref={tailRef}>
        <mesh material={yellowMat} position={[-0.3, 0, 0]} scale={[0.4, 0.4, 0.04]}>
          <cylinderGeometry args={[0.5, 0.2, 1, 16]} rotation={[Math.PI/2, 0, Math.PI/2]} />
        </mesh>
        <mesh material={blackMat} position={[-0.3, 0.4, 0]} scale={[0.4, 0.03, 0.05]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <mesh material={blackMat} position={[-0.3, -0.4, 0]} scale={[0.4, 0.03, 0.05]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>

      {/* Eyes */}
      <mesh position={[0.8, 0.1, 0.14]} material={blackMat}><sphereGeometry args={[0.06, 16, 16]} /></mesh>
      <mesh position={[0.8, 0.1, -0.14]} material={blackMat}><sphereGeometry args={[0.06, 16, 16]} /></mesh>

      {/* Yellow Pectoral Fins */}
      <group position={[0.3, -0.2, 0.16]}>
        <mesh ref={leftFinRef} position={[-0.2, 0, 0.1]} material={yellowMat} rotation={[0, 0.5, 0]} scale={[0.3, 0.15, 0.02]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>
      <group position={[0.3, -0.2, -0.16]}>
        <mesh ref={rightFinRef} position={[-0.2, 0, -0.1]} material={yellowMat} rotation={[0, -0.5, 0]} scale={[0.3, 0.15, 0.02]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
};
