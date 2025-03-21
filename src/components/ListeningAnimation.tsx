import { motion } from "framer-motion";

const ListeningAnimation = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-12 h-12 bg-orange-500 rounded-full" // Made dots even BIGGER
          animate={
            isPlaying
              ? { y: [-20, 20, -20], scale: [1, 1.6, 1] } // Bigger movement
              : { y: 0, scale: 1 }
          }
          transition={{
            duration: 0.35, // Slightly faster
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default ListeningAnimation;