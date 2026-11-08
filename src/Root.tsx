import { Composition, staticFile } from "remotion";
import { MainVideo } from "./MainVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="MainVideo"
      component={MainVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        audioPath: staticFile("audio/voice.mp3"),
      }}
    />
  </>
);