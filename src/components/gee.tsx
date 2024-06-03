import ee from "@google/earthengine";
import privatekey from "@/key.json";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import MapComponent from "./openlayer";
// Function to initialize Earth Engine and handle authentication
const runAnalysis = () => {
  return new Promise<void>((resolve, reject) => {
    ee.initialize(
      null,
      null,
      () => {
        console.log("Authenticated and initialized successfully");
        resolve();
      },
      (e: string) => {
        console.error("Initialization error: " + e);
        reject(new Error("Initialization error: " + e));
      },
      null
    );
  });
};

// Function to authenticate Earth Engine using a service account
const initializeEarthEngine = async () => {
  return new Promise<void>((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      privatekey,
      async () => {
        console.log("Authenticated successfully");
        try {
          await runAnalysis();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      (e: string) => {
        console.error("Authentication error: " + e);
        reject(new Error("Authentication error: " + e));
      }
    );
  });
};

// Next.js page component that runs Earth Engine operations
const GoogleEarthEngine = async () => {
  try {
    await initializeEarthEngine();
    console.log("Earth Engine initialized");

    const image = ee.ImageCollection("IDAHO_EPSCOR/TERRACLIMATE")
    .filterDate('2020-01-01', '2020-01-31')
    .select('tmmx')
    .mean();
     const aoi = ee.Geometry.Rectangle([73.0, 18.0, 74.0, 19.0])
     const start_date = '2022-01-01'
 const end_date = '2022-12-31'
    const image2 = ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture").filterDate(start_date, end_date).filterBounds(aoi)
    const visParams = {
      min: 0,
      max: 0.9,
      palette: ['blue', 'green', 'red']
    };
    const map = await image.visualize(visParams).getMap();

    const tileUrl = map.urlFormat;
    console.log(tileUrl);
    /*   */
    return (
      <div className="bg-white">
        <h1 className="text-xl text-zinc-800 ">
          Google Earth Engine NDVI Data
        </h1>

        <div className="w-[80%] h-[80%] border border-zinc-800 m-20">
          <MapComponent mapUrl={tileUrl} />
        </div>
        {/* */}
      </div>
    );
  } catch (error: any) {
    console.error(error);
    return (
      <div>
        <p>Error in processing NDVI data: {error.message}</p>
      </div>
    );
  }
};

export default GoogleEarthEngine;
