
import React, { useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { UserRole, JobStatus } from '../types';
import L from 'leaflet';

const MapPage: React.FC = () => {
  const { jobs, user } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const initialView: [number, number] = user?.region === 'London' ? [51.5074, -0.1278] : 
                         user?.region === 'Manchester' ? [53.4808, -2.2426] : [54.5, -3.5];
    const zoom = user?.role === UserRole.FIELD_AGENT ? 13 : 6;

    if (mapRef.current) {
      mapRef.current.remove();
    }

    mapRef.current = L.map(mapContainerRef.current).setView(initialView, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Filter jobs by region if agent
    const visibleJobs = user?.role === UserRole.FIELD_AGENT 
      ? jobs.filter(j => j.assignedAgentId && j.region === user.region)
      : jobs;

    visibleJobs.forEach(job => {
      const color = job.status === JobStatus.JOB_COMPLETED || job.status === JobStatus.BACKEND_NOTIFIED ? '#10B981' :
                    job.status === JobStatus.JOB_IN_PROGRESS ? '#F59E0B' :
                    job.status === JobStatus.ENGINEER_ASSIGNED ? '#3B82F6' :
                    job.status === JobStatus.SITE_CHECK_PENDING ? '#6B7280' :
                    job.status === JobStatus.WAITING_FOR_PROCUREMENT ? '#EF4444' : '#DC2626';

      const marker = L.circleMarker(job.coordinates, {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(mapRef.current!);

      marker.bindPopup(`
        <div class="p-2">
          <div class="font-bold text-[#550065] mb-1">${job.id}</div>
          <div class="text-xs text-gray-800 mb-2 font-medium">${job.customerName}</div>
          <div class="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-800 border inline-block font-semibold">
            ${job.status.replace(/_/g, ' ')}
          </div>
        </div>
      `);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [jobs, user]);

  return (
    <div className="h-[calc(100vh-160px)] relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-white p-4 rounded-xl shadow-xl border border-gray-100 space-y-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{user?.role === UserRole.FIELD_AGENT ? 'My Jobs' : 'Asset Legend'}</h4>
        {user?.role === UserRole.FIELD_AGENT ? (
          <>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Assigned</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              <span>Service Active</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-[#550065]"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Awaiting Stock</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-gray-500"></span>
              <span>Pre-Survey</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-800 font-medium">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>Survey Blocked</span>
            </div>
          </>
        )}
      </div>

      {/* Region Status Overlay */}
      <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-gray-100">
        <span className="text-sm font-semibold text-gray-800">Operational Region: <span className="text-[#550065] font-bold">{user?.region}</span></span>
      </div>
    </div>
  );
};

export default MapPage;
