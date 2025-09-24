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
  persistPosition
}: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  // Save position when it changes
  useEffect(() => {
    if (persistPosition) {
      localStorage.setItem(`draggable-${persistPosition}`, JSON.stringify(position));
    }
  }, [position, persistPosition]);

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
    
    onDragStart?.();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;

    let newX = event.clientX - dragStart.x;
    let newY = event.clientY - dragStart.y;

    // Apply bounds if specified
    if (bounds && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      
      if (bounds.left !== undefined) newX = Math.max(bounds.left, newX);
      if (bounds.right !== undefined) newX = Math.min(bounds.right - rect.width, newX);
      if (bounds.top !== undefined) newY = Math.max(bounds.top, newY);
      if (bounds.bottom !== undefined) newY = Math.min(bounds.bottom - rect.height, newY);
    } else if (typeof window !== 'undefined' && elementRef.current) {
      // Default bounds to viewport if no custom bounds provided
      const rect = elementRef.current.getBoundingClientRect();
      newX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
      newY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));
    }

    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onDrag?.(newPosition);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
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
        transform: `translate(${position.x}px, ${position.y}px)`,
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