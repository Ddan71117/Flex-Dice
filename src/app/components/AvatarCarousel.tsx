import Link from 'next/link';
import React, { useState } from 'react';

const AvatarCarousel = ({ onSelectAvatar }: { onSelectAvatar: (avatar: string) => void }) => {
  const avatars = ["darth.jpg", "baby_yoda.jpg", "chewie.jpg", "mando.jpg", "r2d2.jpg", "storm_trooper.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to move to the next avatar
  const nextAvatar = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % avatars.length);
  };

  // Function to move to the previous avatar
  const prevAvatar = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + avatars.length) % avatars.length);
  };

  const handleAvatarClick = () => {
    const selectedAvatar = `/images/${avatars[currentIndex]}`;
    onSelectAvatar(selectedAvatar); // Pass the selected avatar to the parent component
  };

  return (
    <div className="avatar-carousel flex items-center justify-center space-x-4">
      {/* Previous Button */}
      <button onClick={prevAvatar} className="px-4 py-2 bg-black-300 rounded">
        Prev
      </button>

      {/* Avatar Image */}
      <div className="avatar-image-container">
        <Link href="/game" passHref>
          <img
            src={`/images/${avatars[currentIndex]}`}
            alt={`Avatar ${currentIndex}`}
            className="w-32 h-32 rounded-full cursor-pointer"
            onClick={handleAvatarClick}  // Handle avatar selection onClick
          />
        </Link>
      </div>

      {/* Next Button */}
      <button onClick={nextAvatar} className="px-4 py-2 bg-black-300 rounded">
        Next
      </button>
    </div>
  );
};

export default AvatarCarousel;