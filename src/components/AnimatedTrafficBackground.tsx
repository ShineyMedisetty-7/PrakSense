export const AnimatedTrafficBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .traffic-animation * {
              animation: none !important;
              transition: none !important;
            }
          }

          @keyframes lightTrailLeft {
            0% { transform: translateX(-200%) scaleX(0); opacity: 0; }
            20% { opacity: 0.8; }
            50% { transform: translateX(0%) scaleX(1); opacity: 0.8; }
            100% { transform: translateX(120%) scaleX(0.5); opacity: 0; }
          }

          @keyframes lightTrailRight {
            0% { transform: translateX(200%) scaleX(0); opacity: 0; }
            20% { opacity: 0.6; }
            50% { transform: translateX(0%) scaleX(1); opacity: 0.6; }
            100% { transform: translateX(-120%) scaleX(0.5); opacity: 0; }
          }

          @keyframes streetLightGlow {
            0%, 100% {
              filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))
                      drop-shadow(0 0 30px rgba(255, 255, 255, 0.6))
                      drop-shadow(0 0 45px rgba(255, 255, 255, 0.4));
              opacity: 0.9;
            }
            50% {
              filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1))
                      drop-shadow(0 0 40px rgba(255, 255, 255, 0.8))
                      drop-shadow(0 0 60px rgba(255, 255, 255, 0.6));
              opacity: 1;
            }
          }

          @keyframes towerBlink {
            0%, 90% { opacity: 0.15; }
            95%, 100% { opacity: 0.25; }
          }

          @keyframes roadLineFlow {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100px); }
          }

          .light-trail-red {
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(239, 68, 68, 0.1) 10%,
              rgba(239, 68, 68, 0.6) 30%,
              rgba(239, 68, 68, 0.9) 50%,
              rgba(239, 68, 68, 0.6) 70%,
              rgba(239, 68, 68, 0.1) 90%,
              transparent 100%
            );
          }

          .light-trail-orange {
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(251, 146, 60, 0.1) 10%,
              rgba(251, 146, 60, 0.5) 30%,
              rgba(251, 146, 60, 0.8) 50%,
              rgba(251, 146, 60, 0.5) 70%,
              rgba(251, 146, 60, 0.1) 90%,
              transparent 100%
            );
          }

          .light-trail-yellow {
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(250, 204, 21, 0.1) 10%,
              rgba(250, 204, 21, 0.4) 30%,
              rgba(250, 204, 21, 0.7) 50%,
              rgba(250, 204, 21, 0.4) 70%,
              rgba(250, 204, 21, 0.1) 90%,
              transparent 100%
            );
          }

          .light-trail-white {
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 10%,
              rgba(255, 255, 255, 0.4) 30%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.4) 70%,
              rgba(255, 255, 255, 0.1) 90%,
              transparent 100%
            );
          }
        `}
      </style>

      <div className="traffic-animation absolute inset-0">
        {/* Deep Blue Night Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700" style={{ opacity: 0.25 }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-blue-700/30" />

        {/* Dark Road Surface at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/40 via-gray-800/20 to-transparent" />

        {/* Road Lane Markings - Flowing */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          {[...Array(6)].map((_, idx) => (
            <div
              key={`road-line-${idx}`}
              className="absolute h-1 bg-gray-400/20"
              style={{
                bottom: `${20 + idx * 20}px`,
                left: 0,
                right: 0,
                background: 'repeating-linear-gradient(90deg, rgba(156, 163, 175, 0.3) 0px, rgba(156, 163, 175, 0.3) 40px, transparent 40px, transparent 80px)',
                animation: `roadLineFlow ${3 + idx * 0.5}s linear infinite`
              }}
            />
          ))}
        </div>

        {/* Street Lights - Glowing White Lights */}
        {[
          { left: '10%', top: '15%', delay: '0s' },
          { left: '20%', top: '18%', delay: '0.5s' },
          { left: '30%', top: '12%', delay: '1s' },
          { left: '45%', top: '20%', delay: '1.5s' },
          { left: '55%', top: '16%', delay: '2s' },
          { left: '70%', top: '14%', delay: '2.5s' },
          { left: '82%', top: '19%', delay: '3s' },
          { left: '92%', top: '17%', delay: '3.5s' }
        ].map((light, idx) => (
          <div key={`street-light-${idx}`} className="absolute" style={{ left: light.left, top: light.top }}>
            {/* Light Pole */}
            <div className="relative">
              <div className="w-1 h-16 bg-gray-600/30 mx-auto" style={{ opacity: 0.2 }} />
              {/* Glowing Light */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full"
                style={{
                  animation: `streetLightGlow 3s ease-in-out ${light.delay} infinite`
                }}
              />
              {/* Light Beam */}
              <div
                className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-32 opacity-10"
                style={{
                  background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
                  clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)'
                }}
              />
            </div>
          </div>
        ))}

        {/* Power Transmission Towers */}
        {[
          { left: '35%', height: '120px', delay: '0s' },
          { left: '65%', height: '140px', delay: '2s' }
        ].map((tower, idx) => (
          <div key={`tower-${idx}`} className="absolute" style={{ left: tower.left, top: '10%' }}>
            {/* Tower Structure */}
            <div className="relative flex flex-col items-center" style={{ opacity: 0.15 }}>
              {/* Top Triangle */}
              <div className="w-8 h-3 bg-gray-700" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              {/* Main Body */}
              <div className="w-1 bg-gray-700" style={{ height: tower.height }} />
              {/* Cross Beams */}
              <div className="absolute w-16 h-0.5 bg-gray-700" style={{ top: '30%' }} />
              <div className="absolute w-12 h-0.5 bg-gray-700" style={{ top: '50%' }} />
              <div className="absolute w-20 h-0.5 bg-gray-700" style={{ top: '70%' }} />
              {/* Warning Light */}
              <div
                className="absolute -top-1 w-2 h-2 bg-red-500 rounded-full"
                style={{
                  animation: `towerBlink 2s ease-in-out ${tower.delay} infinite`
                }}
              />
            </div>
            {/* Power Lines */}
            <svg className="absolute top-0 left-0 w-screen h-32" style={{ opacity: 0.1 }}>
              <line x1="0" y1="40" x2="100%" y2="35" stroke="#4b5563" strokeWidth="1" />
              <line x1="0" y1="60" x2="100%" y2="55" stroke="#4b5563" strokeWidth="1" />
              <line x1="0" y1="80" x2="100%" y2="75" stroke="#4b5563" strokeWidth="1" />
            </svg>
          </div>
        ))}

        {/* Red Light Trails (Taillights) - Left Side */}
        {[
          { top: '60%', delay: '0s', duration: '4s', type: 'red' },
          { top: '65%', delay: '1.2s', duration: '3.5s', type: 'red' },
          { top: '58%', delay: '2.5s', duration: '4.2s', type: 'red' },
          { top: '62%', delay: '3.8s', duration: '3.8s', type: 'orange' },
          { top: '67%', delay: '5s', duration: '4s', type: 'red' },
          { top: '64%', delay: '6.2s', duration: '3.6s', type: 'orange' }
        ].map((trail, idx) => (
          <div
            key={`trail-red-${idx}`}
            className={`absolute h-1 light-trail-${trail.type}`}
            style={{
              top: trail.top,
              left: '0%',
              width: '30%',
              animation: `lightTrailLeft ${trail.duration} ease-out ${trail.delay} infinite`,
              filter: 'blur(2px)'
            }}
          />
        ))}

        {/* White/Yellow Light Trails (Headlights) - Right Side */}
        {[
          { top: '70%', delay: '0.5s', duration: '3.8s', type: 'white' },
          { top: '73%', delay: '1.8s', duration: '4.2s', type: 'yellow' },
          { top: '68%', delay: '3s', duration: '3.5s', type: 'white' },
          { top: '75%', delay: '4.5s', duration: '4s', type: 'yellow' },
          { top: '72%', delay: '5.8s', duration: '3.7s', type: 'white' }
        ].map((trail, idx) => (
          <div
            key={`trail-white-${idx}`}
            className={`absolute h-1 light-trail-${trail.type}`}
            style={{
              top: trail.top,
              right: '0%',
              width: '30%',
              animation: `lightTrailRight ${trail.duration} ease-out ${trail.delay} infinite`,
              filter: 'blur(2px)'
            }}
          />
        ))}

        {/* Additional Shorter Light Trails for Depth */}
        {[...Array(8)].map((_, idx) => (
          <div
            key={`mini-trail-${idx}`}
            className={`absolute h-0.5 ${idx % 2 === 0 ? 'light-trail-red' : 'light-trail-white'}`}
            style={{
              top: `${55 + Math.random() * 25}%`,
              [idx % 2 === 0 ? 'left' : 'right']: '0%',
              width: `${10 + Math.random() * 15}%`,
              animation: `${idx % 2 === 0 ? 'lightTrailLeft' : 'lightTrailRight'} ${2.5 + Math.random() * 2}s ease-out ${idx * 0.8}s infinite`,
              opacity: 0.6,
              filter: 'blur(1px)'
            }}
          />
        ))}

        {/* Parking Sign Icons with Subtle Glow */}
        {[
          { left: '15%', top: '35%', delay: '0s' },
          { left: '38%', top: '42%', delay: '1s' },
          { left: '62%', top: '38%', delay: '2s' },
          { left: '85%', top: '40%', delay: '3s' }
        ].map((sign, idx) => (
          <div
            key={`parking-sign-${idx}`}
            className="absolute text-5xl"
            style={{
              left: sign.left,
              top: sign.top,
              opacity: 0.2,
              color: '#22c55e',
              filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))',
              animation: `streetLightGlow 4s ease-in-out ${sign.delay} infinite`
            }}
          >
            🅿️
          </div>
        ))}

        {/* Faint City Skyline Silhouette */}
        <div className="absolute bottom-32 left-0 right-0 h-32 opacity-10">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <rect x="5%" y="40%" width="8%" height="60%" fill="#1e293b" />
            <rect x="15%" y="20%" width="6%" height="80%" fill="#1e293b" />
            <rect x="23%" y="35%" width="10%" height="65%" fill="#1e293b" />
            <rect x="36%" y="45%" width="7%" height="55%" fill="#1e293b" />
            <rect x="45%" y="25%" width="9%" height="75%" fill="#1e293b" />
            <rect x="58%" y="40%" width="6%" height="60%" fill="#1e293b" />
            <rect x="67%" y="30%" width="8%" height="70%" fill="#1e293b" />
            <rect x="78%" y="45%" width="7%" height="55%" fill="#1e293b" />
            <rect x="88%" y="35%" width="6%" height="65%" fill="#1e293b" />
          </svg>
        </div>

        {/* Subtle Stars */}
        {[...Array(20)].map((_, idx) => (
          <div
            key={`star-${idx}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              opacity: Math.random() * 0.15 + 0.05,
              animation: `streetLightGlow ${3 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`
            }}
          />
        ))}
      </div>
    </div>
  );
};
