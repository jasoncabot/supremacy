import React from 'react';

interface ImagePair {
  foreground: string; // URL or path to foreground image
  background: string; // URL or path to background image
}

interface MiniCardViewProps {
  imagePairs: ImagePair[];
  displayText: string;
}

const MiniCardView: React.FC<MiniCardViewProps> = ({ imagePairs, displayText }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-2">
        {imagePairs.map((pair, index) => (
          <div
            key={index}
            className="relative h-[30px] w-[70px] rounded overflow-hidden"
            style={{
              backgroundImage: `url(${pair.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <img
              src={pair.foreground}
              alt={`Foreground ${index + 1}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
      {displayText && <span className="mt-2 text-sm text-slate-400">{displayText}</span>}
    </div>
  );
};

export default MiniCardView;
