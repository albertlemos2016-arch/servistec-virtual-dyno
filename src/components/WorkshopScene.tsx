import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { DynoSnapshot } from '../types/simulation';

function CarBody() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.5, 0.45);
    s.lineTo(-2.0, 1.0);
    s.quadraticCurveTo(-1.0, 1.42, 0.0, 1.32);
    s.quadraticCurveTo(1.6, 1.28, 2.4, 0.9);
    s.lineTo(2.6, 0.5);
    s.quadraticCurveTo(2.85, 0.2, 2.75, -0.1);
    s.lineTo(-2.45, -0.1);
    s.quadraticCurveTo(-2.52, 0.2, -2.5, 0.45);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 1.8,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 32
    }),
    []
  );

  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.center();
    return g;
  }, [shape, extrudeSettings]);

  return (
    <group position={[0, 1.1, 0]} rotation={[0, -Math.PI / 8, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#d6d9dd"
          metalness={0.72}
          roughness={0.26}
          clearcoat={1}
          clearcoatRoughness={0.18}
          envMapIntensity={1.3}
        />
      </mesh>

      <mesh position={[0, 0.74, 0.18]} scale={[0.82, 0.44, 0.6]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#a9b6bf"
          metalness={0.5}
          roughness={0.12}
          transmission={0.7}
          transparent
          opacity={0.58}
          thickness={0.9}
        />
      </mesh>

      {[-1.18, 1.18].map((x) => (
        <group key={x} position={[x, 0.22, 0.9]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.32, 64]} />
            <meshStandardMaterial color="#0c0e11" roughness={0.82} metalness={0.66} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 64]} />
            <meshStandardMaterial color="#9aa7af" roughness={0.35} metalness={0.92} />
          </mesh>
        </group>
      ))}

      {[-1.18, 1.18].map((x) => (
        <group key={`${x}-rear`} position={[x, 0.22, -0.9]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.32, 64]} />
            <meshStandardMaterial color="#0c0e11" roughness={0.82} metalness={0.66} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 64]} />
            <meshStandardMaterial color="#9aa7af" roughness={0.35} metalness={0.92} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DynoUnit({ rpm }: { rpm: number }) {
  const rotorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x -= (rpm / 1800) * delta * 3.2;
    }
  });

  return (
    <group position={[0, 0.3, 0]}>
      <RoundedBox args={[5.8, 0.26, 2.8]} radius={0.08} smoothness={5} position={[0, 0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2b3137" roughness={0.56} metalness={0.85} />
      </RoundedBox>

      <group ref={rotorRef} position={[0, 0.42, 0]}>
        {[-1, 1].map((side) => (
          <mesh key={side} rotation={[Math.PI / 2, 0, 0]} position={[side * 1.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.38, 64]} />
            <meshStandardMaterial color="#8c959b" roughness={0.3} metalness={0.96} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[2.35, 2.35, 0.1, 64]} />
        <meshStandardMaterial color="#929aa2" roughness={0.32} metalness={0.94} />
      </mesh>
    </group>
  );
}

export function WorkshopScene({ snapshot }: { snapshot: DynoSnapshot }) {
  return (
    <>
      <ambientLight intensity={0.42} color="#dfe7ff" />
      <directionalLight castShadow position={[9, 8, 6]} intensity={1.9} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-9, 7, 8]} angle={0.38} penumbra={1} intensity={26} color="#dfe9ff" castShadow />

      <group>
        <RoundedBox args={[18, 0.3, 18]} radius={0.04} smoothness={5} position={[0, -0.06, 0]} receiveShadow>
          <meshPhysicalMaterial color="#b7bcc2" roughness={0.76} metalness={0.18} />
        </RoundedBox>

        <mesh position={[-3.5, 0.95, -4.2]} castShadow>
          <boxGeometry args={[4.8, 1.8, 0.35]} />
          <meshStandardMaterial color="#c0b7b1" roughness={0.8} metalness={0.22} />
        </mesh>

        <mesh position={[4.8, 1.7, -4]} castShadow>
          <boxGeometry args={[4.8, 2.8, 0.3]} />
          <meshStandardMaterial color="#2a2c31" roughness={0.7} metalness={0.7} />
        </mesh>

        <Float speed={0.7} rotationIntensity={0.18} floatIntensity={0.2}>
          <mesh position={[0, 2.2, -5.4]} castShadow>
            <boxGeometry args={[2.3, 1.1, 0.28]} />
            <meshStandardMaterial emissive="#7fe2ff" emissiveIntensity={1.2} color="#64d6ff" />
          </mesh>
        </Float>

        <CarBody />
        <DynoUnit rpm={snapshot.rpm} />

        <group position={[-4.6, 1.15, 4]}>
          <RoundedBox args={[1.4, 2.3, 0.9]} radius={0.08} smoothness={4} castShadow receiveShadow>
            <meshStandardMaterial color="#62707b" roughness={0.62} metalness={0.76} />
          </RoundedBox>
          <mesh position={[0, -0.2, 0.5]} castShadow>
            <boxGeometry args={[0.95, 0.9, 0.12]} />
            <meshStandardMaterial color="#1b1f22" metalness={0.6} roughness={0.45} />
          </mesh>
        </group>
      </group>
    </>
  );
}
