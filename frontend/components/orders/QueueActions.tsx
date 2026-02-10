import React from 'react';

interface QueueActionsProps {
  orderId: number;
  onView: () => void;
}

export default function QueueActions({ orderId, onView }: QueueActionsProps) {
  return (
    <button
      onClick={onView}
      className="px-4 py-2 text-sm bg-blue-900 text-white rounded hover:bg-blue-800 transition"
    >
      View
    </button>
  );
}
