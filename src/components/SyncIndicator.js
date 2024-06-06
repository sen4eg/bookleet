import React, {useEffect, useRef, useState} from 'react';

const cloudIconPaths = [
    "m50 92.551c-0.82812 0-1.5-0.67188-1.5-1.5 0-1.1289-0.92188-2.0391-2.0391-2.0391h-26c-0.82813 0-1.5-0.67188-1.5-1.5v-44.359c0-0.82812 0.67187-1.5 1.5-1.5h23.77c2.3516 0 4.4492 1.1211 5.7812 2.8594 1.3281-1.7383 3.4297-2.8594 5.7812-2.8594h23.77c0.82812 0 1.5 0.67188 1.5 1.5v44.359c0 0.82812-0.67188 1.5-1.5 1.5h-26c-1.1289 0-2.0391 0.92188-2.0391 2.0391 0 0.82812-0.67188 1.5-1.5 1.5zm-28.039-6.5391h24.5c1.3789 0 2.6289 0.55859 3.5391 1.4609 0.91016-0.89844 2.1602-1.4609 3.5391-1.4609h24.5v-41.359h-22.27c-2.3594 0-4.2812 1.9219-4.2812 4.2812v1.9609c0 0.82812-0.67188 1.5-1.5 1.5s-1.5-0.67188-1.5-1.5v-1.9609c0-2.3594-1.9219-4.2812-4.2812-4.2812h-22.27v41.359z",
    "m50 92.551c-0.82812 0-1.5-0.67188-1.5-1.5v-40.172c0-0.82812 0.67188-1.5 1.5-1.5s1.5 0.67188 1.5 1.5v40.172c0 0.82812-0.67188 1.5-1.5 1.5z",
    "m70.039 54.961h-11.18c-0.82812 0-1.5-0.67188-1.5-1.5 0-0.82813 0.67188-1.5 1.5-1.5h11.18c0.82813 0 1.5 0.67187 1.5 1.5 0 0.82812-0.67187 1.5-1.5 1.5z",
    "m70.039 65.52h-11.18c-0.82812 0-1.5-0.67188-1.5-1.5s0.67188-1.5 1.5-1.5h11.18c0.82813 0 1.5 0.67188 1.5 1.5s-0.67187 1.5-1.5 1.5z",
    "m70.039 76.078h-11.18c-0.82812 0-1.5-0.67188-1.5-1.5s0.67188-1.5 1.5-1.5h11.18c0.82813 0 1.5 0.67188 1.5 1.5s-0.67187 1.5-1.5 1.5z",
    "m40.719 54.961h-11.18c-0.82812 0-1.5-0.67188-1.5-1.5 0-0.82813 0.67188-1.5 1.5-1.5h11.18c0.82812 0 1.5 0.67187 1.5 1.5 0 0.82812-0.67188 1.5-1.5 1.5z",
    "m40.719 65.52h-11.18c-0.82812 0-1.5-0.67188-1.5-1.5s0.67188-1.5 1.5-1.5h11.18c0.82812 0 1.5 0.67188 1.5 1.5s-0.67188 1.5-1.5 1.5z",
    "m40.719 76.078h-11.18c-0.82812 0-1.5-0.67188-1.5-1.5s0.67188-1.5 1.5-1.5h11.18c0.82812 0 1.5 0.67188 1.5 1.5s-0.67188 1.5-1.5 1.5z",
    "m74.699 28.629c-0.64062 0-1.2305-0.41016-1.4297-1.0586-3.1797-10.238-12.531-17.121-23.262-17.121-10.73 0-20.09 6.8789-23.262 17.121-0.23828 0.78906-1.0781 1.2383-1.8789 0.98828-0.78906-0.25-1.2305-1.0898-0.98828-1.8789 3.5703-11.5 14.07-19.23 26.129-19.23 12.059 0 22.551 7.7305 26.129 19.23 0.25 0.78906-0.19922 1.6289-0.98828 1.8789-0.14844 0.050781-0.30078 0.070312-0.44922 0.070312z",
    "m82.059 60.699c-0.58984 0-1.1602-0.35938-1.3906-0.94141-0.30859-0.76953 0.058593-1.6406 0.82812-1.9492 5.7695-2.3203 9.5-7.8398 9.5-14.059 0-8.3594-6.7891-15.16-15.148-15.16-0.35156 0-0.69141 0-1.0312 0.039062-0.82812 0.078125-1.5508-0.53906-1.6211-1.3711-0.070312-0.82812 0.53906-1.5508 1.3711-1.6211 0.42188-0.039063 0.83984-0.050781 1.2812-0.050781 10.012 0 18.148 8.1484 18.148 18.16 0 7.4492-4.4688 14.059-11.379 16.852-0.17969 0.070313-0.37109 0.10938-0.55859 0.10938z",
    "m18.32 60.852c-0.17187 0-0.35156-0.03125-0.53125-0.10156-7.0508-2.6406-11.789-9.4805-11.789-17.012 0-10.012 8.1484-18.16 18.16-18.16 0.42969 0 0.85156 0.011719 1.2812 0.050781 0.82812 0.070313 1.4414 0.78906 1.3711 1.6211-0.070312 0.82812-0.78125 1.4492-1.6211 1.3711-0.33984-0.03125-0.67969-0.039063-1.0312-0.039063-8.3594 0-15.16 6.8008-15.16 15.16 0 6.2891 3.9609 11.988 9.8398 14.199 0.78125 0.28906 1.1719 1.1602 0.87891 1.9297-0.23047 0.60156-0.80078 0.96875-1.3984 0.96875z",
    "m64.469 25.359c-0.48828 0-0.96094-0.23828-1.25-0.67188-2.75-4.1602-7.3594-6.6406-12.32-6.6406-4.9609 0-9.5703 2.4805-12.32 6.6406-0.46094 0.69141-1.3906 0.87891-2.0781 0.42188-0.69141-0.46094-0.87891-1.3906-0.42188-2.0781 3.3086-5 8.8516-7.9805 14.82-7.9805s11.52 2.9805 14.82 7.9805c0.46094 0.69141 0.26953 1.6211-0.42188 2.0781-0.25 0.17188-0.53906 0.25-0.82812 0.25z"
];

