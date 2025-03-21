import { Tabs, Tab, Card, CardBody, Button, Slider, Textarea, Select, SelectItem } from "@heroui/react";
import { Switch } from "@heroui/switch";
import DefaultLayout from "@/layouts/default";
import { useState } from "react";

export default function IndexPage() {
  const [customCommand, setCustomCommand] = useState("");
  const [speakText, setSpeakText] = useState("");
  const [translateText, setTranslateText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  type Language = "hi" | "kn";
  const [selectedLang, setSelectedLang] = useState<Language>("hi");

  const [isTvOn, setIsTvOn] = useState(false);
  const [isAcOn, setIsAcOn] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);

  const sendWebSocketMessage = (message: string) => {
    const socket = new WebSocket("wss://7dde-2406-7400-63-f587-4c9d-d5c2-d996-6ac9.ngrok-free.app");
    socket.onopen = () => socket.send(message);
  };

  const onVolumeAdjust = (value: number | number[]) => {
    const sliderValue = Array.isArray(value) ? value[0] : value;
    sendWebSocketMessage("Set volume to " + sliderValue+" percent");
  }

  const onTvStatusChange = (status: boolean) => {
    setIsTvOn(status)
    sendWebSocketMessage("Switch " + (status ? "on " : "off ") + "TV")
  }

  const onAcStatusChange = (status: boolean) => {
    setIsAcOn(status)
    sendWebSocketMessage("Switch " + (status ? "on " : "off ") + "AC")
  }

  const onLightStatusChange = (status: boolean) => {
    setIsLightOn(status)
    sendWebSocketMessage("Switch " + (status ? "on " : "off ") + "light")
  }

  const sendSpeakRequest = async () => {
    const requestData = {
      "model_id": "sonic-2",
      "transcript": speakText,
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
      audio.play();
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const translations = {
    hi: {
      text: "आपका नाम क्या है?", // Mock translation for Hindi
      audio: "/hi.wav", // Mocked Hindi music file
    },
    kn: {
      text: "ನಿಮ್ಮ ಹೆಸರೇನು?", // Mock translation for Kannada
      audio: "/kn.wav", // Mocked Kannada music file
    },
  };

  const sendTranslateRequest = async () => {
    if (!selectedLang) {
      alert("Please select a language.");
      return;
    }

    const translated = translations[selectedLang as Language];
    //const translated = translations[selectedLang];

    if (translated) {
      setTranslatedText(translated.text);

      // Play the corresponding audio
      const audio = new Audio(translated.audio);
      audio.play();
    } else {
      alert("Translation not available.");
    }
  };

  return (
    <DefaultLayout>
      <section className="flex w-full md:w-1/2 flex-col">
        <Tabs aria-label="Options" className="">
          <Tab key="devices" title="Devices" className="w-full">
            <Card className="p-4 bg-gray-900">
              <CardBody className="">
                <div className="flex flex-col gap-4">
                  <Switch isSelected={isTvOn} onValueChange={onTvStatusChange}>
                    <p className="text-white">TV</p>
                  </Switch>

                  <Switch isSelected={isLightOn} onValueChange={onLightStatusChange}>
                    <p className="text-white">Living Room Lights</p>
                  </Switch>

                  <Switch isSelected={isAcOn} onValueChange={onAcStatusChange}>
                    <p className="text-white">Living Room AC</p>
                  </Switch>

                  <Slider
                    className="max-w-md text-white"
                    defaultValue={30}
                    label="Volume"
                    color={"warning"}
                    onChangeEnd={onVolumeAdjust}
                    maxValue={100}
                    minValue={0}
                    step={10}
                  />

                  <div className="mt-4 flex flex-col">
                    <p className="text-white mb-2">Talk to your Voice Assistant!</p>
                    <Textarea type="text" value={customCommand} onChange={(e) => setCustomCommand(e.target.value)}
                      placeholder="Enter command..." />
                    <Button onPress={() => sendWebSocketMessage(customCommand)}
                      className="bg-orange-600 hover:bg-orange-700 mt-4">
                      Send
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="music" title="Speak">
            <Card className="p-4 bg-gray-900">
              <CardBody>
                <Textarea value={speakText} onChange={(e) => setSpeakText(e.target.value)}
                  placeholder="Type to speak..." />
                <Button onPress={sendSpeakRequest} className="mt-2 bg-orange-600 hover:bg-orange-700">
                  Submit
                </Button>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="videos" title="Translate">
            <Card className="p-4 bg-gray-900">
              <CardBody>
                <Textarea value={translateText} onChange={(e) => setTranslateText(e.target.value)}
                  placeholder="Type to translate..." />
                <Select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value as Language)}
                  className="mt-2">
                  <SelectItem key="hi">Hindi</SelectItem>
                  <SelectItem key="kn">Kannada</SelectItem>
                </Select>
                <Button onPress={sendTranslateRequest} className="mt-2 bg-orange-600 hover:bg-orange-700">
                  Translate
                </Button>
                {translatedText && (
                  <div className="mt-4 p-2 bg-gray-800 text-white rounded-lg">{translatedText}</div>
                )}
              </CardBody>
            </Card>
          </Tab>

        </Tabs>
      </section>
    </DefaultLayout>
  );
}
