// importing library
import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import './App.css';
import { drawRect } from './labelmap';
import Navbar from './components/Navbar';
import Images from './components/Images';
import Sign from './assets/sign-1.jpeg';
import DevLogo from './assets/Developer.png';
import { useState } from 'react';
import Loading from './components/Loading';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoWidthRef = useRef(640); // Set an initial value here
  const videoHeightRef = useRef(480); // Set an initial value here

  // function for hand detections
  const detect = async (net) => {
    // checking if camera is accessible
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // for passing to Loading component
      setLoading(false);

      // for unmounting Loading component
      setTimeout(() => {
        setIsLoading(false);
      }, 12000);
      // fetching video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Update the refs with the new videoWidth and videoHeight
      videoWidthRef.current = videoWidth;
      videoHeightRef.current = videoHeight;

      // configuring video dimensions
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // video canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Making Detections
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast('int32');
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      // console.log(await obj[2].array())

      // defining where objects are coming from
      const boxes = await obj[0].array(); // boxes
      const classes = await obj[6].array(); // classes
      const scores = await obj[4].array(); // threshold

      const ctx = canvasRef.current.getContext('2d');

      // using requestAnimationFrame method for smother drawing for detections
      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx
        );
      });
      // console.log(obj);
      // Cleaning memory
      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    // Loading model
    const runMobnet = async () => {
      // getting model link from cloud
      const net = await tf.loadGraphModel(
        'https://tfjshandsignmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json'
      );

      // Detecting hands
      setInterval(() => {
        detect(net); // fuction for making detections using webcam
      }, 16.7); // detections frequency
    };
    runMobnet();
  }, []);

  return (
    <>
      <div className="App">
        <Navbar />
        <div className="main-container scrolbar">
          <div className="flex flex-wrap justify-center align-center h-full">
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center align-center relative md:order-last">
              <Webcam ref={webcamRef} className="web top-0 left-0" />
              {isLoading ? (
                <Loading
                  loading={loading}
                  videoHeight={videoHeightRef}
                  videoWidth={videoWidthRef}
                />
              ) : (
                <canvas ref={canvasRef} className="web absolute top-0 left-0" />
              )}

              {/* Horizontal sliding images */}
              <Images />
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
