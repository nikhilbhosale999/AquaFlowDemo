import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clownfish, BlueTang } from './Fish';

gsap.registerPlugin(ScrollTrigger);

// Global target progress for all scroll-linked components
const globalTargetProgress = { current: 0 };

// Path defining where the fish travels based on scroll progress (0 to 1)
const curvePoints = [
  new THREE.Vector3(8, 2, -5),     // Offscreen right, high (Start)
  new THREE.Vector3(2, 0, 0),      // Hero section center-right
  new THREE.Vector3(-3, -2, -3),   // About section (behind card)
  new THREE.Vector3(1, -4, -1),    // Services
  new THREE.Vector3(0, -2, -6),    // Process (deep)
  new THREE.Vector3(-4, 0, -2),    // Showcase
  new THREE.Vector3(0, 1, -10),    // Final CTA (far)
];

const curve = new THREE.CatmullRomCurve3(curvePoints);

// Path for the Second Fish (Starts center left)
const secondFishCurvePoints = [
  new THREE.Vector3(-4, 2, -15),   // Start far away, top left
  new THREE.Vector3(-2, 0, -8),    // Coming closer
  new THREE.Vector3(3, -2, -4),    // Middle right
  new THREE.Vector3(0, -3, 0),     // Closer center
  new THREE.Vector3(-3, -1, 3),    // Close left
  new THREE.Vector3(1, 1, 5),      // Very close right
  new THREE.Vector3(-1, 0, 8),     // Passing camera
];

const secondFishCurve = new THREE.CatmullRomCurve3(secondFishCurvePoints);

const Particles = () => {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return pos;
  }, [count]);

  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a0c0ff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const Bubbles = () => {
  const count = 50;
  const bubblesRef = useRef();

  const initialPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 10 - 2,
        speed: Math.random() * 0.02 + 0.01,
        offset: Math.random() * Math.PI * 2
      });
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!bubblesRef.current) return;
    const time = state.clock.elapsedTime;

    bubblesRef.current.children.forEach((bubble, i) => {
      const data = initialPositions[i];
      // Move up
      bubble.position.y += data.speed;
      // Wiggle x
      bubble.position.x = data.x + Math.sin(time * 2 + data.offset) * 0.1;

      // Reset if too high
      if (bubble.position.y > 10) {
        bubble.position.y = -10;
      }
    });
  });

  return (
    <group ref={bubblesRef}>
      {initialPositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[Math.random() * 0.05 + 0.02, 16, 16]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            roughness={0}
            transmission={0.9}
            thickness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

const AnimatedFishAndCamera = () => {
  const { camera, scene } = useThree();
  const fishRef = useRef();

  // Smooth scroll state
  const smoothedProgress = useRef(0);
  const targetProgress = useRef(0);

  // Mouse position
  const mouse = useRef({ x: 0, y: 0 });

  // Handle reduced motion
  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  React.useEffect(() => {
    // GSAP ScrollTrigger setup
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        globalTargetProgress.current = self.progress;
      }
    });

    const handleMouseMove = (e) => {
      if (prefersReducedMotion) return;
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      st.kill();
    };
  }, [prefersReducedMotion]);

  useFrame((state, delta) => {
    // 1. Ultra Smooth progress lerp
    if (!prefersReducedMotion) {
      smoothedProgress.current += (globalTargetProgress.current - smoothedProgress.current) * 0.03;
    } else {
      smoothedProgress.current = 0.1; // static position for reduced motion
    }

    // Protect bounds
    const p = Math.max(0.001, Math.min(0.999, smoothedProgress.current));

    // 2. Update Fish Position and Rotation along curve
    if (fishRef.current && !prefersReducedMotion) {
      const point = curve.getPointAt(p);
      
      // Lerp position for extra smoothness
      fishRef.current.position.lerp(point, 0.05);

      // Look slightly ahead on the curve to make the head lead the turn naturally
      const lookAheadP = Math.min(1, p + 0.02);
      const lookTarget = curve.getPointAt(lookAheadP);

      // Only update rotation if the target is far enough to avoid lookAt math errors
      if (lookTarget.distanceTo(fishRef.current.position) > 0.001) {
        // Use lookAt for smooth, mathematically correct rotation without gimbal lock
        const lookMatrix = new THREE.Matrix4().lookAt(fishRef.current.position, lookTarget, new THREE.Vector3(0, 1, 0));
        const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);

        // Procedural fish natively faces +X. lookAt aligns -Z to target. 
        // Rotate by +90 degrees around Y axis to align +X to target.
        const correction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        targetQuat.multiply(correction);

        // Very slow slerp so the head turns first and the body follows elegantly
        fishRef.current.quaternion.slerp(targetQuat, 0.05);
      }
    }

    // 3. Camera Parallax
    if (!prefersReducedMotion) {
      const targetCamX = mouse.current.x * 0.5;
      const targetCamY = mouse.current.y * 0.3;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={fishRef}>
      <Clownfish scale={0.7} />
    </group>
  );
};