const drawCloud = (ctx, dimension, color) => {
    ctx.save();

    // Clear the canvas
    ctx.clearRect(0, 0, dimension, dimension);
    const scale = 0.30;
    // Scale the context by 0.25 (down by 4)
    ctx.scale(scale, scale);
    const shift = 0.25 * dimension;
    // Adjust the translation to keep the cloud centered
    ctx.translate(shift, shift);

    // Set styles
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // Draw the cloud paths
    cloudIconPaths.forEach(path => {
        const p = new Path2D(path);
        ctx.fill(p);
        ctx.stroke(p);
    });

    // Restore the context state
    ctx.restore();
};

const drawSynched = (ctx, dimension) => {
    ctx.clearRect(0, 0, dimension, dimension);
    ctx.fillStyle = 'white';
    drawCloud(ctx, dimension, 'white');
};

const drawRedCircle = (ctx, dimension) => {
    // Draw dashed line from bottom-left to top-right corner
    ctx.strokeStyle = 'red'; // Set stroke color
    ctx.setLineDash([5, 5]); // Set dash pattern
    ctx.lineWidth = 2; // Set stroke width
    ctx.beginPath();
    ctx.moveTo(0 + 2, dimension); // Start from bottom-left corner
    ctx.lineTo(dimension + 2, 0); // Draw to top-right corner
    ctx.stroke(); // Draw the dashed line

    // Draw dashed red circle
    ctx.setLineDash([5, 5]); // Reset dash pattern for the circle
    ctx.beginPath();
    ctx.strokeStyle = 'red'; // Set stroke color for circle
    ctx.arc(dimension / 2 + 1, dimension / 2 + 2, dimension / 3, 0, 2 * Math.PI);
    ctx.stroke(); // Draw the stroked circle
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createParticle = (dimension, direction) => {
    return {
        x: Math.random() * dimension,
        y: Math.random() * dimension,
        length: getRandomInt(5, 15),
        speed: Math.random() * 2 + 1,
        life: getRandomInt(20, 50),
        direction: direction,
    };
};

const drawParticles = (ctx, particles, color) => {
    particles.forEach(particle => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        if (particle.direction === 'in') {
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x, particle.y + particle.length);
        } else {
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x, particle.y - particle.length);
        }
        ctx.stroke();
    });
};

const animateSyncing = (ctx, dimension, drawDirection, setAnimationFrame) => {
    let particles = Array.from({ length: getRandomInt(3, 7) }, () => createParticle(dimension, drawDirection));
    const animate = () => {
        ctx.clearRect(0, 0, dimension, dimension);

        drawCloud(ctx, dimension,
            (drawDirection === 'in') ?
                '#fbaa4b' :
                '#4bfb7f'
        );
        particles = particles.map(particle => ({
            ...particle,
            y: particle.direction === 'in' ? particle.y + particle.speed : particle.y - particle.speed,
            life: particle.life - 1,
        })).filter(particle => particle.life > 0);

        if (particles.length < 3) {
            particles.push(createParticle(dimension, drawDirection));
        }

        drawParticles(ctx, particles, drawDirection === 'in' ? 'orange' : 'green');
        const id = requestAnimationFrame(animate);
        setAnimationFrame(id);
    };

    animate();
};

const SyncIndicator = ({ syncStatus, connected, dimension = 32 }) => {
    const canvasRef = useRef(null);
    const [animationFrame, setAnimationFrame] = useState(null);
    const stopAnimation = () => {
        if (!!animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const status = syncStatus.toLowerCase();

        console.log("connected?", connected);


        if (connected) {
            drawCloud(ctx, dimension, 'white');
        } else {
            drawRedCircle(ctx, dimension);
            return;
        }
        if (status === 'synced') {
            stopAnimation();
            drawSynched(ctx, dimension);
        } else if (status === 'syncingin') {
            animateSyncing(ctx, dimension, 'in', setAnimationFrame, stopAnimation);
        } else if (status === 'syncingout') {
            animateSyncing(ctx, dimension, 'out', setAnimationFrame, stopAnimation);
        } else {
            drawRedCircle(ctx, dimension);
            stopAnimation();
        }
//eslint-disable-next-line
    }, [syncStatus, dimension, connected]);


    useEffect(() => {
        if (syncStatus === 'synced') {
            stopAnimation();
        }
        // eslint-disable-next-line
    }, [syncStatus]);
    return (
        <div>
            <canvas ref={canvasRef} width={dimension} height={dimension}></canvas>
        </div>
    );
};

export default SyncIndicator;
