import "../styles/globals.css";
import { UberProvider } from "../context/uberContext";
import "mapbox-gl/dist/mapbox-gl.css";
//https://uber-blockchain-clone.sanity.studio/ -> deployed url

function MyApp({ Component, pageProps }) {
  return (
    <UberProvider>
      <Component {...pageProps} />
    </UberProvider>
  );
}

export default MyApp;