const AnimatedSecondFish = () => {
  const fish2Ref = useRef();
  const smoothedProgress = useRef(0);

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame((state, delta) => {
    // Ultra smooth progress tracking
    if (!prefersReducedMotion) {
      smoothedProgress.current += (globalTargetProgress.current - smoothedProgress.current) * 0.03;
    } else {
      smoothedProgress.current = 0.1;
    }

    const p = Math.max(0.001, Math.min(0.999, smoothedProgress.current));

    if (fish2Ref.current && !prefersReducedMotion) {
      const point = secondFishCurve.getPointAt(p);
      
      // Lerp position for extra smoothness
      fish2Ref.current.position.lerp(point, 0.05);

      // Look slightly ahead on the curve to make the head lead the turn naturally
      const lookAheadP = Math.min(1, p + 0.03);
      const lookTarget = secondFishCurve.getPointAt(lookAheadP);

      // Only update rotation if the target is far enough
      if (lookTarget.distanceTo(fish2Ref.current.position) > 0.001) {
        // Use lookAt for smooth rotation
        const lookMatrix = new THREE.Matrix4().lookAt(fish2Ref.current.position, lookTarget, new THREE.Vector3(0, 1, 0));
        const targetQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);

        // Procedural fish natively faces +X. Rotate by +90 degrees around Y axis to align +X to target.
        const correction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        targetQuat.multiply(correction);

        // Very slow slerp so the head turns first and the body follows elegantly
        fish2Ref.current.quaternion.slerp(targetQuat, 0.05);
      }
    }
  });

  return (
    <group ref={fish2Ref}>
      <BlueTang scale={0.7} />
    </group>
  );
};

// Dynamically updates the fog color to match the CSS gradient depth as we scroll down
const EnvironmentUpdater = () => {
  const { scene } = useThree();
  const topColor = useMemo(() => new THREE.Color('#118ab2'), []);
  const bottomColor = useMemo(() => new THREE.Color('#001f42'), []);
  const smoothedProgress = useRef(0);

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame(() => {
    if (!prefersReducedMotion) {
      smoothedProgress.current += (globalTargetProgress.current - smoothedProgress.current) * 0.05;
    } else {
      smoothedProgress.current = 0.5;
    }
    const p = Math.max(0, Math.min(1, smoothedProgress.current));
    scene.fog.color.lerpColors(topColor, bottomColor, p);
  });
  
  return null;
};

// Looping background fish that swim far away from right to left
const BackgroundFish = ({ startOffset = 0, depth = -20, speed = 0.5, scale = 0.4, yOffset = 0 }) => {
  const ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + startOffset;
    if (!ref.current) return;
    
    // Swims continuously from x=30 to x=-30
    const xPos = 30 - ((t * 4) % 60); 
    
    ref.current.position.set(
      xPos,
      yOffset + Math.sin(t * 1.5) * 1.5,
      depth + Math.cos(t * 1.2) * 2
    );
    
    // Math.PI makes the fish face left (-X). Adding slight wiggle to rotation.
    ref.current.rotation.y = Math.PI + Math.cos(t * 1.5) * 0.15;
    ref.current.rotation.z = Math.sin(t * 1.5) * 0.05;
  });

  return (
    <group ref={ref}>
      <BlueTang scale={scale} />
    </group>
  );
};

const BackgroundSchool = () => {
  return (
    <group>
      {/* Several BlueTang fishes swimming in the distant background */}
      <BackgroundFish startOffset={0} depth={-15} speed={0.8} scale={0.35} yOffset={2} />
      <BackgroundFish startOffset={15} depth={-25} speed={0.6} scale={0.25} yOffset={-1} />
      <BackgroundFish startOffset={35} depth={-20} speed={0.9} scale={0.4} yOffset={5} />
      <BackgroundFish startOffset={50} depth={-30} speed={0.5} scale={0.2} yOffset={-4} />
      <BackgroundFish startOffset={80} depth={-18} speed={0.7} scale={0.3} yOffset={0} />
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 1.5]} // Cap pixel ratio for performance
      gl={{ alpha: true, antialias: true }}
    >
      <fogExp2 attach="fog" args={['#118ab2', 0.05]} />
      <EnvironmentUpdater />

      {/* Underwater Lighting Setup - Top Surface Sunlight */}
      <ambientLight intensity={0.9} color="#2cb5e8" />
      <directionalLight position={[0, 20, 5]} intensity={2.5} color="#ffffff" castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#118ab2" />
      <spotLight position={[0, 15, 5]} intensity={3} color="#c4f4ff" penumbra={1} angle={0.6} />

      <AnimatedFishAndCamera />
      <AnimatedSecondFish />
      <BackgroundSchool />

      <Particles />
      <Bubbles />

      <Environment preset="night" />
    </Canvas>
  );
};

export default Scene;
