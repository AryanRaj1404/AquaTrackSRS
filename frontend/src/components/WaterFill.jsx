export default function WaterFill({ level = 28 }) {
  return (
    <>
      <div
        className="water"
        style={{
          height: `${level}%`,
        }}
      >
        <div className="water-body" />

        <svg
          className="wave wave-back"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="
            M0,60
            C150,10 350,100 600,60
            C850,20 1050,90 1200,60
            L1200,120
            L0,120
            Z
          "
          />
        </svg>

        <svg
          className="wave wave-front"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="
            M0,45
            C120,90 320,0 600,45
            C850,90 1050,0 1200,45
            L1200,120
            L0,120
            Z
          "
          />
        </svg>

        <div className="shine" />

        <div className="bubble b1" />
        <div className="bubble b2" />
        <div className="bubble b3" />
      </div>

      <style>{`

.water{

    position:absolute;

    left:0;
    right:0;
    bottom:0;

    overflow:hidden;

    z-index:0;

    pointer-events:none;

}

.water-body{

    position:absolute;

    inset:0;

    background:
    linear-gradient(
        to bottom,
        rgba(180,235,255,.05),
        rgba(120,210,255,.08),
        rgba(7,129,165,.14)
    );

}

.wave{

    position:absolute;

    left:-50%;

    width:200%;

    height:42px;

    top:-22px;

}

.wave path{

    fill:rgba(170,235,255,.35);

}

.wave-front{

    animation: waveFront 2.4s ease-in-out infinite;
}

.wave-back{

    opacity:.18;

    transform:translateY(4px);

    animation: waveBack 3.8s ease-in-out infinite reverse;
}

.shine{

    position:absolute;

    top:0;

    width:100%;

    height:18px;

    background:
        linear-gradient(
            rgba(255,255,255,.65),
            transparent
        );

    opacity:.22;

}

.bubble{

    position:absolute;

    bottom:12px;

    border-radius:50%;

    background:rgba(255,255,255,.12);
    border:1px solid rgba(255,255,255,.25);

    animation:rise linear infinite;

}

.b1{

    width:7px;
    height:7px;

    left:20%;

    animation-duration:6s;

}

.b2{

    width:5px;
    height:5px;

    left:58%;

    animation-duration:8s;

}

.b3{

    width:9px;
    height:9px;

    left:82%;

    animation-duration:5s;

}

@keyframes waveFront{

    0%{

        transform:
            translateX(0%)
            translateY(0px);

    }

    25%{

        transform:
            translateX(6%)
            translateY(-2px);

    }

    50%{

        transform:
            translateX(12%)
            translateY(1px);

    }

    75%{

        transform:
            translateX(18%)
            translateY(-1px);

    }

    100%{

        transform:
            translateX(24%)
            translateY(0px);

    }

}

@keyframes waveBack{

    0%{

        transform:
            translateX(0%)
            translateY(4px);

    }

    50%{

        transform:
            translateX(-12%)
            translateY(2px);

    }

    100%{

        transform:
            translateX(-24%)
            translateY(4px);

    }

}

@keyframes rise{

    from{

        transform:
            translateY(0)
            scale(.6);

        opacity:0;

    }

    20%{

        opacity:.55;

    }

    to{

        transform:
            translateY(-90px)
            scale(1);

        opacity:0;

    }

}

      `}</style>
    </>
  );
}