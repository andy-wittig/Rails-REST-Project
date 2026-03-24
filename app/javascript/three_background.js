console.log("three_background.js loaded!");
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const canvas = document.getElementById("three-background");
const context = canvas.getContext("webgl2");

const renderer = new THREE.WebGLRenderer({canvas, context});
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.PlaneGeometry(2, 2);

const material = new THREE.ShaderMaterial({
    uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
        precision mediump float;

        varying vec2 uUv;

        void main()
        {
            uUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision mediump float;

        in vec2 uUv;
        uniform vec2 u_resolution;
        uniform float u_time;

        float random (in vec2 st)
        {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise (in vec2 st)
        {
            vec2 i = floor(st);
            vec2 f = fract(st);

            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            //Cubic Hermine Curve
            vec2 u = f * f * (3.0 - 2.0 * f);
            
            //Mix corners
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main()
        {
            vec2 st = uUv;
            vec2 pos = st * 40.0;
            float n = noise(pos);

            float lineWidth = 0.2;
            float fadeOut = 0.0; //sharpness of connecting edges
            float speedMultiplier = 0.05;

            float bands = 5.0;
            float repeatNoise = fract(n * bands); //fract returns fractional portion of floating point number
            float lineCenter = abs(cos(u_time * speedMultiplier));

            float lines = smoothstep(lineWidth + fadeOut, 
                                    lineWidth - fadeOut, 
                                    abs(repeatNoise - lineCenter));

            gl_FragColor = mix(vec4(19.0 / 255.0, 19.0 / 255.0, 20.0 / 255.0, 1.0), vec4(vec3(12.0 / 255.0, 12.0 / 255.0, 12.0 / 255.0), 1.0), lines);
        }
    `
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate(time)
{
    material.uniforms.u_time.value = time * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});