import React, { useRef, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useControls } from 'leva';

export default function Model() {
    const { nodes } = useGLTF("/medias/torrus.glb");
    const { viewport } = useThree();
    const torus = useRef(null);
    const textRef = useRef();

    // Torus rotation
    useFrame(() => {
        if (torus.current) {
            torus.current.rotation.x += 0.02;
        }
    });

    const materialProps = useControls({
        thickness: { value: 3, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.1, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0, min: 0, max: 1},
        backside: { value: true},
    })

    // RGB color animation for Text
    useEffect(() => {
        const color = { r: 1, g: 1, b: 1 }; // initial white

        const animateColor = () => {
            gsap.to(color, {
                r: Math.random(),
                g: Math.random(),
                b: Math.random(),
                duration: 2 + Math.random() * 2, // 2–4s
                ease: "sine.inOut",
                onUpdate: () => {
                    if (textRef.current?.material?.color) {
                        textRef.current.material.color.setRGB(color.r, color.g, color.b);
                    }
                },
                onComplete: animateColor,
            });
        };

        animateColor();
    }, []);

    return (
        <group scale={viewport.width / 3.75}>
            <Text
                ref={textRef}
                font={'/fonts/PPNeueMontreal-Bold.otf'}
                position={[0, 0, -1]}
                fontSize={1.3}
                color="white" // initial color, but will be animated
                anchorX="center"
                anchorY="middle"
            >
                Unfor Dev
            </Text>
            <mesh ref={torus} geometry={nodes.Torus002.geometry}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    );
}
