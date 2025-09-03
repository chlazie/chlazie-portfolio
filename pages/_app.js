import "../styles/globals.css";

// components
import Layout from "../components/Layout";
import Transition from "../components/Transition";

// router
import { useRouter } from "next/router";

// framer motion
import { AnimatePresence, motion } from "framer-motion";

// next
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Layout>
      {/* Load Lordicon globally */}
      <Script
        src="https://cdn.lordicon.com/lordicon.js"
        strategy="beforeInteractive"
      />

      <AnimatePresence mode="wait">
        <motion.div key={router.route} className="h-full">
          <Transition />
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default MyApp;
