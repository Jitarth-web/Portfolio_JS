import { useEffect, useRef } from "react";

export default function FloatingSticker({
  text,
  theme = "pink",
  size = "md",
  top,
  left,
  right,
  bottom,
  rotation = 0,
  allowCenter = false,
  className = ""
}) {
  const containerRef = useRef(null);
  const floaterRef = useRef(null);
  const bodyRef = useRef(null);

  // Physics state refs
  const x = useRef(0);
  const y = useRef(0);
  const vx = useRef(0);
  const vy = useRef(0);
  const r = useRef(rotation);
  const vr = useRef(0);

  const isDragging = useRef(false);
  const initialLeft = useRef(0);
  const initialTop = useRef(0);

  // Drag tracking refs
  const dragStartMouseX = useRef(0);
  const dragStartMouseY = useRef(0);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const lastPositions = useRef([]);

  // Setup layout measurement
  const measureLayout = () => {
    const container = containerRef.current;
    if (!container) return;
    const parent = container.parentElement;
    if (!parent) return;

    const rect = container.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // Subtract current translation to get original static coordinates
    initialLeft.current = rect.left - parentRect.left - x.current;
    initialTop.current = rect.top - parentRect.top - y.current;
  };

  useEffect(() => {
    const container = containerRef.current;
    const floater = floaterRef.current;
    if (!container || !floater) return;

    // Initialize with a random ping pong ball speed
    const speed = 1.0 + Math.random() * 0.8;
    const angle = Math.random() * Math.PI * 2;
    vx.current = Math.cos(angle) * speed;
    vy.current = Math.sin(angle) * speed;
    vr.current = (Math.random() - 0.5) * 0.4;

    // Delay measurement slightly to let layouts settle after loading
    const timer = setTimeout(() => {
      measureLayout();
    }, 100);

    // Register this sticker in the global physics group
    window.__activeStickers = window.__activeStickers || [];
    const myRecord = {
      id: Math.random().toString(36).substring(2, 9),
      parent: container.parentElement,
      container: container,
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      vr: vr,
      initialLeft: initialLeft,
      initialTop: initialTop,
      isDragging: isDragging
    };
    window.__activeStickers.push(myRecord);

    let animFrameId;

    const tick = () => {
      if (!container || !floater) return;

      const parent = container.parentElement;
      if (!parent) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      if (!isDragging.current) {
        const parentW = parent.offsetWidth;
        const parentH = parent.offsetHeight;
        const stickerW = container.offsetWidth;
        const stickerH = container.offsetHeight;

        // Margins calculations based on the 1180px content width
        const cardW = (allowCenter || parentW < 1024) ? 0 : 1180;
        const leftMarginEnd = Math.max(50, (parentW - cardW) / 2);
        const rightMarginStart = Math.min(parentW - 50, (parentW + cardW) / 2);

        let minX, maxX;
        if (parentW < 1024) {
          // On mobile, allow stickers to float across the full width of the screen background
          minX = -initialLeft.current;
          maxX = parentW - initialLeft.current - stickerW;
        } else {
          // Determine if sticker belongs in left margin or right margin
          const centerOfSticker = initialLeft.current + (stickerW / 2);
          const isLeftSide = centerOfSticker < (parentW / 2);

          if (isLeftSide) {
            minX = -initialLeft.current;
            maxX = leftMarginEnd - initialLeft.current - stickerW;
            // Safety fallback
            if (maxX < minX) maxX = minX + 50;
          } else {
            minX = rightMarginStart - initialLeft.current;
            maxX = parentW - initialLeft.current - stickerW;
            // Safety fallback
            if (maxX < minX) minX = maxX - 50;
          }
        }

        const minY = -initialTop.current;
        const maxY = parentH - initialTop.current - stickerH;

        // Apply friction and speed clamps
        let currentSpeed = Math.hypot(vx.current, vy.current);
        const cruiseSpeed = 1.0;
        const friction = 0.985;

        if (currentSpeed > cruiseSpeed) {
          vx.current *= friction;
          vy.current *= friction;
        } else if (currentSpeed < cruiseSpeed && currentSpeed > 0.05) {
          const boost = cruiseSpeed / currentSpeed;
          vx.current *= boost;
          vy.current *= boost;
        }

        // Update positions
        // Update positions
        if (minX >= maxX) {
          x.current = minX;
          vx.current = 0;
        } else {
          x.current += vx.current;
        }

        if (minY >= maxY) {
          y.current = minY;
          vy.current = 0;
        } else {
          y.current += vy.current;
        }

        // Wall collisions
        let collided = false;
        if (minX < maxX) {
          if (x.current < minX) {
            x.current = minX;
            vx.current = -vx.current * 0.9;
            collided = true;
          } else if (x.current > maxX) {
            x.current = maxX;
            vx.current = -vx.current * 0.9;
            collided = true;
          }
        }

        if (minY < maxY) {
          if (y.current < minY) {
            y.current = minY;
            vy.current = -vy.current * 0.9;
            collided = true;
          } else if (y.current > maxY) {
            y.current = maxY;
            vy.current = -vy.current * 0.9;
            collided = true;
          }
        }

        // Sibling box-to-box collisions
        const activeStickers = window.__activeStickers || [];
        for (let i = 0; i < activeStickers.length; i++) {
          const other = activeStickers[i];

          // Skip self, other parents, and duplicate checks
          if (other.id === myRecord.id || other.parent !== myRecord.parent || other.id <= myRecord.id) {
            continue;
          }

          const leftA = initialLeft.current + x.current;
          const topA = initialTop.current + y.current;
          const wA = container.offsetWidth;
          const hA = container.offsetHeight;

          const leftB = other.initialLeft.current + other.x.current;
          const topB = other.initialTop.current + other.y.current;
          const wB = other.container.offsetWidth;
          const hB = other.container.offsetHeight;

          const rightA = leftA + wA;
          const bottomA = topA + hA;
          const rightB = leftB + wB;
          const bottomB = topB + hB;

          const overlapX = Math.min(rightA, rightB) - Math.max(leftA, leftB);
          const overlapY = Math.min(bottomA, bottomB) - Math.max(topA, topB);

          if (overlapX > 0 && overlapY > 0) {
            const elasticity = 0.9;

            if (overlapX < overlapY) {
              const dirX = (leftA + wA / 2) < (leftB + wB / 2) ? -1 : 1;
              const pushX = overlapX * dirX;

              if (isDragging.current) {
                if (!other.isDragging.current) other.x.current -= pushX;
              } else if (other.isDragging.current) {
                x.current += pushX;
              } else {
                x.current += pushX * 0.5;
                other.x.current -= pushX * 0.5;
              }

              if (!isDragging.current && !other.isDragging.current) {
                const temp = vx.current;
                vx.current = other.vx.current * elasticity;
                other.vx.current = temp * elasticity;
              } else if (isDragging.current && !other.isDragging.current) {
                other.vx.current = -vx.current * elasticity;
              } else if (!isDragging.current && other.isDragging.current) {
                vx.current = -other.vx.current * elasticity;
              }
            } else {
              const dirY = (topA + hA / 2) < (topB + hB / 2) ? -1 : 1;
              const pushY = overlapY * dirY;

              if (isDragging.current) {
                if (!other.isDragging.current) other.y.current -= pushY;
              } else if (other.isDragging.current) {
                y.current += pushY;
              } else {
                y.current += pushY * 0.5;
                other.y.current -= pushY * 0.5;
              }

              if (!isDragging.current && !other.isDragging.current) {
                const temp = vy.current;
                vy.current = other.vy.current * elasticity;
                other.vy.current = temp * elasticity;
              } else if (isDragging.current && !other.isDragging.current) {
                other.vy.current = -vy.current * elasticity;
              } else if (!isDragging.current && other.isDragging.current) {
                vy.current = -other.vy.current * elasticity;
              }
            }

            vr.current = (Math.random() - 0.5) * 1.8;
            other.vr.current = (Math.random() - 0.5) * 1.8;
          }
        }

        // Apply rotation wiggles on impact
        if (collided) {
          vr.current = (Math.random() - 0.5) * 1.5;
        }

        r.current += vr.current;

        const angleDiff = rotation - r.current;
        vr.current += angleDiff * 0.015;
        vr.current *= 0.95;

        // Render physics coordinates
        container.style.transform = `translate3d(${x.current}px, ${y.current}px, 0)`;
        floater.style.transform = `rotate(${r.current}deg)`;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    const handleResize = () => {
      measureLayout();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      // Remove registration from group
      window.__activeStickers = (window.__activeStickers || []).filter(item => item.id !== myRecord.id);
    };
  }, [rotation]);

  // Drag interaction handlers
  const startDrag = (clientX, clientY) => {
    isDragging.current = true;
    measureLayout();

    dragStartMouseX.current = clientX;
    dragStartMouseY.current = clientY;
    dragStartX.current = x.current;
    dragStartY.current = y.current;

    lastPositions.current = [{ x: x.current, y: y.current, t: Date.now() }];
  };

  const moveDrag = (clientX, clientY) => {
    if (!isDragging.current || !containerRef.current) return;

    const dx = clientX - dragStartMouseX.current;
    const dy = clientY - dragStartMouseY.current;

    x.current = dragStartX.current + dx;
    y.current = dragStartY.current + dy;

    // Apply strict boundaries even during manual dragging
    const parent = containerRef.current.parentElement;
    if (parent) {
      const parentW = parent.offsetWidth;
      const parentH = parent.offsetHeight;
      const stickerW = containerRef.current.offsetWidth;
      const stickerH = containerRef.current.offsetHeight;

      const cardW = (allowCenter || parentW < 1024) ? 0 : 1180;
      const leftMarginEnd = Math.max(50, (parentW - cardW) / 2);
      const rightMarginStart = Math.min(parentW - 50, (parentW + cardW) / 2);

      let minX, maxX;
      if (parentW < 1024) {
        // On mobile, allow stickers to float across the full width of the screen background
        minX = -initialLeft.current;
        maxX = parentW - initialLeft.current - stickerW;
      } else {
        const centerOfSticker = initialLeft.current + (stickerW / 2);
        const isLeftSide = centerOfSticker < (parentW / 2);

        if (isLeftSide) {
          minX = -initialLeft.current;
          maxX = leftMarginEnd - initialLeft.current - stickerW;
          if (maxX < minX) maxX = minX + 50;
        } else {
          minX = rightMarginStart - initialLeft.current;
          maxX = parentW - initialLeft.current - stickerW;
          if (maxX < minX) minX = maxX - 50;
        }
      }

      const minY = -initialTop.current;
      const maxY = parentH - initialTop.current - stickerH;

      if (minX >= maxX) {
        x.current = minX;
      } else {
        if (x.current < minX) x.current = minX;
        if (x.current > maxX) x.current = maxX;
      }

      if (minY >= maxY) {
        y.current = minY;
      } else {
        if (y.current < minY) y.current = minY;
        if (y.current > maxY) y.current = maxY;
      }
    }

    containerRef.current.style.transform = `translate3d(${x.current}px, ${y.current}px, 0)`;

    // Keep history of last few points to calculate velocity on release
    lastPositions.current.push({ x: x.current, y: y.current, t: Date.now() });
    if (lastPositions.current.length > 5) {
      lastPositions.current.shift();
    }
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Calculate release flinging velocity
    if (lastPositions.current.length >= 2) {
      const p1 = lastPositions.current[0];
      const p2 = lastPositions.current[lastPositions.current.length - 1];
      const dt = p2.t - p1.t || 1;

      vx.current = ((p2.x - p1.x) / dt) * 16.67;
      vy.current = ((p2.y - p1.y) / dt) * 16.67;

      const maxSpeed = 22;
      const currentSpeed = Math.hypot(vx.current, vy.current);
      if (currentSpeed > maxSpeed) {
        vx.current = (vx.current / currentSpeed) * maxSpeed;
        vy.current = (vy.current / currentSpeed) * maxSpeed;
      }
    }
  };

  // Mouse event wrappers
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);

    const onMouseMove = (moveEvt) => {
      moveDrag(moveEvt.clientX, moveEvt.clientY);
    };

    const onMouseUp = () => {
      endDrag();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Touch event wrappers
  const onTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);

    const onTouchMove = (moveEvt) => {
      if (isDragging.current) {
        moveEvt.preventDefault();
        const t = moveEvt.touches[0];
        moveDrag(t.clientX, t.clientY);
      }
    };

    const onTouchEnd = () => {
      endDrag();
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  };

  const style = {
    top,
    left,
    right,
    bottom,
  };

  return (
    <div
      ref={containerRef}
      className={`sticker-container ${className}`}
      style={style}
    >
      <div 
        ref={floaterRef} 
        className="sticker-floater"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          ref={bodyRef}
          className={`sticker-body sticker-theme-${theme} sticker-size-${size}`}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {text}
        </div>
      </div>
    </div>
  );
}
