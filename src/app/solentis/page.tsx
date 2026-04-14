export default function SolentisPost() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      {/* Instagram post frame: 1080×1080 rendered at 540×540 for screen */}
      <div
        style={{
          width: 540,
          height: 540,
          background: "linear-gradient(145deg, #000000 0%, #020b18 40%, #030f24 70%, #040d1e 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
          flexShrink: 0,
        }}
      >
        {/* Ambient glow blobs */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,210,200,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,100,255,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "32px 36px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          {/* Top: Logo */}
          <img
            src="/solentis-logo.png"
            alt="Solentis Logo"
            style={{
              height: 56,
              width: "auto",
              alignSelf: "flex-start",
              filter: "brightness(0) invert(1)",
            }}
          />

          {/* Center content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
            {/* Headline */}
            <div>
              <h1
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                What if your business
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #ffffff 0%, #a8f0ed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  could run itself?
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p
              style={{
                fontSize: 11.5,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                margin: 0,
                fontWeight: 400,
                maxWidth: 380,
              }}
            >
              Solentis builds AI-powered agents that automate operations,
              deliver real-time insights, and help you scale without complexity.
            </p>

            {/* Divider */}
            <div
              style={{
                width: 36,
                height: 2,
                background: "linear-gradient(90deg, #00d4c8, transparent)",
                borderRadius: 2,
              }}
            />

            {/* Bullet points */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Automate repetitive work",
                "Make smarter decisions with real-time data",
                "Scale without hiring more people",
              ].map((point, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "rgba(0,212,200,0.12)",
                      border: "1px solid rgba(0,212,200,0.35)",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.2 5.7L6.5 2" stroke="#00d4c8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.82)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom: value line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              Build your AI workforce.
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "rgba(0,212,200,0.6)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              solentis.ai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
