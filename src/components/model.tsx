import { useTexture } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export const UploadedModel = ({
  url,
  textureUrl = "",
  autoRotate = false,
  showSpotLights = false,
}: {
  url: string;
  textureUrl?: string;
  autoRotate?: boolean;
  showSpotLights?: boolean;
}) => {
  const [hover, setHover] = useState<boolean>(false);
  const meshRef = useRef<Mesh>(null!);
  const obj = useLoader(OBJLoader, url);
  const geometry = useMemo(() => {
    let g;
    obj.traverse((c) => {
      if (c.type === "Mesh") {
        const _c = c as Mesh;
        g = _c.geometry;
      }
    });
    return g;
  }, [obj]);

  const [texture] = useTexture([textureUrl || "/blue.jpg"]);

  useFrame(() => {
    if (!meshRef.current) return;

    if (meshRef.current) {
      if (autoRotate) {
        meshRef.current.rotation.y += 0.003;
      }
      if (hover) {
        meshRef.current.rotation.y += 0.01;
      }
    }
  });
  if (!url) return null;

  return (
    <>
      <mesh
        geometry={geometry}
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <meshStandardMaterial map={texture} />
      </mesh>
      {showSpotLights && (
        <>
          <spotLight
            castShadow
            position={[20, 0, 2]}
            angle={10}
            distance={15}
            intensity={100}
            color={"white"}
          />
          <spotLight
            castShadow
            position={[-20, 0, 2]}
            angle={10}
            distance={15}
            intensity={100}
            color={"white"}
          />
        </>
      )}
    </>
  );
};
