import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

interface ExplodablePartProps {
  exploded: boolean;
  offset: [number, number, number];
  children: ReactNode;
}

export default function ExplodablePart({ exploded, offset, children }: ExplodablePartProps) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const reduced = useReducedMotion();
  const [x, y, z] = exploded ? offset : [0, 0, 0];

  useEffect(() => {
    if (reduced && group.current) group.current.position.set(x, y, z);
    invalidate();
  }, [x, y, z, reduced, invalidate]);

  useFrame((_, delta) => {
    const object = group.current;
    if (!object || reduced) return;
    const nextX = MathUtils.damp(object.position.x, x, 7, delta);
    const nextY = MathUtils.damp(object.position.y, y, 7, delta);
    const nextZ = MathUtils.damp(object.position.z, z, 7, delta);
    object.position.set(nextX, nextY, nextZ);
    const unsettled = Math.abs(nextX - x) + Math.abs(nextY - y) + Math.abs(nextZ - z) > 0.001;
    if (unsettled) invalidate();
    else if (object.position.x !== x || object.position.y !== y || object.position.z !== z) {
      object.position.set(x, y, z);
      invalidate();
    }
  });

  return <group ref={group}>{children}</group>;
}
