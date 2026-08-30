import React from 'react';
import type { UserProfile } from '../../engine/types';
import { NeetCodeStyleRoadmapDAG } from './NeetCodeStyleRoadmapDAG';

interface RoadmapViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLaunchAssessment: (skillId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  onUpdateProfile,
  onLaunchAssessment
}) => {
  return (
    <div className="w-full h-full text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Single, Clean, Interactive Flowchart Roadmap */}
      <NeetCodeStyleRoadmapDAG
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        onLaunchAssessment={onLaunchAssessment}
      />
    </div>
  );
};
