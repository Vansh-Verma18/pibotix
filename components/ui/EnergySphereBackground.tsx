"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function EnergySphereBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // 1. Solid Glowing Core
        const coreGeometry = new THREE.IcosahedronGeometry(1.2, 4);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 1.5,
            wireframe: false,
        });
        const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);

        // 2. Wireframe Energy Shell
        const wireGeometry = new THREE.IcosahedronGeometry(1.6, 20);
        const wireMaterial = new THREE.MeshStandardMaterial({
            color: 0x8a2be2,
            emissive: 0x8a2be2,
            emissiveIntensity: 0.8,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);

        // 3. Outer Cloud/Aura
        const auraGeometry = new THREE.SphereGeometry(2.1, 32, 32);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            depthWrite: false,
        });
        const auraSphere = new THREE.Mesh(auraGeometry, auraMaterial);

        // 4. Swirling Particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 400;
        const positions = new Float32Array(particleCount * 3);
        for(let i = 0; i < particleCount * 3; i += 3) {
            // Spherical distribution
            const r = 1.5 + Math.random() * 2.5;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(Math.random() * 2 - 1);
            positions[i] = r * Math.sin(phi) * Math.cos(theta);
            positions[i+1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i+2] = r * Math.cos(phi);
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.03,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);

        // Lights
        const pointLight = new THREE.PointLight(0x00f0ff, 5, 10);
        pointLight.position.set(0, 0, 0); // Emerge from the center

        // Group elements
        const sphereGroup = new THREE.Group();
        sphereGroup.add(coreSphere);
        sphereGroup.add(wireSphere);
        sphereGroup.add(auraSphere);
        sphereGroup.add(particles);
        sphereGroup.add(pointLight);
        scene.add(sphereGroup);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        camera.position.z = 5;

        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId: number;
        let baseY = 0;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            // Complex rotations for each layer
            coreSphere.rotation.y = elapsedTime * 0.5;
            coreSphere.rotation.z = elapsedTime * 0.3;
            
            wireSphere.rotation.y = -elapsedTime * 0.2;
            wireSphere.rotation.x = elapsedTime * 0.1;
            
            particles.rotation.y = elapsedTime * 0.15;
            particles.rotation.z = -elapsedTime * 0.05;
            
            // Pulse & Float effect
            const pulse = 1 + Math.sin(elapsedTime * 2) * 0.05;
            auraSphere.scale.set(pulse, pulse, pulse);
            coreSphere.scale.setScalar(pulse * 0.95);
            
            // Smooth up/down floating
            sphereGroup.position.y = baseY + Math.sin(elapsedTime * 1.5) * 0.2;
            
            renderer.render(scene, camera);
        }

        const handleResize = () => {
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const newWidth = rect.width || window.innerWidth;
            const newHeight = rect.height || window.innerHeight;

            // Guard against zero/invalid sizes to prevent NaN aspect ratios
            if (!newWidth || !newHeight) return;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.setSize(newWidth, newHeight);

            // Responsive positioning and scaling
            if (newWidth < 1024) {
                sphereGroup.position.x = 0;
                baseY = 2.5; // Move up on mobile so it doesn't block the main text
                sphereGroup.scale.setScalar(0.6); // Scale down the entire group
            } else {
                sphereGroup.position.x = 3.5;
                baseY = 0; // Center vertically on desktop
                sphereGroup.scale.setScalar(1);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial position
        animate();

        // Cleanup function on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            coreGeometry.dispose();
            coreMaterial.dispose();
            wireGeometry.dispose();
            wireMaterial.dispose();
            auraGeometry.dispose();
            auraMaterial.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-transparent" 
            style={{ display: 'block' }} 
        />
    );
}