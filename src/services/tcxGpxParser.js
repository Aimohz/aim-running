/**
 * In-browser parser for Fitbit and Garmin TCX & GPX activity files.
 * Uses browser's native DOMParser (zero server upload needed).
 */

export function parseActivityFile(fileContent, fileName = "") {
  const isTcx = fileName.toLowerCase().endsWith('.tcx') || fileContent.includes('<TrainingCenterDatabase');
  const isGpx = fileName.toLowerCase().endsWith('.gpx') || fileContent.includes('<gpx');

  if (isTcx) {
    return parseTcx(fileContent, fileName);
  } else if (isGpx) {
    return parseGpx(fileContent, fileName);
  } else {
    // Attempt TCX first, then GPX
    try {
      return parseTcx(fileContent, fileName);
    } catch {
      return parseGpx(fileContent, fileName);
    }
  }
}

function parseTcx(xmlString, fileName) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");

  const parseError = xml.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid TCX file format.");
  }

  // Activity & Id (timestamp)
  const idNode = xml.querySelector("Id") || xml.querySelector("Lap > Track > Trackpoint > Time");
  let activityDate = new Date().toISOString().split('T')[0];
  if (idNode && idNode.textContent) {
    const parsedDate = new Date(idNode.textContent);
    if (!isNaN(parsedDate)) {
      activityDate = parsedDate.toISOString().split('T')[0];
    }
  }

  // Distance meters & duration
  let totalDistanceMeters = 0;
  const distNodes = xml.querySelectorAll("DistanceMeters");
  if (distNodes.length > 0) {
    // Get max distance recorded
    distNodes.forEach(node => {
      const val = parseFloat(node.textContent || "0");
      if (val > totalDistanceMeters) totalDistanceMeters = val;
    });
  }

  let totalTimeSeconds = 0;
  const timeNodes = xml.querySelectorAll("TotalTimeSeconds");
  timeNodes.forEach(node => {
    totalTimeSeconds += parseFloat(node.textContent || "0");
  });

  // Trackpoints for Heart Rate
  const hrValues = [];
  const hrNodes = xml.querySelectorAll("HeartRateBpm > Value");
  hrNodes.forEach(node => {
    const val = parseInt(node.textContent || "0", 10);
    if (val > 40 && val < 230) hrValues.push(val);
  });

  // If totalTimeSeconds wasn't in Lap, calculate from first and last Trackpoint
  if (totalTimeSeconds === 0) {
    const trackpoints = xml.querySelectorAll("Trackpoint");
    if (trackpoints.length >= 2) {
      const firstTime = new Date(trackpoints[0].querySelector("Time")?.textContent || "").getTime();
      const lastTime = new Date(trackpoints[trackpoints.length - 1].querySelector("Time")?.textContent || "").getTime();
      if (firstTime && lastTime && lastTime > firstTime) {
        totalTimeSeconds = (lastTime - firstTime) / 1000;
      }
    }
  }

  const distanceKm = Math.round((totalDistanceMeters / 1000) * 100) / 100 || 0;
  const durationMin = Math.round((totalTimeSeconds / 60) * 10) / 10 || 0;

  // Pace in sec/km
  const avgPaceSec = distanceKm > 0 && totalTimeSeconds > 0 
    ? Math.round(totalTimeSeconds / distanceKm) 
    : 0;

  let avgHeartRate = null;
  let maxHeartRate = null;
  if (hrValues.length > 0) {
    const sum = hrValues.reduce((a, b) => a + b, 0);
    avgHeartRate = Math.round(sum / hrValues.length);
    maxHeartRate = Math.max(...hrValues);
  }

  return {
    source: "fitbit",
    format: "tcx",
    fileName,
    date: activityDate,
    distanceKm,
    durationMin,
    avgPaceSec,
    avgHeartRate,
    maxHeartRate,
    sampleCount: hrValues.length
  };
}

function parseGpx(xmlString, fileName) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "text/xml");

  const parseError = xml.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid GPX file format.");
  }

  const trkpts = Array.from(xml.querySelectorAll("trkpt"));
  if (trkpts.length === 0) {
    throw new Error("No GPS track points found in GPX file.");
  }

  const firstTime = new Date(trkpts[0].querySelector("time")?.textContent || "").getTime();
  const lastTime = new Date(trkpts[trkpts.length - 1].querySelector("time")?.textContent || "").getTime();
  
  let totalTimeSeconds = 0;
  let activityDate = new Date().toISOString().split('T')[0];
  if (firstTime) {
    activityDate = new Date(firstTime).toISOString().split('T')[0];
    if (lastTime && lastTime > firstTime) {
      totalTimeSeconds = (lastTime - firstTime) / 1000;
    }
  }

  // Calculate distance from lat/lon using Haversine formula
  let totalDistanceKm = 0;
  const hrValues = [];

  for (let i = 0; i < trkpts.length; i++) {
    // HR extraction (Garmin/Fitbit extensions)
    const hrNode = trkpts[i].querySelector("hr") || trkpts[i].querySelector("gpxtpx\\:hr");
    if (hrNode) {
      const hr = parseInt(hrNode.textContent || "0", 10);
      if (hr > 40 && hr < 230) hrValues.push(hr);
    }

    if (i > 0) {
      const lat1 = parseFloat(trkpts[i - 1].getAttribute("lat") || "0");
      const lon1 = parseFloat(trkpts[i - 1].getAttribute("lon") || "0");
      const lat2 = parseFloat(trkpts[i].getAttribute("lat") || "0");
      const lon2 = parseFloat(trkpts[i].getAttribute("lon") || "0");
      totalDistanceKm += haversineDistanceKm(lat1, lon1, lat2, lon2);
    }
  }

  const distanceKm = Math.round(totalDistanceKm * 100) / 100;
  const durationMin = Math.round((totalTimeSeconds / 60) * 10) / 10;
  const avgPaceSec = distanceKm > 0 && totalTimeSeconds > 0 
    ? Math.round(totalTimeSeconds / distanceKm) 
    : 0;

  let avgHeartRate = null;
  let maxHeartRate = null;
  if (hrValues.length > 0) {
    const sum = hrValues.reduce((a, b) => a + b, 0);
    avgHeartRate = Math.round(sum / hrValues.length);
    maxHeartRate = Math.max(...hrValues);
  }

  return {
    source: "fitbit",
    format: "gpx",
    fileName,
    date: activityDate,
    distanceKm,
    durationMin,
    avgPaceSec,
    avgHeartRate,
    maxHeartRate,
    sampleCount: hrValues.length
  };
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function formatPace(paceSec) {
  if (!paceSec || isNaN(paceSec) || paceSec <= 0) return "--:--";
  const mins = Math.floor(paceSec / 60);
  const secs = Math.floor(paceSec % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}/km`;
}
