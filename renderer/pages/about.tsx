import Link from "next/link";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

const AboutPage = () => {
  const router = useRouter();
  console.log(router.query);
  const handleClick = () => {
    router.push("/?counter=10", "/", { shallow: true });
  };
  return (
    <Layout title="About | Next.js + TypeScript + Electron Example">
      <h1 onClick={handleClick}>About</h1>
      <p>This is the about page</p>
      <p>
        <Link href="/">Go home</Link>
      </p>
    </Layout>
  );
};

export default AboutPage;
