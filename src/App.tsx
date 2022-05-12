import "./styles.css";
import { useEffect, useLayoutEffect } from "react";
import { fromEvent, filter, pipe, map } from "rxjs";

const tileElementFilter = () => {
  return pipe(
    filter((event: Event) => {
      const target = event.target as HTMLButtonElement;
      if (target && target.className?.includes("tile")) {
        return true;
      }
      return false;
    })
  );
};

const hotKeyFilter = (hotKeys: Object) => {
  return pipe(
    filter((event: KeyboardEvent) => {
      const { code: keyPressed } = event;
      if (keyPressed in hotKeys) {
        return true;
      }
      return false;
    })
  );
};

const HOT_KEY_MAPPING: { [name: string]: string } = {
  KeyW: "yellow",
  KeyE: "blue",
  KeyS: "red",
  KeyD: "green"
};

const tileClicks$ = fromEvent(document, "click").pipe(tileElementFilter());
const hotKeyDown$ = fromEvent(document, "keyup").pipe(
  //@ts-ignore
  hotKeyFilter(HOT_KEY_MAPPING),
  map((event) => event.code)
);

const SimonAudio = () => {
  useLayoutEffect(() => {
    const yellowAudio = document.querySelector(
      "[data-key=yellow-audio]"
    ) as HTMLAudioElement;
    const blueAudio = document.querySelector(
      "[data-key=blue-audio]"
    ) as HTMLAudioElement;
    const redAudio = document.querySelector(
      "[data-key=red-audio]"
    ) as HTMLAudioElement;
    const greenAudio = document.querySelector(
      "[data-key=green-audio]"
    ) as HTMLAudioElement;

    const hotKeySubscription = hotKeyDown$.subscribe((keyPressed) => {
      console.log("pressed:: ", keyPressed);
      //@ts-ignore
      switch (HOT_KEY_MAPPING[keyPressed]) {
        case "yellow":
          console.log("yellow pressed", yellowAudio);
          yellowAudio.currentTime = 0;
          yellowAudio.play();
          break;
        case "blue":
          blueAudio.currentTime = 0;
          blueAudio.play();
          break;
        case "red":
          redAudio.currentTime = 0;
          redAudio.play();
          break;
        case "green":
          greenAudio.currentTime = 0;
          greenAudio.play();
          break;
        default:
          break;
      }
    });

    return () => hotKeySubscription.unsubscribe();
  }, []);
  return (
    <>
      <audio
        data-key="yellow-audio"
        src="./simon_sounds/simon_beep.wav"
      ></audio>
      <audio data-key="blue-audio" src="./simon_sounds/simon_boop.wav"></audio>
      <audio data-key="red-audio" src="./simon_sounds/simon_bop.wav"></audio>
      <audio
        data-key="green-audio"
        src="./simon_sounds/simon_blorp.wav"
      ></audio>
    </>
  );
};

export default function App() {
  useEffect(() => {
    const clickSubscription = tileClicks$.subscribe(console.log);
    return () => clickSubscription.unsubscribe();
  }, []);

  // useEffect(() => {
  //   const keyDownSubscription = hotKeyDown$.subscribe(console.log);
  //   return () => keyDownSubscription.unsubscribe();
  // }, []);

  return (
    <>
      <SimonAudio />
      <div className="App">
        <h1>Simon</h1>
        <h2>Start editing to see some magic happen!</h2>
        <div className="board">
          <button className="tile yellow-tile">Yellow</button>
          <button className="tile blue-tile">Blue</button>
          <button className="tile red-tile">Red</button>
          <button className="tile green-tile">Green</button>
          <button className="tile center-tile">Simon</button>
        </div>
      </div>
    </>
  );
}
