import ListeningAnimation from "@/components/ListeningAnimation";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";

const socket = new WebSocket("wss://7dde-2406-7400-63-f587-4c9d-d5c2-d996-6ac9.ngrok-free.app");

export default function ReceiverPage() {
  const [message, setMessage] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const sendSpeakRequest = async (speakMessage: string) => {
    const requestData = {
      "model_id": "sonic-2",
      "transcript": speakMessage,
      "voice": {
        "mode": "id",
        "id": "7975ff3e-1794-42f6-bbe3-1dacfba3b8cc",
        "__experimental_controls": {
          "speed": 0,
          "emotion": []
        }
      },
      "output_format": {
        "container": "wav",
        "encoding": "pcm_f32le",
        "sample_rate": 44100
      },
      "language": "en"
    }

    try {
      const response = await fetch("https://api.cartesia.ai/tts/bytes", {
        method: "POST",
        headers: {
          "Cartesia-Version": "2024-06-10",
          "X-API-Key": "sk_car__pV7GolCuV3nskiArg2Bc",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      // Convert response to a blob (audio file)
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      setIsPlaying(true)
      await audio.play();
      setIsPlaying(false)
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  useEffect(() => {
    // Unlock autoplay by playing silent audio on first user interaction
    const unlockAudio = () => {
      console.log("unlock")
      const audio = new Audio();
      audio.muted = true;
      audio.play().catch(() => { }); // Ensure no errors
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio); // Attach listener

    socket.onmessage = async (event) => {
      setMessage(event.data)
      sendSpeakRequest("Hey Google")
      await new Promise(resolve => setTimeout(resolve, 1500));
      sendSpeakRequest(event.data)
    };
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        
        <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm">
          <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            {message}
          </span>
        </div>

       <ListeningAnimation isPlaying={isPlaying} />

      </section>
    </DefaultLayout>
  );
}
