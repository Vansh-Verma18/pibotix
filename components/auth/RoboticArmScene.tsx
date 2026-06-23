"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════
   UTILITY: Bolt Ring — Places small cylindrical bolts
   around a circle to simulate mounting hardware
   ═══════════════════════════════════════════════════════ */
function BoltRing({ radius, count = 8, y = 0, boltRadius = 0.012, boltHeight = 0.02 }: {
  radius: number; count?: number; y?: number; boltRadius?: number; boltHeight?: number;
}) {
  const bolts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
    });
  }, [radius, count]);

  return (
    <group position={[0, y, 0]}>
      {bolts.map((b, i) => (
        <mesh key={i} position={[b.x, 0, b.z]}>
          <cylinderGeometry args={[boltRadius, boltRadius, boltHeight, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   UTILITY: Cable Bundle — Curved tubes along the arm
   ═══════════════════════════════════════════════════════ */
function CableBundle({ points, color = "#1e293b" }: { points: THREE.Vector3[]; color?: string }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.012, 6, false), [curve]);
  return (
    <mesh geometry={tubeGeom}>
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════
   ROBOTIC ARM — High-fidelity ABB/FANUC-style
   6-axis articulated industrial manipulator
   ═══════════════════════════════════════════════════════ */
function IndustrialRoboticArm() {
  const baseRef = useRef<THREE.Group>(null!);
  const shoulderRef = useRef<THREE.Group>(null!);
  const elbowRef = useRef<THREE.Group>(null!);
  const wristPitchRef = useRef<THREE.Group>(null!);
  const wristRollRef = useRef<THREE.Group>(null!);
  const gripperRef = useRef<THREE.Group>(null!);
  const gripOpenRef = useRef(0.04);

  // Shared materials
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FF3B30", metalness: 0.4, roughness: 0.45,
  }), []);
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0f172a", metalness: 0.85, roughness: 0.25,
  }), []);
  const jointMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1e293b", metalness: 0.9, roughness: 0.2,
  }), []);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FF3B30", emissive: "#FF3B30", emissiveIntensity: 0.15,
    metalness: 0.5, roughness: 0.4,
  }), []);

  const weldActiveRef = useRef(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycle = (t % 12) / 12; // 12-second cycle

    // === PHASE-BASED ANIMATION ===
    // 0.00-0.15: Home → reach toward pickup
    // 0.15-0.25: Lower and grab
    // 0.25-0.40: Lift and swing to weld station
    // 0.40-0.60: Welding operation
    // 0.60-0.75: Swing to drop station
    // 0.75-0.85: Lower and release
    // 0.85-1.00: Return to home

    let baseRot = 0, shoulderRot = 0, elbowRot = 0, wristRot = 0, gripOpen = 0.04;
    let weldActive = false;

    if (cycle < 0.15) {
      // Home → Reach: Base swings left, arm extends forward
      const p = cycle / 0.15;
      const s = smoothstep(p);
      baseRot = s * -0.5;
      shoulderRot = s * -0.35;
      elbowRot = s * -0.6;
      wristRot = s * 0.3;
      gripOpen = 0.04; // open
    } else if (cycle < 0.25) {
      // Lower and grab
      const p = (cycle - 0.15) / 0.10;
      const s = smoothstep(p);
      baseRot = -0.5;
      shoulderRot = -0.35 + s * -0.15;
      elbowRot = -0.6 + s * -0.2;
      wristRot = 0.3 + s * 0.1;
      gripOpen = 0.04 - s * 0.035; // closing
    } else if (cycle < 0.40) {
      // Lift and swing to weld station
      const p = (cycle - 0.25) / 0.15;
      const s = smoothstep(p);
      baseRot = -0.5 + s * 1.0; // swing right
      shoulderRot = -0.5 + s * 0.25;
      elbowRot = -0.8 + s * 0.4;
      wristRot = 0.4 - s * 0.2;
      gripOpen = 0.005; // closed
    } else if (cycle < 0.60) {
      // Welding — hold position, slight vibration
      const p = (cycle - 0.40) / 0.20;
      const vibration = Math.sin(t * 40) * 0.005;
      baseRot = 0.5 + vibration;
      shoulderRot = -0.25 + vibration;
      elbowRot = -0.4;
      wristRot = 0.2;
      gripOpen = 0.005;
      weldActive = true;
    } else if (cycle < 0.75) {
      // Swing to drop station
      const p = (cycle - 0.60) / 0.15;
      const s = smoothstep(p);
      baseRot = 0.5 + s * 0.3;
      shoulderRot = -0.25 + s * -0.2;
      elbowRot = -0.4 + s * -0.3;
      wristRot = 0.2 + s * 0.15;
      gripOpen = 0.005;
    } else if (cycle < 0.85) {
      // Lower and release
      const p = (cycle - 0.75) / 0.10;
      const s = smoothstep(p);
      baseRot = 0.8;
      shoulderRot = -0.45 + s * -0.1;
      elbowRot = -0.7 + s * -0.1;
      wristRot = 0.35;
      gripOpen = 0.005 + s * 0.035; // opening
    } else {
      // Return to home
      const p = (cycle - 0.85) / 0.15;
      const s = smoothstep(p);
      baseRot = 0.8 * (1 - s);
      shoulderRot = (-0.55) * (1 - s);
      elbowRot = (-0.8) * (1 - s);
      wristRot = 0.35 * (1 - s);
      gripOpen = 0.04;
    }

    weldActiveRef.current = weldActive;

    if (baseRef.current) baseRef.current.rotation.y = baseRot;
    if (shoulderRef.current) shoulderRef.current.rotation.z = shoulderRot;
    if (elbowRef.current) elbowRef.current.rotation.z = elbowRot;
    if (wristPitchRef.current) wristPitchRef.current.rotation.z = wristRot;
    if (wristRollRef.current) wristRollRef.current.rotation.y = t * 0.3;
    gripOpenRef.current = gripOpen;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ── HEAVY BASE PLATFORM ── */}
      {/* Bottom plate */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.42, 0.45, 0.06, 32]} />
        <meshStandardMaterial {...darkMat} color="#0a0a14" />
      </mesh>
      {/* Upper base ring */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 0.04, 32]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      <BoltRing radius={0.36} count={12} y={0.1} />
      {/* Base accent stripe */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.015, 32]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* ── AXIS 1: BASE TURRET (rotates Y) ── */}
      <group ref={baseRef} position={[0, 0.12, 0]}>
        {/* Turret body */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.28, 0.36, 0.3, 32]} />
          <primitive object={bodyMat} attach="material" />
        </mesh>
        {/* Motor cover plates */}
        <mesh position={[0.28, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial {...jointMat} />
        </mesh>
        <mesh position={[-0.28, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial {...jointMat} />
        </mesh>

        {/* ── AXIS 2: SHOULDER (rotates Z) ── */}
        <group ref={shoulderRef} position={[0, 0.32, 0]}>
          {/* Shoulder motor housing */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.28, 24]} />
            <meshStandardMaterial {...jointMat} />
          </mesh>
          {/* Shoulder cover ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.19, 0.17, 0.02, 24]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
          <BoltRing radius={0.15} count={8} y={0} />

          {/* ── LOWER ARM (J2→J3) ── */}
          {/* Main arm body — tapered */}
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.09, 0.14, 1.0, 16]} />
            <primitive object={bodyMat} attach="material" />
          </mesh>
          {/* Reinforcement ridge along front */}
          <mesh position={[0.1, 0.55, 0]}>
            <boxGeometry args={[0.025, 0.9, 0.08]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>
          <mesh position={[-0.1, 0.55, 0]}>
            <boxGeometry args={[0.025, 0.9, 0.08]} />
            <meshStandardMaterial {...darkMat} />
          </mesh>

          {/* Cable bundle along lower arm */}
          <CableBundle
            points={[
              new THREE.Vector3(0.06, 0.1, 0.12),
              new THREE.Vector3(0.05, 0.4, 0.14),
              new THREE.Vector3(0.04, 0.8, 0.11),
              new THREE.Vector3(0.03, 1.05, 0.08),
            ]}
            color="#334155"
          />

          {/* ── AXIS 3: ELBOW (rotates Z) ── */}
          <group ref={elbowRef} position={[0, 1.05, 0]}>
            {/* Elbow motor housing */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.22, 24]} />
              <meshStandardMaterial {...jointMat} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
              <cylinderGeometry args={[0.15, 0.13, 0.02, 24]} />
              <primitive object={accentMat} attach="material" />
            </mesh>
            <BoltRing radius={0.12} count={6} y={0} boltRadius={0.01} />

            {/* ── UPPER ARM (J3→J5) ── */}
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.8, 16]} />
              <primitive object={bodyMat} attach="material" />
            </mesh>
            {/* Reinforcement plates */}
            <mesh position={[0.065, 0.42, 0]}>
              <boxGeometry args={[0.018, 0.7, 0.06]} />
              <meshStandardMaterial {...darkMat} />
            </mesh>
            <mesh position={[-0.065, 0.42, 0]}>
              <boxGeometry args={[0.018, 0.7, 0.06]} />
              <meshStandardMaterial {...darkMat} />
            </mesh>

            {/* Cable bundle along upper arm */}
            <CableBundle
              points={[
                new THREE.Vector3(0.04, 0.05, 0.08),
                new THREE.Vector3(0.035, 0.35, 0.09),
                new THREE.Vector3(0.03, 0.65, 0.07),
                new THREE.Vector3(0.025, 0.82, 0.04),
              ]}
              color="#475569"
            />

            {/* ── AXIS 5: WRIST PITCH ── */}
            <group ref={wristPitchRef} position={[0, 0.82, 0]}>
              {/* Wrist housing */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.14, 20]} />
                <meshStandardMaterial {...jointMat} />
              </mesh>

              {/* ── AXIS 6: WRIST ROLL ── */}
              <group ref={wristRollRef} position={[0, 0.1, 0]}>
                {/* Tool flange */}
                <mesh>
                  <cylinderGeometry args={[0.06, 0.07, 0.04, 20]} />
                  <meshStandardMaterial {...jointMat} />
                </mesh>
                <BoltRing radius={0.055} count={6} y={0.02} boltRadius={0.006} boltHeight={0.01} />

                {/* ── GRIPPER ── */}
                <group ref={gripperRef} position={[0, 0.06, 0]}>
                  {/* Gripper body/adapter plate */}
                  <mesh>
                    <boxGeometry args={[0.1, 0.04, 0.06]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                  </mesh>
                  {/* Pneumatic cylinder */}
                  <mesh position={[0, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
                    <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.15} />
                  </mesh>

                  {/* Left finger */}
                  <GripperFinger side={-1} openRef={gripOpenRef} />
                  {/* Right finger */}
                  <GripperFinger side={1} openRef={gripOpenRef} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Welding Effects */}
      <WeldingEffects armRef={{ baseRef, shoulderRef, elbowRef, wristPitchRef }} activeRef={weldActiveRef} />
    </group>
  );
}

