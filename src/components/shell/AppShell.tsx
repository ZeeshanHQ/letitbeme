import React, { useState } from 'react';
import { AppNavigationTab, Profile } from '../../types';
import { SidebarNav } from './SidebarNav';
import { TopHeader } from './TopHeader';
import { HomeFeed } from '../placeholders/HomeFeed';
import { PeopleWorkspace } from '../people/PeopleWorkspace';
import { MeetWorkspace } from '../meet/MeetWorkspace';
import { MemberProfileView } from '../profile/MemberProfileView';
import { UniversePlaceholder } from '../placeholders/UniversePlaceholder';
import { MessagesPlaceholder } from '../placeholders/MessagesPlaceholder';
import { AiWorkspacePlaceholder } from '../placeholders/AiWorkspacePlaceholder';
import { ConnectionRequestsModal } from '../people/ConnectionRequestsModal';

export const AppShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppNavigationTab>('home');
  const [isProfileView, setIsProfileView] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [directMeetTarget, setDirectMeetTarget] = useState<Profile | null>(null);

  const handleSelectTab = (tab: AppNavigationTab) => {
    setIsProfileView(false);
    setActiveTab(tab);
  };

  const handleDirectMeet = (member: Profile) => {
    setDirectMeetTarget(member);
    setIsProfileView(false);
    setActiveTab('meet');
  };

  return (
    <div className="flex h-screen w-screen bg-[#070A10] text-slate-100 overflow-hidden font-sans selection:bg-blue-500/25 selection:text-white">
      {/* Executive Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenProfile={() => setIsProfileView(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#070A10]">
        {/* Top Header */}
        <TopHeader
          onStartMeeting={() => {
            setDirectMeetTarget(null);
            handleSelectTab('meet');
          }}
          onOpenRequests={() => setIsRequestsModalOpen(true)}
          onOpenProfile={() => setIsProfileView(true)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto relative">
          {isProfileView ? (
            <MemberProfileView />
          ) : activeTab === 'home' ? (
            <HomeFeed onNavigate={handleSelectTab} />
          ) : activeTab === 'people' ? (
            <PeopleWorkspace onDirectMeet={handleDirectMeet} />
          ) : activeTab === 'meet' ? (
            <MeetWorkspace initialTargetMember={directMeetTarget} />
          ) : activeTab === 'universe' ? (
            <UniversePlaceholder />
          ) : activeTab === 'messages' ? (
            <MessagesPlaceholder />
          ) : activeTab === 'ai' ? (
            <AiWorkspacePlaceholder />
          ) : (
            <HomeFeed onNavigate={handleSelectTab} />
          )}
        </main>
      </div>

      {/* Connection Requests Manager Modal */}
      <ConnectionRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />
    </div>
  );
};
