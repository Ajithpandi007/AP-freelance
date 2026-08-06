import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye } from 'lucide-react';

export const Three3DCardViewer = ({
  geometryType,
  color = '#6366f1',
  height = 180,
  interactive = true,
}) => {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear existing children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(color, 4, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xffffff, 2, 20);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Geometry selection
    let geom;
    switch (geometryType) {
      case 'dodecahedron':
        geom = new THREE.DodecahedronGeometry(1.8, 0);
        break;
      case 'torusKnot':
        geom = new THREE.TorusKnotGeometry(1.3, 0.45, 80, 16);
        break;
      case 'octahedron':
        geom = new THREE.OctahedronGeometry(2, 0);
        break;
      case 'cylinder':
        geom = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
        break;
      case 'sphere':
        geom = new THREE.SphereGeometry(1.8, 32, 32);
        break;
      case 'icosahedron':
      default:
        geom = new THREE.IcosahedronGeometry(1.9, 0);
        break;
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.15,
      metalness: 0.85,
      wireframe: wireframe,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.15,
    });

    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    // Outer subtle wireframe cage
    const outerGeom = new THREE.IcosahedronGeometry(2.3, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeom, outerMat);
    scene.add(outerMesh);

    // Drag rotation controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mesh.rotation.y += deltaX * 0.015;
      mesh.rotation.x += deltaY * 0.015;
      outerMesh.rotation.y += deltaX * 0.015;
      outerMesh.rotation.x += deltaY * 0.015;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        mesh.rotation.y = elapsed * 0.5;
        mesh.rotation.x = Math.sin(elapsed * 0.3) * 0.2;
        outerMesh.rotation.y = -elapsed * 0.25;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || width;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      geom.dispose();
      outerGeom.dispose();
      material.dispose();
      outerMat.dispose();
      renderer.dispose();
    };
  }, [geometryType, color, height, wireframe, autoRotate, interactive]);

  return (
    <div className="relative group w-full flex flex-col items-center justify-center">
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing rounded-xl overflow-hidden"
      />

      {/* Interactive Toolbar Overlay */}
      {interactive && (
        <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setWireframe(!wireframe)}
            title="Toggle Wireframe Shader"
            className={`p-1 text-xs rounded hover:bg-slate-800 transition ${
              wireframe ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Spin"
            className={`p-1 text-xs rounded hover:bg-slate-800 transition ${
              autoRotate ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};
