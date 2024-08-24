import styles from "./page.module.scss";
import musics from "../../public/musics.json";
import MusicPlayer from "@/components/musicPlayer/MusicPlayer";

export type MusicData = {
  title: string;
  link: string;
};

export default function Home() {
  return (
    <main className={styles.main}>
      <header>
        <h1>IMAGINE DRAGONS</h1>
        <h2>Night Visions</h2>
      </header>

      <h4 className="musicTitleHexa"></h4>

      <MusicPlayer musics={musics} />
    </main>
  );
}
