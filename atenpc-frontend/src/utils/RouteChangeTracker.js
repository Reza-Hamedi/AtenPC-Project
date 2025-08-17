// src/utils/RouteChangeTracker.js
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const RouteChangeTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [initialized, location]);

  return null;
};

export default RouteChangeTracker;