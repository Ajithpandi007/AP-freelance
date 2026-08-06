import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas = ({
  theme = 'cyber',
  interactive = true,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color palettes based on theme
    let primaryColor = 0x6366f1; // Indigo
    let secondaryColor = 0x06b6d4; // Cyan
    let accentColor = 0xec4899; // Pink

    if (theme === 'studio') {
      primaryColor = 0x3b82f6;
      secondaryColor = 0x10b981;
      accentColor = 0xf59e0b;
    } else if (theme === 'hologram') {
      primaryColor = 0xa855f7;
      secondaryColor = 0x06b6d4;
      accentColor = 0x10b981;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(primaryColor, 3, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(secondaryColor, 3, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // 1. Floating Main Wireframe Nodes (Icosahedron & Torus Knot)
    const mainGeometry = new THREE.IcosahedronGeometry(4, 1);
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: primaryColor,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      emissive: primaryColor,
      emissiveIntensity: 0.2,
    });
    const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
    mainMesh.position.set(-6, 2, -2);
    scene.add(mainMesh);

    const secondaryGeometry = new THREE.TorusKnotGeometry(2.5, 0.6, 100, 16);
    const secondaryMaterial = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      emissive: secondaryColor,
      emissiveIntensity: 0.3,
    });
    const secondaryMesh = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
    secondaryMesh.position.set(7, -3, -4);
    scene.add(secondaryMesh);

    // 2. Small floating geometric shards
    const shardGroup = new THREE.Group();
    const geometries = [
      new THREE.OctahedronGeometry(1),
      new THREE.DodecahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(1.2),
    ];

    for (let i = 0; i < 22; i++) {
      const geom = geometries[i % geometries.length];
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? accentColor : primaryColor,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: i % 3 === 0,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 20 - 5
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );
      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatSpeed: 0.005 + Math.random() * 0.01,
        initialY: mesh.position.y,
      };
      shardGroup.add(mesh);
    }
    scene.add(shardGroup);

    // 3. Particle Field Background
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(primaryColor);
    const color2 = new THREE.Color(secondaryColor);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 50;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      particleColors[i * 3] = mixedColor.r;
      particleColors[i * 3 + 1] = mixedColor.g;
      particleColors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (event) => {
      if (!interactive) return;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetMouseX = (event.clientX - windowHalfX) / 100;
      targetMouseY = (event.clientY - windowHalfY) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 0.8;
      camera.position.y = -mouseY * 0.8;
      camera.lookAt(scene.position);

      // Rotate primary geometries
      mainMesh.rotation.x = elapsedTime * 0.2;
      mainMesh.rotation.y = elapsedTime * 0.25;

      secondaryMesh.rotation.x = elapsedTime * 0.15;
      secondaryMesh.rotation.z = elapsedTime * 0.2;

      // Animate shard group
      shardGroup.children.forEach((shard) => {
        const u = shard.userData;
        shard.rotation.x += u.rotSpeedX;
        shard.rotation.y += u.rotSpeedY;
        shard.position.y = u.initialY + Math.sin(elapsedTime * 2 + shard.position.x) * 0.5;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      mainGeometry.dispose();
      mainMaterial.dispose();
      secondaryGeometry.dispose();
      secondaryMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [theme, interactive]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