/* ── Gripper Finger ── */
function GripperFinger({ side, openRef }: { side: number; openRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = side * openRef.current;
    }
  });

  return (
    <group ref={ref} position={[side * 0.04, -0.02, 0]}>
      {/* Finger body */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.015, 0.08, 0.04]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Finger tip — serrated grip surface */}
      <mesh position={[side * -0.004, -0.085, 0]}>
        <boxGeometry args={[0.008, 0.02, 0.035]} />
        <meshStandardMaterial color="#FF3B30" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Welding Sparks + Glow ── */
function WeldingEffects({ armRef, activeRef }: {
  armRef: { baseRef: React.MutableRefObject<THREE.Group>; shoulderRef: React.MutableRefObject<THREE.Group>; elbowRef: React.MutableRefObject<THREE.Group>; wristPitchRef: React.MutableRefObject<THREE.Group> };
  activeRef: React.MutableRefObject<boolean>;
}) {
  const sparkCount = 80;
  const sparkMesh = useRef<THREE.InstancedMesh>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const sparks = useMemo(() =>
    Array.from({ length: sparkCount }, () => ({
      vel: new THREE.Vector3(),
      life: 0,
      maxLife: 0,
    })), []);

  useFrame((_, delta) => {
    if (!sparkMesh.current || !glowRef.current) return;

    const active = activeRef.current;
    glowRef.current.intensity = THREE.MathUtils.lerp(
      glowRef.current.intensity,
      active ? 3 + Math.random() * 2 : 0,
      0.15
    );

    // Calculate tool-tip world position from the arm hierarchy
    const toolPos = new THREE.Vector3(0.5, 2.5, 0.3); // approximate
    glowRef.current.position.copy(toolPos);

    sparks.forEach((s, i) => {
      if (active) {
        s.life += delta * 3;
        if (s.life > s.maxLife || s.maxLife === 0) {
          s.life = 0;
          s.maxLife = Math.random() * 0.4 + 0.15;
          s.vel.set(
            (Math.random() - 0.5) * 0.15,
            Math.random() * 0.12 + 0.04,
            (Math.random() - 0.5) * 0.15
          );
        }
        const t = s.life / s.maxLife;
        dummy.position.set(
          toolPos.x + s.vel.x * s.life * 8,
          toolPos.y + s.vel.y * s.life * 8 - t * t * 0.8,
          toolPos.z + s.vel.z * s.life * 8
        );
        const scale = (1 - t) * 0.012;
        dummy.scale.setScalar(Math.max(scale, 0.001));
      } else {
        dummy.scale.setScalar(0.001);
      }
      dummy.updateMatrix();
      sparkMesh.current.setMatrixAt(i, dummy.matrix);
    });
    sparkMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={sparkMesh} args={[undefined, undefined, sparkCount]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#FFcc44" />
      </instancedMesh>
      <pointLight ref={glowRef} color="#FF8830" intensity={0} distance={4} decay={2} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   CONVEYOR BELT — Rollers + Belt + Side Rails
   ═══════════════════════════════════════════════════════ */
function ConveyorBelt({ position = [-1.5, 0, 0] as [number, number, number] }) {
  const rollerCount = 12;

  return (
    <group position={position}>
      {/* Belt frame */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[3.0, 0.04, 0.65]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Rollers */}
      {Array.from({ length: rollerCount }, (_, i) => {
        const x = -1.35 + (i / (rollerCount - 1)) * 2.7;
        return (
          <mesh key={i} position={[x, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.55, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.15} />
          </mesh>
        );
      })}

      {/* Side rails */}
      {[-0.32, 0.32].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.35, z]}>
            <boxGeometry args={[3.0, 0.1, 0.03]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Rail accent stripe */}
          <mesh position={[0, 0.41, z]}>
            <boxGeometry args={[3.0, 0.015, 0.035]} />
            <meshStandardMaterial color="#FF3B30" emissive="#FF3B30" emissiveIntensity={0.2} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Support legs */}
      {[-1.2, 0, 1.2].map((x) => (
        <group key={x}>
          {[-0.25, 0.25].map((z) => (
            <mesh key={z} position={[x, 0.13, z]}>
              <boxGeometry args={[0.04, 0.28, 0.04]} />
              <meshStandardMaterial color="#0a0a14" metalness={0.9} roughness={0.25} />
            </mesh>
          ))}
          {/* Cross-brace */}
          <mesh position={[x, 0.06, 0]}>
            <boxGeometry args={[0.03, 0.03, 0.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Metal workpieces on belt */}
      <AnimatedWorkpieces />
    </group>
  );
}

/* ── Workpieces moving on the conveyor ── */
function AnimatedWorkpieces() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const offset = (clock.getElapsedTime() * 0.08 + i * 1.0) % 3.0;
      child.position.x = -1.3 + offset;
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, 0.34, 0]}>
          {/* Metal block */}
          <mesh>
            <boxGeometry args={[0.12, 0.06, 0.1]} />
            <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Machined detail on top */}
          <mesh position={[0, 0.032, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.005, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   WELDING STATION — Fixture + Clamps
   ═══════════════════════════════════════════════════════ */
function WeldingStation() {
  return (
    <group position={[1.2, 0, -0.3]}>
      {/* Work table */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Table legs */}
      {[[-0.35, -0.25], [-0.35, 0.25], [0.35, -0.25], [0.35, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]}>
          <boxGeometry args={[0.04, 0.34, 0.04]} />
          <meshStandardMaterial color="#0a0a14" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {/* Fixture clamp left */}
      <mesh position={[-0.2, 0.4, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.04]} />
        <meshStandardMaterial color="#FF3B30" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Fixture clamp right */}
      <mesh position={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.04]} />
        <meshStandardMaterial color="#FF3B30" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Control panel */}
      <mesh position={[0.45, 0.55, 0]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.06]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Status light */}
      <mesh position={[0.45, 0.68, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════
   FACTORY ENVIRONMENT
   ═══════════════════════════════════════════════════════ */
function FactoryEnvironment() {
  return (
    <group>
      {/* Factory Floor — Polished concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a14" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Safety perimeter lines */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={`x-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0]}>
          <planeGeometry args={[0.05, 8]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {[-3.5, 3.5].map((z) => (
        <mesh key={`z-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, z]}>
          <planeGeometry args={[4.5, 0.05]} />
          <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Back wall — machine enclosure */}
      <mesh position={[0, 2, -4]}>
        <boxGeometry args={[8, 4, 0.15]} />
        <meshStandardMaterial color="#0B1220" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Wall panel lines */}
      {[-2.5, -0.8, 0.8, 2.5].map((x) => (
        <mesh key={x} position={[x, 2, -3.9]}>
          <boxGeometry args={[0.02, 3.8, 0.01]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Side walls */}
      <mesh position={[-3.5, 2, 0]}>
        <boxGeometry args={[0.15, 4, 8]} />
        <meshStandardMaterial color="#0B1220" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[3.5, 2, 0]}>
        <boxGeometry args={[0.15, 4, 8]} />
        <meshStandardMaterial color="#0B1220" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Status indicator lights on back wall */}
      {[-2, -1, 0, 1, 2].map((x, i) => (
        <group key={`status-${i}`}>
          <mesh position={[x, 3.2, -3.85]}>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[x, 3.2, -3.83]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color={i === 3 ? "#FF3B30" : "#22c55e"}
              emissive={i === 3 ? "#FF3B30" : "#22c55e"}
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Industrial Overhead Lighting ── */
function IndustrialLighting() {
  return (
    <group>
      {/* Overhead spot lights with housings */}
      {[[-1.5, 0], [1.5, 0], [0, -2], [0, 2]].map(([x, z], i) => (
        <group key={i} position={[x, 4, z]}>
          {/* Light housing */}
          <mesh>
            <boxGeometry args={[0.4, 0.08, 0.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          <spotLight
            position={[0, -0.05, 0]}
            angle={0.5}
            penumbra={0.8}
            intensity={12}
            color="#e2e8f0"
            distance={7}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
        </group>
      ))}
    </group>
  );
}

/* ── Ambient Dust / Particles ── */
function FactoryParticles() {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 3.5,
        (Math.random() - 0.5) * 6
      ),
      speed: Math.random() * 0.003 + 0.001,
      drift: Math.random() * Math.PI * 2,
    })), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.pos.y += p.speed;
      if (p.pos.y > 4) p.pos.y = 0;
      dummy.position.copy(p.pos);
      dummy.position.x += Math.sin(clock.getElapsedTime() * 0.2 + p.drift) * 0.01;
      dummy.scale.setScalar(0.008 + Math.sin(p.pos.y) * 0.004);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
    </instancedMesh>
  );
}

/* ── Smoothstep utility ── */
function smoothstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

/* ═══════════════════════════════════════════════════════
   EXPORTED CANVAS
   ═══════════════════════════════════════════════════════ */
export default function RoboticArmScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [3.5, 2.8, 4.5], fov: 38, near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.7,
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Scene Lighting */}
      <ambientLight intensity={0.12} color="#94a3b8" />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color="#e2e8f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-3, 2, 3]} intensity={0.4} color="#FF3B30" distance={8} decay={2} />
      <pointLight position={[3, 1, -3]} intensity={0.2} color="#3b82f6" distance={6} decay={2} />

      {/* Factory Environment */}
      <FactoryEnvironment />
      <IndustrialLighting />

      {/* Equipment */}
      <ConveyorBelt />
      <WeldingStation />

      {/* THE ROBOTIC ARM */}
      <IndustrialRoboticArm />

      {/* Atmosphere */}
      <FactoryParticles />
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={12} blur={2.5} far={4} />

      {/* Depth fog */}
      <fog attach="fog" args={["#050816", 6, 16]} />
    </Canvas>
  );
}
