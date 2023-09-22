import { useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

declare global {
  interface Window {
    myAPI: {
      closeBrowserView: () => Promise<void>;
      openBrowserView: (message: {
        teamId: string;
        channelId: string;
        messageId: string;
      }) => void;
      getAssetPath: (assetName: string) => Promise<string>;
      sendMessage: (message: any) => void;
      addMessageListener: (
        listener: (event: any, ...args: any[]) => void
      ) => void;
      removeMessageListener: (
        listener: (event: any, ...args: any[]) => void
      ) => void;
    };
  }
}

const IndexPage = () => {
  const router = useRouter();
  const counter = router.query.counter;
  console.log(router);
  console.log(router.query.counter);

  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to 'message' channel
    window.myAPI.addMessageListener(handleMessage);

    return () => {
      window.myAPI.removeMessageListener(handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    window.myAPI.sendMessage("hi from next");
  };

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <h1>{counter ? counter : "Hello Next.js 👋"}</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <p>
        <Link href="/about">About</Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
