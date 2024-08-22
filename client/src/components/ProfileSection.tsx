import React from "react";

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  navId: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  items,
  renderItem,
  setCurrentPage,
  navId,
}) => {
  return (
    <section className="bg-spotify-grey p-6 rounded-lg relative">
      <div className="flex items-center justify-between">
        <h2 className="lg:text-3xl md:text-2xl text-lg font-bold mb-4 flex items-center">
          {icon} {title}
        </h2>

        <button
          onClick={() => {
            setCurrentPage(navId);
          }}
          className="right-7 top-8 underline text-gray-500 hover:text-spotify-green"
        >
          View all
        </button>
      </div>
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
