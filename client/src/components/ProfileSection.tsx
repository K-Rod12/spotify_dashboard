import React from "react";

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon, items, renderItem }) => {
  return (
    <section className="bg-spotify-grey p-6 rounded-lg">
      <h2 className="lg:text-3xl md:text-2xl text-lg font-bold mb-4 flex items-center">
        {icon} {title}
      </h2>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="mb-2 py-1 flex items-center">
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProfileSection;
