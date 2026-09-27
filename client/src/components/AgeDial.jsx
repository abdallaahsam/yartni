import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { openAdvice } from '../utils/viewTransition';

// "Rewind" dial: drag along the arc of years to pick the age you'd go back to.
// Young sits on the right, old on the left, so the arc reads right-to-left like a life.
const MIN_AGE = 16;
const MAX_AGE = 60;
const START_AGE = 22;
const LABELS = [18, 25, 30, 40, 50, 60];

// SVG geometry (viewBox units)
const VB_W = 320;
const VB_H = 196;
const CX = 160;
const CY = 168;
const R = 136;

const angleOf = age => ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * Math.PI; // 0 = right (young), π = left (old)
const pointAt = (angle, r = R) => [CX + r * Math.cos(angle), CY - r * Math.sin(angle)];
const ARC = `M ${CX + R} ${CY} A ${R} ${R} 0 0 0 ${CX - R} ${CY}`;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function nearestAdvice(pool, age) {
  let best = null;
  for (const a of pool) {
    // Pool is sorted by impact, so on equal distance the more impactful one wins
    if (!best || Math.abs(a.target_age - age) < Math.abs(best.target_age - age)) best = a;
  }
  return best;
}

export default function AgeDial({ onAgeChange, onSeeAge }) {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const previewRef = useRef(null);

  const [target, setTarget] = useState(START_AGE); // where the knob is heading (float while dragging)
  const [shown, setShown] = useState(START_AGE);   // where the knob is drawn (spring-animated)
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pool, setPool] = useState([]);

  const age = Math.round(target);

  useEffect(() => {
    api.getAdvices({ sort: 'top', limit: 100 })
      .then(res => setPool(res.advices || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (touched) onAgeChange?.(age);
  }, [age, touched, onAgeChange]);

  // Spring toward the target: stiff enough to feel direct, damped so it settles without bouncing
  const pos = useRef(START_AGE);
  const vel = useRef(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      pos.current = target;
      vel.current = 0;
      setShown(target);
      return undefined;
    }
    let frame;
    let last = performance.now();
    const step = now => {
      // Integrate the real elapsed time in small fixed sub-steps: stable, and on time even on slow devices
      let elapsed = Math.min(0.25, (now - last) / 1000);
      last = now;
      while (elapsed > 0) {
        const dt = Math.min(0.008, elapsed);
        elapsed -= dt;
        const accel = -240 * (pos.current - target) - 30 * vel.current;
        vel.current += accel * dt;
        pos.current += vel.current * dt;
      }
      if (Math.abs(vel.current) < 0.02 && Math.abs(pos.current - target) < 0.01) {
        pos.current = target;
        setShown(target);
        return;
      }
      setShown(pos.current);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const ageFromPointer = e => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VB_W;
    const y = ((e.clientY - rect.top) / rect.height) * VB_H;
    let angle = Math.atan2(CY - y, x - CX);
    if (angle < 0) angle = x < CX ? Math.PI : 0; // below the arc: clamp to the nearest end
    return MIN_AGE + (angle / Math.PI) * (MAX_AGE - MIN_AGE);
  };

  const handlePointerDown = e => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setTouched(true);
    setTarget(ageFromPointer(e));
  };
  const handlePointerMove = e => {
    if (dragging) setTarget(ageFromPointer(e));
  };
  const handlePointerUp = () => {
    setDragging(false);
    setTarget(t => Math.round(t)); // snap to a whole year; the spring settles it
  };

  const knobAngle = angleOf(shown);
  const [kx, ky] = pointAt(knobAngle);
  const progress = (shown - MIN_AGE) / (MAX_AGE - MIN_AGE);
  const advice = nearestAdvice(pool, age);
  const adviceUrl = advice ? `/advice/${advice.id}/${advice.slug || 'advice'}` : null;

  const openPreview = e => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openAdvice(navigate, adviceUrl, advice, previewRef.current);
  };

  return (
    <div className={`age-dial${dragging ? ' is-dragging' : ''}${focused ? ' is-focused' : ''}`}>
      <div className="age-dial-stage">
        <svg
          ref={svgRef}
          className="age-dial-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <path d={ARC} className="age-dial-track" pathLength="1" />
          <path d={ARC} className="age-dial-progress" pathLength="1" strokeDasharray={`${progress} 1`} />

          {Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i).map(a => {
            const angle = angleOf(a);
            const major = a % 5 === 0;
            const [x1, y1] = pointAt(angle, R - 16);
            const [x2, y2] = pointAt(angle, R - (major ? 26 : 21));
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className={major ? 'age-dial-tick major' : 'age-dial-tick'} />;
          })}

          {LABELS.map(a => {
            const [x, y] = pointAt(angleOf(a), R + 20);
            return (
              <text key={a} x={x} y={y} className={`age-dial-label${Math.abs(a - age) < 1 ? ' is-near' : ''}`}>{a}</text>
            );
          })}

          <circle cx={kx} cy={ky} r="22" className="age-dial-knob-ring" />
          <circle cx={kx} cy={ky} r="13" className="age-dial-knob" />
        </svg>

        <div className="age-dial-readout" aria-hidden="true">
          <span className="age-dial-age">{Math.round(shown)}</span>
          <span className="age-dial-unit">سنة</span>
        </div>

        <input
          type="range"
          className="age-dial-input"
          min={MIN_AGE}
          max={MAX_AGE}
          step="1"
          value={age}
          onChange={e => { setTouched(true); setTarget(Number(e.target.value)); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="ارجع بالزمن: اختار السن"
          aria-valuetext={`${age} سنة`}
        />
      </div>

      <p className={`age-dial-hint${touched ? ' is-hidden' : ''}`}>اسحب على القوس عشان ترجع بالزمن</p>

      {advice && (
        <div className="age-dial-preview" key={advice.id} ref={previewRef}>
          <span className="age-dial-preview-meta">
            كتبها في عمر {advice.author_age_at_post} · لسن {advice.target_age}
          </span>
          <a href={adviceUrl} onClick={openPreview} className="age-dial-preview-lesson">
            «{advice.lesson}»
          </a>
          <button type="button" className="age-dial-see-all" onClick={() => onSeeAge?.(advice.target_age)}>
            <span>شوف نصايح سن {advice.target_age}</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
