"use client"

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableProps {
  children: ReactNode;
  className?: string;
  dragHandleClassName?: string;
  bounds?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  defaultPosition?: { x: number; y: number };
  onDragStart?: () => void;
  onDrag?: (position: { x: number; y: number }) => void;
  onDragEnd?: (position: { x: number; y: number }) => void;
  disabled?: boolean;
  persistPosition?: string; // localStorage key for persisting position
  // Optional external offset applied on top of the internal position (not persisted)
  externalOffset?: { x?: number; y?: number };
}

export function Draggable({
  children,
  className,
  dragHandleClassName,
  bounds,
  defaultPosition = { x: 0, y: 0 },
  onDragStart,
  onDrag,
  onDragEnd,
  disabled = false,
  persistPosition,
  externalOffset
}: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startRect, setStartRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Load persisted position on mount
  useEffect(() => {
    if (persistPosition) {
      const saved = localStorage.getItem(`draggable-${persistPosition}`);
      if (saved) {
        try {
          const parsedPosition = JSON.parse(saved);
          setPosition(parsedPosition);
        } catch (error) {
          console.warn('Failed to parse saved position:', error);
        }
      }
    }
  }, [persistPosition]);

  // Do not auto-save on mount; we'll persist only after user drags

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    
    // Only allow dragging from drag handle or if no specific handle is set
    const target = event.target as HTMLElement;
    const isDragHandle = !dragHandleClassName || target.closest(`.${dragHandleClassName}`);
    
    if (!isDragHandle) return;
    
    event.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y
    });
    setStartPosition({ x: position.x, y: position.y });
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setStartRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    }
    hasDraggedRef.current = false;
    
    onDragStart?.();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;

  // Compute new transform target based on initial pointer offset
  const rectNow = elementRef.current?.getBoundingClientRect();
  const base = startRect || rectNow;
  if (!base) return;

  const newX = event.clientX - dragStart.x;
  const newY = event.clientY - dragStart.y;

  // Desired absolute left/top derived from base position + delta transform
  let desiredLeft = base.left + (newX - startPosition.x);
  let desiredTop = base.top + (newY - startPosition.y);

    // Apply bounds if specified
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const viewportRight = typeof window !== 'undefined' ? window.innerWidth : rect.width;
      const viewportBottom = typeof window !== 'undefined' ? window.innerHeight : rect.height;

      const minLeft = bounds?.left ?? 0;
      const maxLeft = (bounds?.right ?? viewportRight) - rect.width;
      const minTop = bounds?.top ?? 0;
      const maxTop = (bounds?.bottom ?? viewportBottom) - rect.height;

      desiredLeft = Math.max(minLeft, Math.min(maxLeft, desiredLeft));
      desiredTop = Math.max(minTop, Math.min(maxTop, desiredTop));
    }

  // Convert clamped absolute target back into local transform position
  const clampedX = startPosition.x + (desiredLeft - (startRect?.left ?? 0));
  const clampedY = startPosition.y + (desiredTop - (startRect?.top ?? 0));

  const newPosition = { x: clampedX, y: clampedY };
    setPosition(newPosition);
    hasDraggedRef.current = true;
    onDrag?.(newPosition);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    // Persist only if user actually moved the window
    if (persistPosition && hasDraggedRef.current) {
      try {
        localStorage.setItem(`draggable-${persistPosition}`, JSON.stringify(position));
        localStorage.setItem(`draggable-${persistPosition}-manuallyPlaced`, 'true');
      } catch {}
    }
    onDragEnd?.(position);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'move';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, dragStart, position, bounds]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'absolute user-select-none',
        isDragging && 'z-50',
        className
      )}
      style={{
        transform: `translate(${(externalOffset?.x ?? 0) + position.x}px, ${(externalOffset?.y ?? 0) + position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}

// Drag handle component that can be used inside draggable content
export function DragHandle({ className }: { className?: string }) {
  return (
    <div className={cn('drag-handle cursor-move flex items-center justify-center p-1', className)}>
      <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
    </div>
  );
}