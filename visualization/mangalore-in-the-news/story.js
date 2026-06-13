(function () {
  const state = {
    activeStep: 0,
    ready: false,
    data: {},
    focus: null,
    lockedFocus: null,
    colorBy: null,
    lastMode: "",
    needsScrollAlign: true
  };

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const vehicleOrder = ["bus", "two-wheeler", "truck/lorry", "car/van", "auto-rickshaw", "train"];
  const vehicleNames = {
    bus: "Bus",
    "two-wheeler": "Two-wheeler",
    "truck/lorry": "Truck / lorry",
    "car/van": "Car / van",
    "auto-rickshaw": "Auto-rickshaw",
    train: "Train"
  };

  const outcomeOrder = [
    "Deaths mentioned",
    "Injuries mentioned",
    "Hospitalized mentioned"
  ];

  const outcomeShort = {
    "Deaths mentioned": "Deaths",
    "Injuries mentioned": "Injuries",
    "Hospitalized mentioned": "Hospitalized"
  };

  const roadColorModes = [
    { value: "vehicle", label: "Vehicle" },
    { value: "outcome", label: "Death/injury" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" }
  ];

  const familyOrder = [
    "Road safety",
    "Health",
    "Civic work",
    "Rain and weather",
    "Fire and emergency",
    "Education",
    "Governance",
    "Public safety"
  ];

  const topicOrder = [
    "Road safety",
    "Rain and weather",
    "Health",
    "Civic work",
    "Transport",
    "Fire and emergency",
    "Education",
    "Public safety",
    "Governance",
    "Coastal environment"
  ];

  const scopeOrder = [
    "Clear Mangaluru places",
    "Mangaluru, needs review",
    "Dakshina Kannada context",
    "Nearby coastal context",
    "Outside city counts"
  ];

  const scopeNames = {
    "Clear Mangaluru places": "Clear Mangaluru places",
    "Mangaluru, needs review": "Possible Mangaluru places",
    "Dakshina Kannada context": "Dakshina Kannada",
    "Nearby coastal context": "Nearby coastal areas",
    "Outside city counts": "Outside the city"
  };

  const sourceOrder = [
    "daijiworld",
    "mangalorean_com",
    "nammakudla_news",
    "mangalore_today",
    "other"
  ];

  const sourceNames = {
    daijiworld: "Daijiworld",
    mangalorean_com: "Mangalorean.com",
    nammakudla_news: "Namma Kudla News",
    mangalore_today: "Mangalore Today",
    other: "Other sources"
  };

  const sourceLabelToKey = {
    Daijiworld: "daijiworld",
    "Mangalorean.com": "mangalorean_com",
    "Namma Kudla News": "nammakudla_news",
    "Mangalore Today": "mangalore_today",
    "Other sources": "other"
  };

  const scenes = [
    {
      kicker: "Start",
      title: "21,615 records",
      note: "Each dot is one public news record.",
      summary: "All 21,615 records are shown as dots before grouping by year, subject, source, and place. This is public news data, not a police or hospital register.",
      fit: true,
      draw: () => drawDots("scatter")
    },
    {
      kicker: "Time",
      title: "2023 is the busiest year here",
      note: "2023 has 3,174 records; 2024 has 2,714; 2025 has 2,686. The 2026 column is partial.",
      summary: "The tallest year is 2023 with 3,174 records. Early years are thinner, and 2026 is partial.",
      fit: false,
      draw: () => drawDots("time-color")
    },
    {
      kicker: "Topics",
      title: "Many stories belong to more than one subject",
      note: "The chart uses one main subject; 9,512 records also have secondary subjects.",
      summary: "The chart uses one main subject for comparison, but 9,512 records also have secondary subjects.",
      fit: true,
      draw: () => drawDots("topic")
    },
    {
      kicker: "Roads",
      title: "Road safety is the largest subject",
      note: "Road safety has 8,025 records by main subject, about 37% of the dataset.",
      summary: "Road safety is the largest main subject with 8,025 records. Health has 3,837, civic work has 2,214, and rain and weather has 1,712.",
      fit: true,
      defaultFocus: { type: "family", value: "Road safety" },
      draw: () => drawDots("topic")
    },
    {
      kicker: "Road incidents",
      title: "Accident reports appear in every month",
      note: "The accident set has 1,939 records. December is highest, followed by May, April, and March.",
      summary: "Accident records appear through the year. December is highest, but unlike rain, they do not form one clear season.",
      fit: false,
      defaultColor: "vehicle",
      tools: () => roadColorTools("month"),
      draw: () => drawRoadIncidents("month")
    },
    {
      kicker: "Weekdays",
      title: "The weekday pattern is weak",
      note: "Monday and Sunday are slightly higher, but the week is mostly even.",
      summary: "The accident records do not show a clear weekday split. The stronger split comes from vehicle type and death or injury numbers.",
      fit: false,
      defaultColor: "vehicle",
      tools: () => roadColorTools("weekday"),
      draw: () => drawRoadIncidents("weekday")
    },
    {
      kicker: "Vehicles",
      title: "Two-wheelers are named most often",
      note: "The accident set has 2,783 vehicle mentions. Two-wheelers are highest.",
      summary: "Vehicle mentions are counted inside accident reports. One report can name more than one vehicle.",
      fit: false,
      defaultColor: "outcome",
      tools: () => roadColorTools("vehicle"),
      draw: () => drawRoadVehicles("vehicle")
    },
    {
      kicker: "Death records",
      title: "Two-wheeler reports more often include deaths",
      note: "477 of 497 two-wheeler mentions with death or injury numbers include a death count.",
      summary: "Among vehicle mentions with death or injury numbers, two-wheelers more often include deaths than the other main vehicle groups. This does not tell us how risky each vehicle is for people who use it.",
      fit: false,
      defaultColor: "outcome",
      tools: () => [],
      draw: () => drawRoadVehicles("outcome")
    },
    {
      kicker: "Rain",
      title: "Rain records follow the monsoon months",
      note: "July is highest with 502 records. May through August is the strongest block.",
      summary: "Rain and weather records rise from May through August. The chart counts news records, not rainfall.",
      fit: false,
      defaultFocus: { type: "topic", value: "Rain and weather" },
      tools: () => topicTools(),
      draw: drawMonthProfile
    },
    {
      kicker: "Source",
      title: "The source changes the mix",
      note: "Records are grouped by publisher and colored by main subject.",
      summary: "Daijiworld contributes 11,825 records, nearly half of them road-safety records. Mangalorean.com contributes 3,759 records, with health as its largest group.",
      fit: false,
      draw: () => drawDots("source")
    },
    {
      kicker: "Map",
      title: "Only 102 records have checked coordinates",
      note: "The map uses the 102 records with checked local coordinates.",
      summary: "The dataset has 3,933 records with clear Mangaluru place mentions, but only 102 records with checked coordinates are drawn as map points.",
      kind: "map",
      fit: true,
      defaultFocus: { type: "map-topic", value: "__all" },
      mapView: { mode: "wide", scale: 1, x: 0, y: 0 },
      tools: () => mapTopicTools(),
      draw: drawMapPoints
    },
    {
      kicker: "Road map",
      title: "Road points repeat at Padil and Surathkal",
      note: "Padil and Surathkal each appear five times in the checked road-safety points.",
      summary: "Padil and Surathkal appear five times each in the checked road-safety map points. Nanthoor and Kottara Chowki appear four times each.",
      kind: "map",
      fit: true,
      defaultFocus: { type: "map-topic", value: "Road safety" },
      mapView: { mode: "fit-focus", minScale: 1.28, maxScale: 1.68, offsetX: 8, offsetY: -2 },
      tools: () => mapTopicTools(),
      draw: drawMapPoints
    },
    {
      kicker: "Rain map",
      title: "Rain points cluster near Kottara Chowki",
      note: "Kottara Chowki appears 17 times in the checked rain-and-weather points.",
      summary: "Kottara Chowki appears 17 times in the checked rain-and-weather map points, more than any other mapped place in that subset.",
      kind: "map",
      fit: true,
      defaultFocus: { type: "map-topic", value: "Rain and weather" },
      mapView: { mode: "fit-focus", minScale: 1.7, maxScale: 2.35, offsetX: -10, offsetY: 10 },
      tools: () => mapTopicTools(),
      draw: drawMapPoints
    },
    {
      kicker: "Civic map",
      title: "Pumpwell leads the checked civic-work points",
      note: "Pumpwell appears 12 times in the checked civic-work points.",
      summary: "Pumpwell appears 12 times in the checked civic-work map points. Nanthoor follows with four.",
      kind: "map",
      fit: true,
      defaultFocus: { type: "map-topic", value: "Civic work" },
      mapView: { mode: "fit-focus", minScale: 1.55, maxScale: 2.15, offsetX: -4, offsetY: 14 },
      tools: () => mapTopicTools(),
      draw: drawMapPoints
    }
  ];

  const canvas = document.querySelector(".chart-canvas");
  const canvasContext = canvas.getContext("2d");
  const svg = document.querySelector(".chart");
  const viewport = document.querySelector(".chart-viewport");
  const chartKicker = document.querySelector("#chart-kicker");
  const chartTitle = document.querySelector("#chart-title");
  const chartNote = document.querySelector("#chart-note");
  const chartSummary = document.querySelector("#chart-summary");
  const visualTools = document.querySelector("#visual-tools");
  const visualFrame = document.querySelector(".visual");

  let plotLayer = null;
  let dotLayer = null;
  let labelLayer = null;
  let tooltip = null;
  let tooltipHideTimer = 0;
  let canvasAnimation = 0;
  let canvasLastPositions = new Map();
  let canvasHitPoints = [];
  let activeCanvasArticleRow = null;
  let lastMapCamera = null;
  let currentMapCamera = null;
  let currentMapNode = null;
  let currentMapMarkers = [];
  let manualMapCamera = null;
  let mapDrag = null;
  let roadLastPositions = new Map();

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let quote = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (quote) {
        if (char === '"' && next === '"') {
          value += '"';
          i += 1;
        } else if (char === '"') {
          quote = false;
        } else {
          value += char;
        }
      } else if (char === '"') {
        quote = true;
      } else if (char === ",") {
        row.push(value);
        value = "";
      } else if (char === "\n") {
        row.push(value);
        rows.push(row);
        row = [];
        value = "";
      } else if (char !== "\r") {
        value += char;
      }
    }

    if (value || row.length) {
      row.push(value);
      rows.push(row);
    }

    const headers = rows.shift() || [];
    return rows
      .filter((entry) => entry.length && entry.some((item) => item !== ""))
      .map((entry) => {
        const record = {};
        headers.forEach((header, index) => {
          record[header] = entry[index] || "";
        });
        return record;
      });
  }

  function loadCsv(name) {
    return fetch(`./data/${name}`).then((response) => response.text()).then(parseCsv);
  }

  function loadJson(name) {
    return fetch(`./data/${name}`).then((response) => response.json());
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatCount(value) {
    return new Intl.NumberFormat("en-IN").format(Math.round(number(value)));
  }

  function formatShare(value) {
    return `${Math.round(number(value) * 100)}%`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function uiState() {
    if (window.MangaloreDataUI) return window.MangaloreDataUI.readState();
    return { theme: "light", huePrimary: 210, hueStep: 30 };
  }

  function isDark() {
    return document.documentElement.dataset.theme === "dark";
  }

  function color(index, alpha = 1) {
    const current = uiState();
    const hues = [
      current.huePrimary,
      current.huePrimary + current.hueStep,
      current.huePrimary + current.hueStep * 2,
      current.huePrimary + 180,
      current.huePrimary + 180 + current.hueStep,
      current.huePrimary + 180 - current.hueStep,
      current.huePrimary + current.hueStep * 3,
      current.huePrimary - current.hueStep
    ];
    const hue = hues[index % hues.length];
    const saturation = isDark() ? 46 : 42;
    const lightness = isDark() ? 72 : 41;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  function yearColor(index, total, alpha = 1) {
    const current = uiState();
    const span = Math.max(1, total - 1);
    const hue = current.huePrimary + current.hueStep + (index / span) * 118;
    const saturation = isDark() ? 48 : 43;
    const lightness = isDark() ? 68 : 43;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  function neutral(alpha = 1) {
    const current = uiState();
    const lightness = isDark() ? 66 : 43;
    return `hsla(${current.huePrimary}, 10%, ${lightness}%, ${alpha})`;
  }

  function vehicleColor(vehicle, alpha = 1) {
    const index = Math.max(0, vehicleOrder.indexOf(vehicle));
    return color(index, alpha);
  }

  function outcomeColor(outcome, alpha = 1) {
    const current = uiState();
    const index = Math.max(0, outcomeOrder.indexOf(outcome));
    const hues = [
      current.huePrimary + 180,
      current.huePrimary + current.hueStep,
      current.huePrimary + current.hueStep * 2,
      current.huePrimary
    ];
    const saturation = isDark() ? 48 : 44;
    const lightness = isDark() ? 72 : 42;
    return `hsla(${hues[index % hues.length]}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  function monthColor(month, alpha = 1) {
    const current = uiState();
    const index = clamp(number(month) - 1, 0, 11);
    const hue = current.huePrimary + (index / 11) * 150;
    const saturation = isDark() ? 46 : 42;
    const lightness = isDark() ? 70 : 42;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  function roadColorBy(scene = scenes[state.activeStep] || scenes[0]) {
    return state.colorBy || scene.defaultColor || "vehicle";
  }

  function roadValueFor(row, mode) {
    if (mode === "year") return String(row.year);
    if (mode === "month") return String(number(row.month));
    if (mode === "outcome") return row.outcome_class || "No death or injury number found";
    return row.vehicle_type || row.vehicle_primary || "unknown";
  }

  function roadSortRank(row, mode) {
    if (mode === "vehicle") {
      const index = vehicleOrder.indexOf(row.vehicle_type || row.vehicle_primary);
      return index >= 0 ? index : vehicleOrder.length;
    }
    if (mode === "outcome") {
      const index = outcomeOrder.indexOf(row.outcome_class);
      return index >= 0 ? index : outcomeOrder.length;
    }
    if (mode === "month") return clamp(number(row.month) - 1, 0, 11);
    if (mode === "year") {
      const years = state.data.roadYears || [];
      const index = years.indexOf(number(row.year));
      return index >= 0 ? index : years.length;
    }
    return 0;
  }

  function roadSortForMode(mode) {
    return (a, b) => {
      const rank = roadSortRank(a, mode) - roadSortRank(b, mode);
      if (rank) return rank;
      const date = String(a.date || "").localeCompare(String(b.date || ""));
      if (date) return date;
      return String(a.event_cluster_id).localeCompare(String(b.event_cluster_id));
    };
  }

  function roadLabelFor(mode, value) {
    if (mode === "month") return monthLabels[number(value) - 1] || value;
    if (mode === "outcome") return outcomeShort[value] || value;
    if (mode === "vehicle") return vehicleNames[value] || value;
    return String(value);
  }

  function roadColorFor(row, alpha = 1) {
    const mode = roadColorBy();
    if (mode === "year") {
      const years = state.data.roadYears || [];
      const index = Math.max(0, years.indexOf(number(row.year)));
      return yearColor(index, Math.max(1, years.length), alpha);
    }
    if (mode === "month") return monthColor(row.month, alpha);
    if (mode === "outcome") return outcomeColor(row.outcome_class, alpha);
    return vehicleColor(row.vehicle_type || row.vehicle_primary, alpha);
  }

  function roadIsActive(row) {
    const focus = activeFocus(false);
    if (!focus || focus.type !== "road-legend") return true;
    return roadValueFor(row, focus.dimension) === String(focus.value);
  }

  function create(tag, attrs = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function textNode(text, attrs = {}) {
    const node = create("text", attrs);
    node.textContent = text;
    return node;
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function dims() {
    const fitChart = svg.classList.contains("fit-chart");
    const viewportWidth = Math.max(220, Math.round(viewport.getBoundingClientRect().width || 900));
    const desktopLayout = window.matchMedia("(min-width: 841px)").matches;
    const width = fitChart || desktopLayout ? viewportWidth : Math.max(860, viewportWidth);
    const height = Math.max(340, Math.round(svg.getBoundingClientRect().height || 520));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return { width, height };
  }

  function chartHeight() {
    if (window.matchMedia("(max-width: 520px)").matches) return 360;
    if (window.matchMedia("(max-width: 840px)").matches) return 380;
    return 520;
  }

  function chartRenderWidth() {
    const viewportWidth = Math.max(220, Math.round(viewport.getBoundingClientRect().width || 900));
    if (canvas.classList.contains("fit-chart")) return viewportWidth;
    if (window.matchMedia("(min-width: 841px)").matches) return viewportWidth;
    if (window.matchMedia("(max-width: 520px)").matches) return Math.max(860, viewportWidth);
    if (window.matchMedia("(max-width: 840px)").matches) return Math.max(780, viewportWidth);
    return Math.max(640, viewportWidth);
  }

  function showSvgSurface() {
    cancelAnimationFrame(canvasAnimation);
    canvasHitPoints = [];
    activeCanvasArticleRow = null;
    canvas.classList.remove("has-article");
    canvas.dataset.renderedPoints = "0";
    canvas.classList.add("chart-surface-hidden");
    svg.classList.remove("chart-surface-hidden");
  }

  function prepareCanvasScene() {
    cancelAnimationFrame(canvasAnimation);
    svg.innerHTML = "";
    plotLayer = null;
    dotLayer = null;
    labelLayer = null;
    state.lastMode = "canvas";
    svg.classList.add("chart-surface-hidden");
    canvas.classList.remove("chart-surface-hidden");
    const width = chartRenderWidth();
    const height = chartHeight();
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvasContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width, height };
  }

  function clearStatic(width, height) {
    showSvgSurface();
    state.lastMode = "static";
    plotLayer = null;
    dotLayer = null;
    labelLayer = null;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }

  function prepareDotScene(width, height) {
    showSvgSurface();
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    if (state.lastMode !== "dots" || !dotLayer) {
      svg.innerHTML = "";
      plotLayer = create("g", { class: "plot-layer" });
      dotLayer = create("g", { class: "dot-layer" });
      labelLayer = create("g", { class: "label-layer" });
      svg.appendChild(plotLayer);
      svg.appendChild(dotLayer);
      svg.appendChild(labelLayer);
      state.lastMode = "dots";
    } else {
      plotLayer.innerHTML = "";
      labelLayer.innerHTML = "";
    }
  }

  function scaleLinear(domainMin, domainMax, rangeMin, rangeMax) {
    const span = domainMax - domainMin || 1;
    return (value) => rangeMin + ((value - domainMin) / span) * (rangeMax - rangeMin);
  }

  function hashString(value) {
    let hash = 2166136261;
    const text = String(value);
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function rand(id, salt) {
    const raw = Math.sin(hashString(`${id}|${salt}`) * 12.9898) * 43758.5453;
    return raw - Math.floor(raw);
  }

  function familyIndex(label) {
    const index = familyOrder.indexOf(label);
    return index >= 0 ? index : familyOrder.length - 1;
  }

  function topicIndex(label) {
    const index = topicOrder.indexOf(label);
    return index >= 0 ? index : topicOrder.length - 1;
  }

  function tagsFor(row) {
    return String(row.topic_tag_list || "")
      .split("|")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function hasTopic(row, label) {
    return tagsFor(row).includes(label) || row.family_group_label === label || row.event_family_label === label;
  }

  function sourceKey(row) {
    const raw = String(row.source_ids || "").split(/[|;,]/)[0].trim();
    const key = raw === "namma_kudla_news" ? "nammakudla_news" : raw;
    return sourceOrder.includes(key) ? key : "other";
  }

  function displaySourceKey(row) {
    const key = sourceKey(row);
    return sourceOrder.includes(key) ? key : "other";
  }

  function scopeKey(row) {
    const bucket = String(row.scope_bucket || "");
    const found = scopeOrder.find((scope) => bucket.toLowerCase() === scope.toLowerCase());
    return found || "outside city counts";
  }

  function assignRanks(rows, keyFn, prop) {
    const buckets = new Map();
    rows.forEach((row) => {
      const key = keyFn(row);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(row);
    });
    buckets.forEach((items) => {
      items.sort((a, b) => {
        const yearDiff = number(a.event_year) - number(b.event_year);
        if (yearDiff) return yearDiff;
        return String(a.event_cluster_id || a.event_id).localeCompare(String(b.event_cluster_id || b.event_id));
      });
      items.forEach((row, index) => {
        row[prop] = index;
        row[`${prop}Total`] = items.length;
      });
    });
  }

  function shouldHighlight(row) {
    const focus = activeFocus(false);
    if (!focus) return true;
    if (focus.type === "family") return row.family_group_label === focus.value || row.event_family_label === focus.value;
    if (focus.type === "topic") return hasTopic(row, focus.value);
    if (focus.type === "map-topic") return focus.value === "__all" || row.topic_label === focus.value;
    if (focus.type === "source") return sourceKey(row) === focus.value;
    if (focus.type === "scope") return scopeKey(row) === focus.value;
    return true;
  }

  function activeFocus(includeDefault = false) {
    const scene = scenes[state.activeStep] || scenes[0];
    return state.lockedFocus || state.focus || (includeDefault ? scene.defaultFocus : null);
  }

  function geoProjector(width, height) {
    const context = state.data.mapContext || {};
    const bbox = context.bbox || [74.78, 12.84, 74.93, 13.04];
    const margin = width < 520
      ? { top: 24, right: 18, bottom: 34, left: 18 }
      : { top: 26, right: 34, bottom: 36, left: 34 };
    const plotW = Math.max(20, width - margin.left - margin.right);
    const plotH = Math.max(20, height - margin.top - margin.bottom);
    const lonSpan = Math.max(0.001, bbox[2] - bbox[0]);
    const latSpan = Math.max(0.001, bbox[3] - bbox[1]);
    const scale = Math.min(plotW / lonSpan, plotH / latSpan);
    const drawW = lonSpan * scale;
    const drawH = latSpan * scale;
    const x0 = margin.left + (plotW - drawW) / 2;
    const y0 = margin.top + (plotH - drawH) / 2;

    return {
      margin,
      project(lon, lat) {
        return {
          x: x0 + (lon - bbox[0]) * scale,
          y: y0 + (bbox[3] - lat) * scale
        };
      }
    };
  }

  function pathFromGeoLine(coordinates, project) {
    return coordinates
      .map((coord, index) => {
        const point = project(number(coord[0]), number(coord[1]));
        return `${index ? "L" : "M"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      })
      .join(" ");
  }

  function pathFromGeometry(geometry, project) {
    if (!geometry) return "";
    if (geometry.type === "LineString") {
      return pathFromGeoLine(geometry.coordinates || [], project);
    }
    if (geometry.type === "Polygon") {
      return (geometry.coordinates || [])
        .map((ring) => `${pathFromGeoLine(ring, project)} Z`)
        .join(" ");
    }
    if (geometry.type === "MultiPolygon") {
      return (geometry.coordinates || [])
        .flatMap((polygon) => polygon.map((ring) => `${pathFromGeoLine(ring, project)} Z`))
        .join(" ");
    }
    return "";
  }

  function drawMapBase(width, height, options = {}) {
    const projector = geoProjector(width, height);
    const features = (state.data.mapContext && state.data.mapContext.features) || [];
    const parent = options.parent || svg;
    const layer = create("g", { class: options.faint ? "map-base is-faint" : "map-base" });
    parent.appendChild(layer);

    features.filter((feature) => feature.properties && feature.properties.map_layer === "ward").forEach((feature) => {
      const path = pathFromGeometry(feature.geometry, projector.project);
      if (!path) return;
      layer.appendChild(create("path", {
        d: path,
        class: "map-ward",
        fill: neutral(isDark() ? 0.055 : 0.05),
        stroke: neutral(isDark() ? 0.24 : 0.18),
        "stroke-width": options.faint ? 0.55 : 0.8
      }));
    });

    features.filter((feature) => feature.properties && feature.properties.map_layer === "road").forEach((feature) => {
      const path = pathFromGeometry(feature.geometry, projector.project);
      if (!path) return;
      const isMajor = String(feature.properties.is_major) === "true" || feature.properties.is_major === true;
      layer.appendChild(create("path", {
        d: path,
        class: isMajor ? "map-road is-major" : "map-road",
        fill: "none",
        stroke: neutral(isMajor ? (isDark() ? 0.24 : 0.20) : (isDark() ? 0.10 : 0.08)),
        "stroke-width": isMajor ? (options.faint ? 0.75 : 1.2) : 0.55,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
    });

    if (!options.faint && width >= 620) {
      features.filter((feature) => feature.properties && feature.properties.map_layer === "poi").slice(0, 120).forEach((feature) => {
        const coord = feature.geometry && feature.geometry.coordinates;
        if (!coord) return;
        const point = projector.project(number(coord[0]), number(coord[1]));
        layer.appendChild(create("circle", {
          class: "map-poi",
          cx: point.x,
          cy: point.y,
          r: 1.5,
          fill: neutral(isDark() ? 0.32 : 0.22)
        }));
      });
    }

    return projector;
  }

  function mapPointColor(row, alpha = 0.9) {
    return color(topicIndex(row.topic_label), alpha);
  }

  function mapSpatialPoint(row, projector, width) {
    const base = projector.project(number(row.map_lon), number(row.map_lat));
    const rank = number(row._rankMapPlace);
    const total = Math.max(1, number(row._rankMapPlaceTotal));
    if (total <= 1) return base;
    const angle = rank * 2.399963 + rand(row.event_id, "map-angle") * 0.42;
    const radiusStep = width < 520 ? 2.4 : 3.1;
    const radius = Math.min(width < 520 ? 13 : 20, Math.sqrt(rank + 0.35) * radiusStep);
    return {
      x: base.x + Math.cos(angle) * radius,
      y: base.y + Math.sin(angle) * radius
    };
  }

  function mapScatterPoint(row, width, height) {
    const margin = width < 520
      ? { top: 34, right: 22, bottom: 36, left: 22 }
      : { top: 38, right: 38, bottom: 38, left: 38 };
    return {
      x: margin.left + rand(row.event_id, "map-scatter-x") * Math.max(20, width - margin.left - margin.right),
      y: margin.top + rand(row.event_id, "map-scatter-y") * Math.max(20, height - margin.top - margin.bottom)
    };
  }

  function drawMapPoints() {
    const { width, height } = clearAndSize();
    const scene = scenes[state.activeStep] || scenes[0];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const camera = create("g", { class: "map-camera" });
    svg.appendChild(camera);
    const projector = drawMapBase(width, height, { parent: camera });
    const focus = activeFocus(true);
    const allPoints = state.data.mapPoints || [];
    const points = allPoints.filter((row) => !focus || focus.type !== "map-topic" || focus.value === "__all" || row.topic_label === focus.value);
    const targetCamera = mapCameraForScene(scene, projector, points.length ? points : allPoints, width, height);
    const startCamera = reducedMotion ? targetCamera : lastMapCamera || mapIntroCamera(width, height);
    applyMapCamera(camera, startCamera);
    currentMapNode = camera;
    currentMapCamera = targetCamera;
    currentMapMarkers = [];
    manualMapCamera = null;
    const layer = create("g", { class: "map-point-layer" });
    camera.appendChild(layer);
    const baseRadius = mapDotRadius(width);

    points.forEach((row, index) => {
      const start = lastMapCamera ? null : mapScatterPoint(row, width, height);
      const point = mapSpatialPoint(row, projector, width);
      const dot = create("circle", {
        class: "map-event-point",
        cx: 0,
        cy: 0,
        r: baseRadius / Math.max(0.1, startCamera.scale),
        fill: mapPointColor(row, isDark() ? 0.84 : 0.78)
      });
      dot.dataset.baseRadius = String(baseRadius);
      dot.style.transform = start ? `translate(${start.x}px, ${start.y}px)` : `translate(${point.x}px, ${point.y}px)`;
      dot.style.transitionDelay = reducedMotion ? "0ms" : `${120 + Math.min(index, 80) * 5}ms`;
      dot.addEventListener("mouseenter", (event) => {
        const place = row.selected_location_name || "Mapped local record";
        showTooltip(
          event,
          newsHeadline(row),
          `${place} · ${row.event_year} · ${row.topic_label} · ${row.source_label}`,
          row
        );
      });
      dot.addEventListener("mousemove", moveTooltip);
      dot.addEventListener("mouseleave", hideTooltip);
      linkDataPoint(dot, row, { keyboard: true });
      layer.appendChild(dot);
      currentMapMarkers.push(dot);
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${point.x}px, ${point.y}px)`;
      });
    });

    const settle = () => {
      applyMapCamera(camera, targetCamera);
      camera.classList.add("is-settled");
      lastMapCamera = targetCamera;
    };
    if (reducedMotion) {
      settle();
    } else {
      requestAnimationFrame(() => requestAnimationFrame(settle));
    }
  }

  function mapIntroCamera(width, height) {
    return {
      x: width * 0.1,
      y: -height * 0.08,
      scale: 0.66
    };
  }

  function applyMapCamera(node, camera, manual = false) {
    node.classList.toggle("is-manual", manual);
    if (node === currentMapNode) updateMapMarkerScale(camera);
    node.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
  }

  function mapDotRadius(width) {
    return width < 520 ? 4.1 : 4.6;
  }

  function updateMapMarkerScale(camera) {
    const scale = Math.max(0.1, camera?.scale || 1);
    currentMapMarkers.forEach((dot) => {
      const baseRadius = number(dot.dataset.baseRadius) || 4.6;
      dot.setAttribute("r", String(baseRadius / scale));
    });
  }

  function clampManualMapCamera(camera) {
    const { width, height } = dims();
    const scale = clamp(camera.scale, 0.68, 4.2);
    const padX = width * 0.28;
    const padY = height * 0.28;
    return {
      x: clamp(camera.x, width - width * scale - padX, padX),
      y: clamp(camera.y, height - height * scale - padY, padY),
      scale
    };
  }

  function mapCameraForScene(scene, projector, rows, width, height) {
    const view = scene.mapView || {};
    if (view.mode === "wide") {
      return {
        x: view.x || 0,
        y: view.y || 0,
        scale: view.scale || 1
      };
    }

    const projected = rows
      .map((row) => projector.project(number(row.map_lon), number(row.map_lat)))
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
    if (!projected.length) return { x: 0, y: 0, scale: 1 };

    const minX = Math.min(...projected.map((point) => point.x));
    const maxX = Math.max(...projected.map((point) => point.x));
    const minY = Math.min(...projected.map((point) => point.y));
    const maxY = Math.max(...projected.map((point) => point.y));
    const boundsW = Math.max(18, maxX - minX);
    const boundsH = Math.max(18, maxY - minY);
    const targetW = width * (width < 520 ? 0.78 : 0.7);
    const targetH = height * (width < 520 ? 0.62 : 0.66);
    const scale = Math.min(
      view.maxScale || 2.2,
      Math.max(view.minScale || 1.15, Math.min(targetW / boundsW, targetH / boundsH))
    );
    const centerX = minX + boundsW / 2;
    const centerY = minY + boundsH / 2;

    return {
      x: width / 2 - centerX * scale + (view.offsetX || 0),
      y: height / 2 - centerY * scale + (view.offsetY || 0),
      scale
    };
  }

  function topicTools() {
    const summary = state.data.topicSummary || [];
    const labels = summary
      .map((row) => row.topic_label)
      .filter((label) => topicOrder.includes(label))
      .sort((a, b) => topicIndex(a) - topicIndex(b));
    const unique = labels.length ? labels : topicOrder.slice(0, 8);
    return unique.slice(0, 8).map((label) => ({ type: "topic", value: label, label }));
  }

  function roadColorTools(layout) {
    const hiddenByAxis = ({
      month: new Set(["month"]),
      weekday: new Set([]),
      vehicle: new Set(["vehicle"]),
      outcome: new Set(["outcome"])
    }[layout] || new Set());
    return roadColorModes.filter((item) => !hiddenByAxis.has(item.value)).map((item) => ({
      kind: "color",
      value: item.value,
      label: item.label
    }));
  }

  function mapTopicTools() {
    const labels = [...new Set((state.data.mapPoints || []).map((row) => row.topic_label))]
      .filter(Boolean)
      .sort((a, b) => topicIndex(a) - topicIndex(b));
    return [
      { type: "map-topic", value: "__all", label: "All" },
      ...labels.map((label) => ({ type: "map-topic", value: label, label }))
    ];
  }

  function sourceTools() {
    const rows = sourceTotals();
    return rows
      .filter((row) => row.count >= 500 || row.key === "other")
      .map((row) => ({ type: "source", value: row.key, label: row.label }));
  }

  function sourceTotals() {
    const totals = new Map();
    state.data.sourceFamily.forEach((row) => {
      const key = sourceLabelToKey[row.source_label] || "other";
      if (!totals.has(key)) {
        totals.set(key, { key, label: sourceNames[key], count: 0, families: new Map() });
      }
      const item = totals.get(key);
      const count = number(row.event_count);
      item.count += count;
      item.families.set(row.event_family_label, (item.families.get(row.event_family_label) || 0) + count);
    });
    return [...totals.values()].sort((a, b) => {
      if (a.key === "other") return 1;
      if (b.key === "other") return -1;
      return b.count - a.count;
    });
  }

  function familyCount(label) {
    const row = (state.data.familySummary || []).find((item) => item.event_family_label === label);
    return row ? number(row.event_count) : 0;
  }

  function articleUrl(row) {
    const url = String(row?.url || row?.canonical_url || row?.article_url || "").trim();
    return /^https?:\/\//i.test(url) ? url : "";
  }

  function articleLabel(row) {
    return newsHeadline(row);
  }

  function openArticle(row) {
    const url = articleUrl(row);
    if (!url) return false;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  function handleArticleKeydown(event, row) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openArticle(row);
  }

  function linkDataPoint(node, row, options = {}) {
    if (!articleUrl(row)) return;
    node.classList.add("has-article");
    node.addEventListener("pointerdown", (event) => event.stopPropagation());
    node.addEventListener("click", (event) => {
      event.stopPropagation();
      openArticle(row);
    });
    if (options.keyboard) {
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "link");
      node.setAttribute("aria-label", `Open article: ${articleLabel(row)}`);
      node.addEventListener("keydown", (event) => handleArticleKeydown(event, row));
    }
  }

  function ensureTooltip() {
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "chart-tooltip";
      tooltip.hidden = true;
      tooltip.addEventListener("mouseenter", () => window.clearTimeout(tooltipHideTimer));
      tooltip.addEventListener("mouseleave", () => hideTooltip());
      document.body.appendChild(tooltip);
    }
  }

  function showTooltip(event, title, body, row = null) {
    ensureTooltip();
    window.clearTimeout(tooltipHideTimer);
    tooltip.innerHTML = "";
    tooltip.classList.toggle("has-action", Boolean(articleUrl(row)));
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = title;
    span.textContent = body;
    tooltip.append(strong, span);
    const url = articleUrl(row);
    if (url) {
      const action = document.createElement("a");
      const icon = document.createElement("i");
      const actionText = document.createElement("span");
      action.className = "tooltip-action";
      action.href = url;
      action.target = "_blank";
      action.rel = "noopener noreferrer";
      action.setAttribute("aria-label", `Open article: ${articleLabel(row)}`);
      icon.className = "fa-solid fa-arrow-up-right-from-square";
      icon.setAttribute("aria-hidden", "true");
      actionText.textContent = "Open article";
      action.append(icon, actionText);
      tooltip.appendChild(action);
    }
    tooltip.hidden = false;
    moveTooltip(event);
  }

  function moveTooltip(event) {
    if (!tooltip || tooltip.hidden) return;
    const pad = 16;
    const rect = tooltip.getBoundingClientRect();
    const left = Math.min(window.innerWidth - rect.width - pad, event.clientX + pad);
    const top = Math.min(window.innerHeight - rect.height - pad, event.clientY + pad);
    tooltip.style.left = `${Math.max(pad, left)}px`;
    tooltip.style.top = `${Math.max(pad, top)}px`;
  }

  function hideTooltip() {
    if (!tooltip) return;
    window.clearTimeout(tooltipHideTimer);
    tooltipHideTimer = window.setTimeout(() => {
      tooltip.hidden = true;
      tooltip.classList.remove("has-action");
    }, 100);
  }

  function handleCanvasHover(event) {
    if (!canvasHitPoints.length) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let best = null;
    let bestDistance = 64;
    canvasHitPoints.forEach((mark) => {
      const dx = mark.x - x;
      const dy = mark.y - y;
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance) {
        best = mark;
        bestDistance = distance;
      }
    });
    if (!best) {
      activeCanvasArticleRow = null;
      canvas.classList.remove("has-article");
      hideTooltip();
      return;
    }
    const row = best.row;
    activeCanvasArticleRow = articleUrl(row) ? row : null;
    canvas.classList.toggle("has-article", Boolean(activeCanvasArticleRow));
    const tags = tagsFor(row).slice(0, 3).join(", ");
    showTooltip(
      event,
      row.title || row.event_family_label,
      `${row.event_year} · ${row.event_family_label}${tags ? ` · ${tags}` : ""}`,
      row
    );
  }

  function handleCanvasClick() {
    if (activeCanvasArticleRow) openArticle(activeCanvasArticleRow);
  }

  function dotPosition(row, mode, width, height) {
    const margin = { top: 34, right: 26, bottom: 42, left: 38 };
    const plotW = Math.max(20, width - margin.left - margin.right);
    const plotH = Math.max(20, height - margin.top - margin.bottom);
    const id = row.event_cluster_id;
    const year = number(row.event_year);

    if (mode === "time" || mode === "time-color") {
      return timelineHistogramPoint(row, width, height, margin, plotW, plotH);
    }

    if (mode === "topic") {
      return topicBarPoint(row, width, height, margin, plotW, plotH);
    }

    if (mode === "source") {
      return sourceCategoryPoint(row, width, height);
    }

    if (mode === "scope") {
      const scope = scopeKey(row);
      const index = scopeOrder.indexOf(scope);
      const cols = width < 520 ? 1 : 2;
      const rowIndex = width < 520 ? index : Math.floor(index / cols);
      const col = width < 520 ? 0 : index % cols;
      const rows = width < 520 ? scopeOrder.length : 3;
      const cellW = plotW / cols;
      const cellH = plotH / rows;
      return packedPoint(row._rankScope || 0, row._rankScopeTotal || 1, {
        x: margin.left + col * cellW + cellW * 0.08,
        y: margin.top + rowIndex * cellH + cellH * 0.24,
        w: cellW * 0.84,
        h: cellH * 0.54
      });
    }

    return {
      x: margin.left + rand(id, "fallback-x") * plotW,
      y: margin.top + rand(id, "fallback-y") * plotH
    };
  }

  function packedPoint(rank, total, bounds) {
    const spacing = 6;
    const maxRows = Math.max(1, Math.floor(bounds.h / spacing));
    const cols = Math.max(1, Math.ceil(total / maxRows));
    const rows = Math.min(total, maxRows);
    const col = Math.floor(rank / maxRows);
    const row = rank % maxRows;
    const usedW = Math.min(bounds.w, Math.max(1, cols - 1) * spacing);
    const usedH = Math.min(bounds.h, Math.max(1, rows - 1) * spacing);
    const xStart = bounds.x + (bounds.w - usedW) / 2;
    const yStart = bounds.y + (bounds.h - usedH) / 2;
    return {
      x: xStart + col * (usedW / Math.max(1, cols - 1)),
      y: yStart + row * (usedH / Math.max(1, rows - 1))
    };
  }

  function stackedTimePoint(rank, total, x, bounds) {
    const spacing = 5.5;
    const maxRows = Math.max(1, Math.floor(bounds.h / spacing));
    const cols = Math.max(1, Math.ceil(total / maxRows));
    const col = Math.floor(rank / maxRows);
    const row = rank % maxRows;
    const xOffset = (col - (cols - 1) / 2) * spacing;
    return {
      x: x + xOffset,
      y: bounds.y + bounds.h - (row + 0.5) * Math.min(spacing, bounds.h / Math.min(total, maxRows))
    };
  }

  function timelineHistogramPoint(row, width, height, margin, plotW, plotH) {
    const year = number(row.event_year);
    const rank = number(row._rankYear);
    const total = Math.max(1, number(row._rankYearTotal));
    const maxTotal = Math.max(total, number(state.data.maxYearTotal));
    const yearCount = 2026 - 2007 + 1;
    const yearW = plotW / yearCount;
    const center = scaleLinear(2007, 2026, margin.left + yearW / 2, width - margin.right - yearW / 2)(year);
    const binW = Math.max(12, yearW * 0.74);
    const barH = Math.max(8, (total / maxTotal) * (plotH - 18));
    const colSpacing = width < 520 ? 1.9 : 2.35;
    const cols = Math.max(2, Math.floor(binW / colSpacing));
    const rowIndex = Math.floor(rank / cols);
    const col = rank % cols;
    const rows = Math.max(1, Math.ceil(total / cols));
    const xStep = cols > 1 ? binW / (cols - 1) : 0;
    const yStep = barH / rows;
    return {
      x: center - binW / 2 + col * xStep,
      y: margin.top + plotH - (rowIndex + 0.5) * yStep
    };
  }

  function topicBarPoint(row, width, height, margin, plotW, plotH) {
    const index = familyIndex(row.family_group_label);
    const rank = number(row._rankFamily);
    const total = Math.max(1, number(row._rankFamilyTotal));
    const maxTotal = Math.max(total, number(state.data.maxFamilyTotal));
    const rowH = plotH / familyOrder.length;
    const labelW = width < 520 ? 0 : Math.min(148, plotW * 0.22);
    const barX = margin.left + labelW;
    const barMaxW = Math.max(20, plotW - labelW);
    const barW = Math.max(18, (total / maxTotal) * barMaxW);
    const colSpacing = width < 520 ? 1.55 : 1.75;
    const cols = Math.max(2, Math.floor(barW / colSpacing));
    const rowIndex = Math.floor(rank / cols);
    const col = rank % cols;
    const rows = Math.max(1, Math.ceil(total / cols));
    const xStep = cols > 1 ? barW / (cols - 1) : 0;
    const yStep = (rowH * 0.42) / rows;

    return {
      x: barX + col * xStep,
      y: margin.top + index * rowH + rowH * 0.88 - (rowIndex + 0.5) * yStep
    };
  }

  function sourceCategoryPoint(row, width, height) {
    const margin = {
      top: width < 520 ? 58 : 66,
      right: width < 520 ? 26 : 30,
      bottom: 34,
      left: width < 520 ? 96 : 136
    };
    const sourceIndex = Math.max(0, sourceOrder.indexOf(displaySourceKey(row)));
    const family = row.family_group_label || row.event_family_label;
    const familyIdx = familyIndex(family);
    const plotW = Math.max(20, width - margin.left - margin.right);
    const plotH = Math.max(20, height - margin.top - margin.bottom);
    const cellW = plotW / sourceOrder.length;
    const cellH = plotH / familyOrder.length;
    const rank = number(row._rankSourceFamily);
    const total = Math.max(1, number(row._rankSourceFamilyTotal));
    const bounds = {
      x: margin.left + sourceIndex * cellW + cellW * 0.08,
      y: margin.top + familyIdx * cellH + cellH * 0.26,
      w: cellW * 0.84,
      h: cellH * 0.52
    };
    const colSpacing = width < 520 ? 1.2 : 1.45;
    const cols = Math.max(2, Math.floor(bounds.w / colSpacing));
    const rowIndex = Math.floor(rank / cols);
    const col = rank % cols;
    const rows = Math.max(1, Math.ceil(total / cols));
    const xStep = cols > 1 ? bounds.w / (cols - 1) : 0;
    const yStep = bounds.h / rows;

    return {
      x: bounds.x + col * xStep,
      y: bounds.y + bounds.h - (rowIndex + 0.5) * yStep
    };
  }

  function stackedHorizontalPoint(rank, total, x, y, maxW) {
    const spacing = 5.5;
    const maxCols = Math.max(1, Math.floor(maxW / spacing));
    const cols = Math.min(total, maxCols);
    const col = rank % maxCols;
    const row = Math.floor(rank / maxCols);
    const usedW = Math.max(0, (cols - 1) * spacing);
    return {
      x: x - usedW / 2 + col * spacing,
      y: y - row * spacing
    };
  }

  function drawDotLabels(mode, width, height) {
    const margin = { top: 34, right: 26, bottom: 42, left: 38 };

    if (mode === "pile" || mode === "scatter") return;

    if (mode === "time" || mode === "time-color") {
      const xScale = scaleLinear(2007, 2026, margin.left, width - margin.right);
      [2007, 2011, 2016, 2021, 2026].forEach((year) => {
        labelLayer.appendChild(textNode(year, {
          x: xScale(year),
          y: height - 14,
          class: "axis-label",
          "text-anchor": "middle",
          "font-size": "12"
        }));
      });
      return;
    }

    if (mode === "topic") {
      const cols = width < 520 ? 2 : 3;
      const plotW = width - margin.left - margin.right;
      const plotH = height - margin.top - margin.bottom;
      const cellW = plotW / cols;
      const cellH = plotH / Math.ceil(6 / cols);
      familyOrder.slice(0, 6).forEach((label, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x0 = margin.left + col * cellW + cellW * 0.12;
        const x1 = margin.left + col * cellW + cellW * 0.88;
        labelLayer.appendChild(textNode(label, {
          x: margin.left + col * cellW + 4,
          y: margin.top + row * cellH + 16,
          class: "cluster-label",
          "font-size": "13"
        }));
        [2007, 2026].forEach((year) => {
          labelLayer.appendChild(textNode(year, {
            x: scaleLinear(2007, 2026, x0, x1)(year),
            y: margin.top + row * cellH + cellH * 0.93,
            class: "axis-label",
            "text-anchor": year === 2007 ? "start" : "end",
            "font-size": "10"
          }));
        });
      });
      return;
    }

    if (mode === "source") {
      const sourceMargin = { top: margin.top + 34, right: margin.right, bottom: margin.bottom + 10, left: width < 520 ? 34 : 56 };
      const plotW = width - sourceMargin.left - sourceMargin.right;
      const plotH = height - sourceMargin.top - sourceMargin.bottom;
      const colW = plotW / sourceOrder.length;
      const yScale = scaleLinear(2007, 2026, sourceMargin.top, sourceMargin.top + plotH);
      [2007, 2011, 2016, 2021, 2026].forEach((year) => {
        labelLayer.appendChild(textNode(year, {
          x: sourceMargin.left - 10,
          y: yScale(year) + 4,
          class: "axis-label",
          "text-anchor": "end",
          "font-size": "11"
        }));
      });
      sourceOrder.forEach((key, index) => {
        labelLayer.appendChild(textNode(sourceNames[key], {
          x: sourceMargin.left + index * colW + colW / 2,
          y: 18,
          class: "cluster-label",
          "text-anchor": "middle",
          "font-size": width < 520 ? "9" : "12"
        }));
      });
      return;
    }

    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;
    const cols = width < 520 ? 1 : 2;
    const rows = width < 520 ? scopeOrder.length : 3;
    const cellW = plotW / cols;
    const cellH = plotH / rows;
    scopeOrder.forEach((scope, index) => {
      const col = width < 520 ? 0 : index % cols;
      const row = width < 520 ? index : Math.floor(index / cols);
      labelLayer.appendChild(textNode(scopeNames[scope] || scope, {
        x: margin.left + col * cellW + 4,
        y: margin.top + row * cellH + 16,
        class: "cluster-label",
        "font-size": "12"
      }));
    });
  }

  function ensureDots(events) {
    const present = new Set();
    events.forEach((row) => {
      const id = row.event_cluster_id;
      present.add(id);
      if (dotLayer.querySelector(`[data-id="${id}"]`)) return;
      const dot = create("circle", {
        class: "event-dot",
        "data-id": id,
        cx: 0,
        cy: 0,
        r: 2.8
      });
      dot.addEventListener("mouseenter", (event) => {
        const title = row.title || row.event_family_label;
        const tagText = tagsFor(row).slice(0, 4).join(", ");
        const extra = tagsFor(row).length > 4 ? "..." : "";
        const body = `${row.event_year} · Main subject: ${row.event_family_label}${tagText ? ` · Also: ${tagText}${extra}` : ""}`;
        showTooltip(event, title, body, row);
      });
      dot.addEventListener("mousemove", moveTooltip);
      dot.addEventListener("mouseleave", hideTooltip);
      linkDataPoint(dot, row);
      dotLayer.appendChild(dot);
    });

    [...dotLayer.querySelectorAll(".event-dot")].forEach((dot) => {
      if (!present.has(dot.dataset.id)) dot.remove();
    });
  }

  function canvasText(text, x, y, options = {}) {
    canvasContext.save();
    canvasContext.fillStyle = options.fill || cssVar("--axis-label");
    canvasContext.font = `${options.weight || 700} ${options.size || 12}px ${options.family || "Nunito, ui-sans-serif, system-ui"}`;
    canvasContext.textAlign = options.align || "left";
    canvasContext.textBaseline = options.baseline || "alphabetic";
    canvasContext.fillText(text, x, y);
    canvasContext.restore();
  }

  function drawCanvasLabels(mode, width, height) {
    const margin = { top: 34, right: 26, bottom: 42, left: 38 };
    const labelFill = cssVar("--axis-label");
    const clusterFill = cssVar("--muted");

    if (mode === "pile" || mode === "scatter") return;

    if (mode === "time" || mode === "time-color") {
      const xScale = scaleLinear(2007, 2026, margin.left, width - margin.right);
      [2007, 2011, 2016, 2021, 2026].forEach((year) => {
        canvasText(String(year), xScale(year), height - 14, { fill: labelFill, align: "center", size: 12, weight: 600 });
      });
      return;
    }

    if (mode === "topic") {
      const plotW = width - margin.left - margin.right;
      const plotH = height - margin.top - margin.bottom;
      const rowH = plotH / familyOrder.length;
      const labelW = width < 520 ? 0 : Math.min(148, plotW * 0.22);
      const barX = margin.left + labelW;
      const barMaxW = Math.max(20, plotW - labelW);
      familyOrder.forEach((label, index) => {
        const total = familyCount(label);
        const y = margin.top + index * rowH;
        const textX = width < 520 ? margin.left : margin.left;
        const textY = y + (width < 520 ? 12 : rowH * 0.58);
        canvasText(label, textX, textY, { fill: clusterFill, size: width < 520 ? 10 : 12, weight: 800 });
        if (total) {
          const maxTotal = Math.max(1, number(state.data.maxFamilyTotal));
          const barW = Math.max(18, (total / maxTotal) * barMaxW);
          canvasContext.save();
          canvasContext.globalAlpha = isDark() ? 0.08 : 0.055;
          canvasContext.fillStyle = color(index, 1);
          canvasContext.fillRect(barX, y + rowH * 0.24, barW, rowH * 0.58);
          canvasContext.restore();
        }
      });
      return;
    }

    if (mode === "source") {
      const sourceMargin = {
        top: width < 520 ? 58 : 66,
        right: width < 520 ? 26 : 30,
        bottom: 34,
        left: width < 520 ? 96 : 136
      };
      const plotW = width - sourceMargin.left - sourceMargin.right;
      const plotH = height - sourceMargin.top - sourceMargin.bottom;
      const colW = plotW / sourceOrder.length;
      const rowH = plotH / familyOrder.length;
      sourceOrder.forEach((key, index) => {
        canvasText(shortSourceName(key), sourceMargin.left + index * colW + colW / 2, width < 520 ? 24 : 28, {
          fill: clusterFill,
          align: "center",
          size: width < 520 ? 9 : 11,
          weight: 800
        });
      });
      familyOrder.forEach((label, index) => {
        canvasText(shortFamily(label), sourceMargin.left - 12, sourceMargin.top + index * rowH + rowH * 0.62, {
          fill: clusterFill,
          align: "right",
          size: width < 520 ? 9 : 11,
          weight: 800
        });
      });
      return;
    }

    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;
    const cols = width < 520 ? 1 : 2;
    const rows = width < 520 ? scopeOrder.length : 3;
    const cellW = plotW / cols;
    const cellH = plotH / rows;
    scopeOrder.forEach((scope, index) => {
      const col = width < 520 ? 0 : index % cols;
      const row = width < 520 ? index : Math.floor(index / cols);
      canvasText(scopeNames[scope] || scope, margin.left + col * cellW + 4, margin.top + row * cellH + 16, {
        fill: clusterFill,
        size: 12,
        weight: 800
      });
    });
  }

  function canvasMarkForRow(row, mode, width, height) {
    const point = dotPosition(row, mode, width, height);
    const active = shouldHighlight(row);
    const index = mode === "scope" ? scopeOrder.indexOf(scopeKey(row)) : familyIndex(row.family_group_label);
    const useTopicColor = mode === "time-color" || mode === "topic" || mode === "source";
    const useScopeColor = mode === "scope";
    const scatterMode = mode === "pile" || mode === "scatter";
    const timeMode = mode === "time" || mode === "time-color";
    const topicMode = mode === "topic";
    const sourceMode = mode === "source";
    const fill = useTopicColor || useScopeColor
      ? color(index, active ? 0.82 : 0.16)
      : neutral(scatterMode ? 0.38 : 0.58);
    const radius = scatterMode
      ? (width < 520 ? 1.35 : 1.55)
      : timeMode
        ? (width < 520 ? 0.95 : 1.15)
        : topicMode || sourceMode
          ? (width < 520 ? 0.78 : 0.92)
          : (active ? 2.65 : 2.05);
    const opacity = active
      ? (scatterMode ? (isDark() ? 0.34 : 0.30) : (timeMode || topicMode || sourceMode) ? 0.78 : 0.92)
      : 0.18;
    return {
      id: row.event_cluster_id,
      row,
      x: point.x,
      y: point.y,
      fill: active ? fill : neutral(0.16),
      opacity,
      r: radius
    };
  }

  function paintCanvasMarks(marks, progress, width, height, mode) {
    canvasContext.clearRect(0, 0, width, height);
    drawCanvasLabels(mode, width, height);
    canvasContext.save();
    marks.forEach((mark) => {
      const previous = canvasLastPositions.get(mark.id);
      const startX = previous ? previous.x : mark.x;
      const startY = previous ? previous.y : mark.y;
      const x = startX + (mark.x - startX) * progress;
      const y = startY + (mark.y - startY) * progress;
      canvasContext.globalAlpha = mark.opacity;
      canvasContext.fillStyle = mark.fill;
      canvasContext.beginPath();
      canvasContext.arc(x, y, mark.r, 0, Math.PI * 2);
      canvasContext.fill();
    });
    canvasContext.restore();
  }

  function drawDots(mode) {
    const { width, height } = prepareCanvasScene();
    const events = state.data.events;
    const marks = events.map((row) => canvasMarkForRow(row, mode, width, height));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion || !canvasLastPositions.size ? 0 : 620;
    const start = performance.now();
    canvas.dataset.renderedPoints = String(marks.length);
    canvasHitPoints = marks;

    function frame(now) {
      const raw = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - raw, 3);
      paintCanvasMarks(marks, eased, width, height, mode);
      if (raw < 1) {
        canvasAnimation = requestAnimationFrame(frame);
      } else {
        canvasLastPositions = new Map(marks.map((mark) => [mark.id, { x: mark.x, y: mark.y }]));
      }
    }

    frame(start);
  }

  function clearAndSize() {
    showSvgSurface();
    const { width, height } = dims();
    clearStatic(width, height);
    return { width, height };
  }

  function activeTopic(defaultTopic = "Road safety") {
    const scene = scenes[state.activeStep] || {};
    const sceneDefault = scene.defaultFocus && scene.defaultFocus.type === "topic"
      ? scene.defaultFocus.value
      : defaultTopic;
    const focus = state.lockedFocus || state.focus;
    if (focus && focus.type === "topic") return focus.value;
    return sceneDefault;
  }

  function pathFromPoints(points) {
    return points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  }

  function areaFromPoints(points, baseY) {
    if (!points.length) return "";
    return `${pathFromPoints(points)} L ${points[points.length - 1].x.toFixed(2)} ${baseY.toFixed(2)} L ${points[0].x.toFixed(2)} ${baseY.toFixed(2)} Z`;
  }

  function drawMonthProfile() {
    const { width, height } = clearAndSize();
    const topic = activeTopic();
    const rows = state.data.monthlyTopic.filter((row) => row.topic_label === topic);
    const monthTotals = new Map();
    const yearMonthTotals = new Map();
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    rows.forEach((row) => {
      const year = number(row.event_year);
      const month = number(String(row.event_month).split("-")[1]);
      const count = number(row.event_count);
      monthTotals.set(month, (monthTotals.get(month) || 0) + count);
      const yearKey = String(year);
      if (!yearMonthTotals.has(yearKey)) yearMonthTotals.set(yearKey, new Map());
      const yearMap = yearMonthTotals.get(yearKey);
      yearMap.set(month, (yearMap.get(month) || 0) + count);
    });

    const margin = width < 520
      ? { top: 46, right: 84, bottom: 48, left: 36 }
      : { top: 58, right: 128, bottom: 52, left: 54 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const layerYears = [...yearMonthTotals.keys()]
      .map(Number)
      .filter((year) => year >= 2012 && year <= 2026)
      .sort((a, b) => a - b);
    const cumulative = new Map(months.map((month) => [month, 0]));
    const layers = layerYears.map((year) => {
      const yearMap = yearMonthTotals.get(String(year));
      const values = months.map((month) => {
        const y0 = cumulative.get(month) || 0;
        const value = yearMap.get(month) || 0;
        const y1 = y0 + value;
        cumulative.set(month, y1);
        return { month, value, y0, y1 };
      });
      return { year, total: values.reduce((sum, item) => sum + item.value, 0), values };
    });
    const maxValue = Math.max(1, ...months.map((month) => cumulative.get(month) || 0)) * 1.08;
    const xScale = scaleLinear(1, 12, margin.left, margin.left + plotW);
    const yScale = scaleLinear(0, maxValue, margin.top + plotH, margin.top);
    const topicColor = color(topicIndex(topic));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setYearFocus(year) {
      svg.querySelectorAll(".year-layer").forEach((node) => {
        node.classList.toggle("is-muted", node.dataset.year !== String(year));
        node.classList.toggle("is-focused", node.dataset.year === String(year));
      });
      svg.querySelectorAll(".year-key").forEach((node) => {
        node.classList.toggle("is-muted", node.dataset.year !== String(year));
        node.classList.toggle("is-focused", node.dataset.year === String(year));
      });
    }

    function clearYearFocus() {
      svg.querySelectorAll(".year-layer, .year-key").forEach((node) => {
        node.classList.remove("is-muted", "is-focused");
      });
    }

    [0, Math.round(maxValue / 2), Math.round(maxValue)].forEach((tick) => {
      svg.appendChild(textNode(formatCount(tick), {
        x: margin.left - 12,
        y: yScale(tick) + 4,
        "text-anchor": "end",
        class: "axis-label",
        "font-size": "11"
      }));
    });

    months.forEach((month, index) => {
      svg.appendChild(textNode(monthLabels[index], {
        x: xScale(month),
        y: height - 16,
        "text-anchor": "middle",
        class: "axis-label",
        "font-size": width < 520 ? "10" : "12"
      }));
    });

    layers.forEach((layer, index) => {
      const top = layer.values.map((item) => ({
        x: xScale(item.month),
        y: yScale(item.y1)
      }));
      const bottom = layer.values.slice().reverse().map((item) => ({
        x: xScale(item.month),
        y: yScale(item.y0)
      }));
      const path = `${pathFromPoints(top)} ${bottom.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ")} Z`;
      const fill = yearColor(index, layers.length, isDark() ? 0.24 : 0.18);
      const stroke = yearColor(index, layers.length, isDark() ? 0.44 : 0.34);
      const area = create("path", {
        d: path,
        class: "year-layer",
        "data-year": layer.year,
        fill,
        stroke,
        "stroke-width": 0.8
      });
      area.style.animationDelay = reducedMotion ? "0ms" : `${760 + Math.min(index, 16) * 70}ms`;
      area.addEventListener("mouseenter", (event) => {
        setYearFocus(layer.year);
        showTooltip(event, `${topic}: ${layer.year}`, `${formatCount(layer.total)} records`);
      });
      area.addEventListener("mousemove", moveTooltip);
      area.addEventListener("mouseleave", () => {
        clearYearFocus();
        hideTooltip();
      });
      svg.appendChild(area);
    });

    const legendX = width - margin.right + 22;
    const legendY = margin.top + 6;
    svg.appendChild(textNode("Years", {
      x: legendX,
      y: legendY - 14,
      class: "chart-label",
      "font-size": "12"
    }));
    layers.forEach((layer, index) => {
      const y = legendY + index * 16;
      const key = create("g", { class: "year-key", "data-year": layer.year });
      key.appendChild(create("circle", {
        cx: legendX,
        cy: y,
        r: 4,
        fill: yearColor(index, layers.length, isDark() ? 0.86 : 0.72)
      }));
      key.appendChild(textNode(String(layer.year), {
        x: legendX + 10,
        y: y + 4,
        class: "axis-label",
        "font-size": "11"
      }));
      key.addEventListener("mouseenter", (event) => {
        setYearFocus(layer.year);
        showTooltip(event, `${topic}: ${layer.year}`, `${formatCount(layer.total)} records`);
      });
      key.addEventListener("mousemove", moveTooltip);
      key.addEventListener("mouseleave", () => {
        clearYearFocus();
        hideTooltip();
      });
      svg.appendChild(key);
    });

    const totalPoints = months.map((month) => ({
        x: xScale(month),
        y: yScale(cumulative.get(month) || 0),
        value: cumulative.get(month) || 0
      }));

    svg.appendChild(create("path", {
      d: pathFromPoints(totalPoints),
      class: "month-total-line",
      fill: "none",
      stroke: topicColor,
      "stroke-width": width < 520 ? 2.4 : 3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    })).style.animationDelay = reducedMotion ? "0ms" : "1400ms";

    totalPoints.forEach((point, index) => {
      const dot = create("circle", {
        class: "month-total-dot",
        cx: point.x,
        cy: point.y,
        r: 4,
        fill: topicColor
      });
      dot.style.animationDelay = reducedMotion ? "0ms" : "1480ms";
      dot.addEventListener("mouseenter", (event) => showTooltip(event, `${topic}: ${monthLabels[index]}`, `${formatCount(point.value)} records, 2012-2026`));
      dot.addEventListener("mousemove", moveTooltip);
      dot.addEventListener("mouseleave", hideTooltip);
      svg.appendChild(dot);
    });

    svg.appendChild(textNode(`${topic}, January to December`, {
      x: margin.left,
      y: 18,
      class: "chart-label",
      "font-size": "13"
    }));
    svg.appendChild(textNode("Each layer is one year, 2012-2026.", {
      x: margin.left,
      y: 36,
      class: "axis-label",
      "font-size": "12"
    }));

    const sampleLimit = width < 520 ? 180 : 360;
    const sampleRows = state.data.events
      .filter((row) => hasTopic(row, topic))
      .slice(0, sampleLimit);
    const monthRanks = new Map();
    sampleRows.forEach((row) => {
      const month = number(String(row.event_month).split("-")[1]);
      const key = String(month);
      const rank = monthRanks.get(key) || 0;
      monthRanks.set(key, rank + 1);
      const start = dotPosition(row, "topic", width, height);
      const monthWidth = plotW / 12;
      const jitterX = (rand(row.event_cluster_id, "month-fold-x") - 0.5) * monthWidth * 0.56;
      const jitterY = (rand(row.event_cluster_id, "month-fold-y") - 0.5) * 8;
      const stackOffset = Math.min(42, Math.floor(rank / 2) * 2.8);
      const end = {
        x: xScale(month) + jitterX,
        y: margin.top + plotH - stackOffset + jitterY
      };
      const dot = create("circle", {
        class: "month-sample-dot",
        cx: 0,
        cy: 0,
        r: width < 520 ? 2.2 : 2.6,
        fill: color(topicIndex(topic), isDark() ? 0.68 : 0.58)
      });
      dot.style.transform = `translate(${start.x}px, ${start.y}px)`;
      dot.style.transitionDelay = reducedMotion ? "0ms" : `${Math.min(rank, 60) * 5}ms`;
      dot.addEventListener("mouseenter", (event) => showTooltip(event, row.title || topic, `${row.event_year} · tagged ${topic}`, row));
      dot.addEventListener("mousemove", moveTooltip);
      dot.addEventListener("mouseleave", hideTooltip);
      linkDataPoint(dot, row);
      svg.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${end.x}px, ${end.y}px)`;
        dot.style.opacity = isDark() ? "0.20" : "0.16";
      });
    });
  }

  function roadStackPoint(rank, total, bounds) {
    const metrics = roadStackMetrics(total, bounds);
    const col = rank % metrics.cols;
    const row = Math.floor(rank / metrics.cols);
    return {
      x: metrics.left + col * metrics.xPitch + metrics.xPitch / 2,
      y: metrics.bottom - row * metrics.yPitch - metrics.yPitch / 2
    };
  }

  function roadStackMetrics(total, bounds) {
    const count = Math.max(1, total);
    const xPitch = bounds.xPitch || bounds.spacing || 3.05;
    let yPitch = bounds.yPitch || bounds.spacingY || bounds.spacing || 3.25;
    const maxCols = Math.max(1, Math.floor(bounds.w / xPitch));
    const maxRows = Math.max(1, Math.floor(bounds.h / yPitch));
    const desiredRows = clamp(Math.ceil(Math.sqrt(count) * 2.15), 5, maxRows);
    let cols = clamp(Math.ceil(count / desiredRows), 1, maxCols);
    if (Math.ceil(count / cols) > maxRows) {
      cols = clamp(Math.ceil(count / maxRows), 1, maxCols);
    }
    const rows = Math.max(1, Math.ceil(count / cols));
    let stackH = rows * yPitch;
    if (stackH > bounds.h) {
      yPitch = bounds.h / rows;
      stackH = bounds.h;
    }
    const stackW = Math.min(bounds.w, cols * xPitch);
    return {
      cols,
      rows,
      xPitch,
      yPitch,
      left: bounds.x + (bounds.w - stackW) / 2,
      bottom: bounds.y + bounds.h,
      top: bounds.y + bounds.h - stackH
    };
  }

  function looseStackPoint(rank, total, bounds) {
    const spacing = bounds.spacing || 4.4;
    const cols = Math.max(1, Math.floor(bounds.w / spacing));
    const col = rank % cols;
    const row = Math.floor(rank / cols);
    const rows = Math.max(1, Math.ceil(total / cols));
    return {
      x: bounds.x + ((col + 0.5) / cols) * bounds.w,
      y: bounds.y + bounds.h - ((row + 0.5) / rows) * bounds.h
    };
  }

  function roadRowsByKey(rows, keyFn) {
    const groups = new Map();
    rows.forEach((row) => {
      const key = String(keyFn(row));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    groups.forEach((items) => {
      items.sort((a, b) => {
        const date = String(a.date || "").localeCompare(String(b.date || ""));
        if (date) return date;
        return String(a.event_cluster_id).localeCompare(String(b.event_cluster_id));
      });
    });
    return groups;
  }

  function roadTooltipBody(row, grain) {
    const vehicles = String(row.vehicle_types || row.vehicle_type || row.vehicle_primary || "")
      .split("|")
      .filter(Boolean)
      .map((vehicle) => vehicleNames[vehicle] || vehicle)
      .join(", ");
    const outcomes = [
      number(row.deaths) ? `${formatCount(row.deaths)} death${number(row.deaths) === 1 ? "" : "s"}` : "",
      number(row.injuries) ? `${formatCount(row.injuries)} injur${number(row.injuries) === 1 ? "y" : "ies"}` : "",
      number(row.hospitalized) ? `${formatCount(row.hospitalized)} hospitalized` : ""
    ].filter(Boolean).join(", ");
    const place = String(row.place || "").split("|").map((part) => part.trim()).filter(Boolean)[0];
    return [
      row.date || row.year,
      grain === "mention" ? (row.vehicle_label || vehicles) : vehicles,
      outcomes || row.outcome_class || "No death or injury number found",
      row.scope_bucket,
      place,
      row.publisher
    ].filter(Boolean).join(" · ");
  }

  function drawRoadLegend(rows, mode, width, margin) {
    const values = (() => {
      if (mode === "year") return (state.data.roadYears || []).map((year, index, all) => ({
        value: String(year),
        label: String(year),
        fill: yearColor(index, all.length, isDark() ? 0.86 : 0.74)
      }));
      if (mode === "month") return monthLabels.map((label, index) => ({
        value: String(index + 1),
        label,
        fill: monthColor(index + 1, isDark() ? 0.86 : 0.74)
      }));
      if (mode === "outcome") return outcomeOrder.map((outcome) => ({
        value: outcome,
        label: outcomeShort[outcome] || outcome,
        fill: outcomeColor(outcome, isDark() ? 0.88 : 0.76)
      }));
      return vehicleOrder.map((vehicle) => ({
        value: vehicle,
        label: vehicleNames[vehicle] || vehicle,
        fill: vehicleColor(vehicle, isDark() ? 0.88 : 0.76)
      }));
    })();

    const group = create("g", { class: "road-legend" });
    const title = mode === "year" ? "Year" : mode === "month" ? "Month" : mode === "outcome" ? "death/injury" : "Vehicle";
    group.appendChild(textNode(`Color: ${title.toLowerCase()}`, {
      x: margin.left,
      y: 16,
      class: "chart-label",
      "font-size": "12"
    }));

    if (mode === "year") {
      const years = state.data.roadYears || [];
      const counts = new Map();
      rows.forEach((row) => {
        const year = String(row.year);
        counts.set(year, (counts.get(year) || 0) + 1);
      });
      const stripW = Math.min(width - margin.left - margin.right, Math.max(220, years.length * 18));
      const xScale = scaleLinear(0, Math.max(1, years.length - 1), margin.left, margin.left + stripW);
      years.forEach((year, index) => {
        const x = xScale(index);
        const key = String(year);
        const count = counts.get(key) || 0;
        const marker = create("circle", {
          class: "year-key",
          "data-legend-value": key,
          cx: x,
          cy: 39,
          r: 4.2,
          fill: yearColor(index, years.length, isDark() ? 0.88 : 0.74),
          tabindex: "0"
        });
        function highlight(event) {
          svg.querySelectorAll(".road-dot").forEach((dot) => {
            dot.classList.toggle("is-muted", dot.dataset.legendValue !== key);
          });
          showTooltip(event, String(year), `${formatCount(count)} records`);
        }
        marker.addEventListener("mouseenter", highlight);
        marker.addEventListener("mousemove", moveTooltip);
        marker.addEventListener("mouseleave", () => {
          svg.querySelectorAll(".road-dot").forEach((dot) => dot.classList.remove("is-muted"));
          hideTooltip();
        });
        group.appendChild(marker);
      });
      [2007, 2011, 2016, 2021, 2026].forEach((year) => {
        const index = years.indexOf(year);
        if (index < 0) return;
        group.appendChild(textNode(String(year), {
          x: xScale(index),
          y: 59,
          class: "axis-label",
          "text-anchor": "middle",
          "font-size": "10"
        }));
      });
      svg.appendChild(group);
      return;
    }

    const maxW = width - margin.left - margin.right;
    let x = margin.left;
    let y = 36;
    values.forEach((item) => {
      const count = rows.filter((row) => roadValueFor(row, mode) === item.value).length;
      if (!count) return;
      const label = `${item.label} ${formatCount(count)}`;
      const chipW = Math.min(maxW, Math.max(52, label.length * 7.1 + 28));
      if (x + chipW > margin.left + maxW) {
        x = margin.left;
        y += 22;
      }
      const chip = create("g", {
        class: "road-legend-item",
        "data-legend-value": item.value,
        tabindex: "0"
      });
      chip.appendChild(create("circle", {
        cx: x + 7,
        cy: y - 4,
        r: 4,
        fill: item.fill
      }));
      chip.appendChild(textNode(label, {
        x: x + 18,
        y,
        class: "axis-label",
        "font-size": "11"
      }));
      function highlight(event) {
        svg.querySelectorAll(".road-dot").forEach((dot) => {
          dot.classList.toggle("is-muted", dot.dataset.legendValue !== item.value);
        });
        showTooltip(event, item.label, `${formatCount(count)} ${mode === "vehicle" ? "vehicle mentions" : "records"}`);
      }
      chip.addEventListener("mouseenter", highlight);
      chip.addEventListener("mousemove", moveTooltip);
      chip.addEventListener("mouseleave", () => {
        svg.querySelectorAll(".road-dot").forEach((dot) => dot.classList.remove("is-muted"));
        hideTooltip();
      });
      group.appendChild(chip);
      x += chipW + 8;
    });
    svg.appendChild(group);
  }

  function roadMarkColorValue(row) {
    return roadValueFor(row, roadColorBy());
  }

  function drawRoadDotChart(rows, layout, grain) {
    const { width, height } = clearAndSize();
    const mode = roadColorBy();
    const chartRows = mode === "outcome" || layout === "outcome"
      ? rows.filter((row) => outcomeOrder.includes(row.outcome_class))
      : rows;
    const compact = width < 560;
    const legendTop = mode === "year"
      ? (compact ? 86 : 78)
      : mode === "month"
        ? (compact ? 112 : 96)
        : (compact ? 92 : 88);
    const margin = layout === "outcome"
      ? (compact ? { top: legendTop, right: 24, bottom: 54, left: 112 } : { top: legendTop, right: 36, bottom: 64, left: 142 })
      : (compact ? { top: legendTop, right: 30, bottom: 54, left: 42 } : { top: legendTop, right: 54, bottom: 64, left: 58 });
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dotId = (row) => grain === "mention" ? `${row.event_cluster_id}|${row.vehicle_type}` : row.event_cluster_id;
    let positions = [];

    drawRoadLegend(chartRows, mode, width, margin);

    if (layout === "month" || layout === "weekday" || layout === "vehicle") {
      const labels = layout === "month"
        ? monthLabels.map((label, index) => ({ value: String(index + 1), label }))
        : layout === "weekday"
          ? weekdayLabels.map((label, index) => ({ value: String(index), label }))
          : vehicleOrder.map((vehicle) => ({ value: vehicle, label: vehicleNames[vehicle] || vehicle }));
      const keyFn = layout === "month"
        ? (row) => row.month
        : layout === "weekday"
          ? (row) => row.weekday
          : (row) => row.vehicle_type;
      const groups = roadRowsByKey(chartRows, keyFn);
      const maxTotal = Math.max(1, ...labels.map((item) => (groups.get(item.value) || []).length));
      const groupW = plotW / labels.length;
      const countGap = compact ? 16 : 18;
      const availableH = Math.max(20, plotH - countGap);
      labels.forEach((item, index) => {
        const center = margin.left + index * groupW + groupW / 2;
        const items = [...(groups.get(item.value) || [])].sort(roadSortForMode(mode));
        const h = Math.max(10, (items.length / maxTotal) * availableH);
        const bounds = {
          x: center - groupW * 0.39,
          y: margin.top + countGap + availableH - h,
          w: groupW * 0.78,
          h,
          spacing: compact ? 2.75 : 3.2,
          spacingY: compact ? 3.05 : 3.65
        };
        const stack = roadStackMetrics(items.length, bounds);
        svg.appendChild(textNode(item.label, {
          x: center,
          y: height - 20,
          "text-anchor": "middle",
          class: "axis-label",
          "font-size": compact ? "10" : "12"
        }));
        svg.appendChild(textNode(formatCount(items.length), {
          x: center,
          y: Math.max(margin.top + 12, stack.top - 7),
          "text-anchor": "middle",
          class: "cluster-label",
          "font-size": compact ? "10" : "12"
        }));
        items.forEach((row, rank) => {
          positions.push({ row, id: dotId(row), point: roadStackPoint(rank, items.length, bounds) });
        });
      });
    } else {
      const colW = plotW / vehicleOrder.length;
      const rowH = plotH / outcomeOrder.length;
      vehicleOrder.forEach((vehicle, index) => {
        svg.appendChild(textNode(vehicleNames[vehicle], {
          x: margin.left + index * colW + colW / 2,
          y: margin.top - 18,
          "text-anchor": "middle",
          class: "cluster-label",
          "font-size": compact ? "10" : "12"
        }));
      });
      outcomeOrder.forEach((outcome, index) => {
        svg.appendChild(textNode(outcomeShort[outcome], {
          x: margin.left - 14,
          y: margin.top + index * rowH + rowH / 2 + 4,
          "text-anchor": "end",
          class: "cluster-label",
          "font-size": compact ? "10" : "12"
        }));
      });
      const groups = roadRowsByKey(chartRows, (row) => `${row.vehicle_type}|${row.outcome_class}`);
      vehicleOrder.forEach((vehicle, colIndex) => {
        outcomeOrder.forEach((outcome, rowIndex) => {
          const key = `${vehicle}|${outcome}`;
          const items = groups.get(key) || [];
          const bounds = {
            x: margin.left + colIndex * colW + colW * 0.08,
            y: margin.top + rowIndex * rowH + rowH * 0.18,
            w: colW * 0.84,
            h: rowH * 0.58,
            spacing: compact ? 2.7 : 3.15,
            spacingY: compact ? 3 : 3.55
          };
          if (items.length) {
            const stack = roadStackMetrics(items.length, bounds);
            svg.appendChild(textNode(formatCount(items.length), {
              x: bounds.x + bounds.w / 2,
              y: Math.max(margin.top + 11, stack.top - 5),
              "text-anchor": "middle",
              class: "axis-label",
              "font-size": "10"
            }));
          }
          items.forEach((row, rank) => {
            positions.push({ row, id: dotId(row), point: roadStackPoint(rank, items.length, bounds) });
          });
        });
      });
    }

    const nextPositions = new Map();
    const fragment = document.createDocumentFragment();
    const dotUpdates = [];
    const dotRadius = compact ? 1.95 : 2.25;
    positions.forEach(({ row, id, point }, index) => {
      const eventStart = canvasLastPositions.get(String(row.event_cluster_id || "").split("|")[0]);
      const start = roadLastPositions.get(id) || eventStart || {
        x: margin.left + rand(id, "road-start-x") * plotW,
        y: margin.top + rand(id, "road-start-y") * plotH
      };
      const active = true;
      const dot = create("circle", {
        class: "road-dot",
        "data-id": id,
        "data-legend-value": roadMarkColorValue(row),
        cx: 0,
        cy: 0,
        r: dotRadius,
        fill: roadColorFor(row, isDark() ? 0.80 : 0.68),
        opacity: active ? (isDark() ? 0.82 : 0.74) : 0.18
      });
      dot.style.transform = `translate(${start.x}px, ${start.y}px)`;
      dot.style.transitionDelay = "0ms";
      dot.addEventListener("mouseenter", (event) => showTooltip(event, row.title || "Road incident", roadTooltipBody(row, grain), row));
      dot.addEventListener("mousemove", moveTooltip);
      dot.addEventListener("mouseleave", hideTooltip);
      linkDataPoint(dot, row);
      fragment.appendChild(dot);
      dotUpdates.push({ dot, point });
      nextPositions.set(id, point);
    });
    svg.appendChild(fragment);
    requestAnimationFrame(() => {
      dotUpdates.forEach(({ dot, point }) => {
        dot.style.transform = `translate(${point.x}px, ${point.y}px)`;
      });
    });
    roadLastPositions = nextPositions;
  }

  function drawRoadIncidents(layout) {
    drawRoadDotChart(state.data.roadIncidents || [], layout, "record");
  }

  function drawRoadVehicles(layout) {
    drawRoadDotChart(state.data.roadVehicleMentions || [], layout, "mention");
  }

  function shortFamily(label) {
    return {
      "Road safety": "Road",
      "Civic work": "Civic",
      "Rain and weather": "Rain",
      "Fire and emergency": "Fire",
      "Education": "Edu",
      "Governance": "Govt",
      "Public safety": "Safety"
    }[label] || label;
  }

  function shortSourceName(key) {
    return {
      daijiworld: "Daijiworld",
      mangalorean_com: "Mangalorean",
      nammakudla_news: "Namma Kudla",
      mangalore_today: "M'lore Today",
      other: "Other"
    }[key] || sourceNames[key] || key;
  }

  function newsHeadline(row) {
    return row.title || row.headline || row.selected_location_name || row.topic_label || "News record";
  }

  function showLoading(message) {
    showSvgSurface();
    const { width, height } = dims();
    clearStatic(width, height);
    svg.appendChild(textNode(message, {
      x: width / 2,
      y: height / 2,
      "text-anchor": "middle",
      class: "chart-label",
      "font-size": "16"
    }));
  }

  function renderTools(scene) {
    visualTools.innerHTML = "";
    const items = scene.tools ? scene.tools() : [];
    visualTools.hidden = !items.length;
    visualFrame.classList.toggle("has-tools", Boolean(items.length));
    items.forEach((item) => {
      const button = document.createElement("button");
      const colorSelected = item.kind === "color" && roadColorBy(scene) === item.value;
      const defaultSelected = item.kind !== "color" && !state.lockedFocus && !state.focus && scene.defaultFocus && scene.defaultFocus.type === item.type && scene.defaultFocus.value === item.value;
      const hoverSelected = item.kind !== "color" && !state.lockedFocus && state.focus && state.focus.type === item.type && state.focus.value === item.value;
      const selected = colorSelected || defaultSelected || hoverSelected || (item.kind !== "color" && state.lockedFocus && state.lockedFocus.type === item.type && state.lockedFocus.value === item.value);
      button.className = selected ? "tool-chip is-locked" : "tool-chip";
      button.type = "button";
      button.textContent = item.label;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      if (item.kind !== "color") {
        button.addEventListener("mouseenter", () => {
          state.focus = item;
          drawCurrentScene();
        });
        button.addEventListener("mouseleave", () => {
          state.focus = null;
          drawCurrentScene();
        });
      }
      button.addEventListener("click", () => {
        if (item.kind === "color") {
          state.colorBy = item.value;
        } else {
          state.lockedFocus = selected ? null : item;
        }
        renderFull();
      });
      visualTools.appendChild(button);
    });
  }

  function handleMapWheel(event) {
    const scene = scenes[state.activeStep] || scenes[0];
    if (scene.kind !== "map" || !currentMapNode || !currentMapCamera) return;
    event.preventDefault();

    const rect = svg.getBoundingClientRect();
    const { width, height } = dims();
    const px = ((event.clientX - rect.left) / Math.max(1, rect.width)) * width;
    const py = ((event.clientY - rect.top) / Math.max(1, rect.height)) * height;
    const current = manualMapCamera || currentMapCamera;
    const factor = Math.exp(-event.deltaY * 0.0011);
    const nextScale = clamp(current.scale * factor, 0.68, 4.2);
    const dataX = (px - current.x) / current.scale;
    const dataY = (py - current.y) / current.scale;
    manualMapCamera = clampManualMapCamera({
      x: px - dataX * nextScale,
      y: py - dataY * nextScale,
      scale: nextScale
    });
    applyMapCamera(currentMapNode, manualMapCamera, true);
  }

  function mapPointerPosition(event) {
    const rect = svg.getBoundingClientRect();
    const { width, height } = dims();
    return {
      x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * width,
      y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * height
    };
  }

  function handleMapPointerDown(event) {
    const scene = scenes[state.activeStep] || scenes[0];
    if (scene.kind !== "map" || !currentMapNode || !currentMapCamera || event.button !== 0) return;
    event.preventDefault();
    const point = mapPointerPosition(event);
    const camera = manualMapCamera || currentMapCamera;
    mapDrag = {
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      camera: { ...camera }
    };
    viewport.classList.add("is-panning");
    if (viewport.setPointerCapture) viewport.setPointerCapture(event.pointerId);
  }

  function handleMapPointerMove(event) {
    if (!mapDrag || mapDrag.pointerId !== event.pointerId || !currentMapNode) return;
    event.preventDefault();
    const point = mapPointerPosition(event);
    manualMapCamera = clampManualMapCamera({
      x: mapDrag.camera.x + point.x - mapDrag.startX,
      y: mapDrag.camera.y + point.y - mapDrag.startY,
      scale: mapDrag.camera.scale
    });
    applyMapCamera(currentMapNode, manualMapCamera, true);
  }

  function handleMapPointerEnd(event) {
    if (mapDrag && mapDrag.pointerId === event.pointerId && viewport.releasePointerCapture) {
      try {
        viewport.releasePointerCapture(event.pointerId);
      } catch (error) {
        // Pointer capture can already be released by the browser.
      }
    }
    mapDrag = null;
    viewport.classList.remove("is-panning");
  }

  function drawCurrentScene() {
    const scene = scenes[state.activeStep] || scenes[0];
    svg.classList.toggle("fit-chart", scene.fit);
    canvas.classList.toggle("fit-chart", scene.fit);
    svg.classList.toggle("dot-chart", scene.draw.name === "drawDots");
    if (!state.ready) {
      showLoading("Loading records");
      return;
    }
    scene.draw();
  }

  function alignViewportForScene(scene) {
    if (!window.matchMedia("(max-width: 840px)").matches || scene.fit) {
      viewport.scrollLeft = 0;
      return;
    }
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    viewport.scrollLeft = state.activeStep === 1 ? maxScroll : 0;
  }

  function renderFull() {
    const scene = scenes[state.activeStep] || scenes[0];
    visualFrame.classList.toggle("is-map", scene.kind === "map");
    chartKicker.textContent = scene.kicker;
    chartTitle.textContent = scene.title;
    chartNote.textContent = scene.note;
    if (chartSummary) chartSummary.textContent = scene.summary || `${scene.title}. ${scene.note}`;
    viewport.setAttribute("aria-label", `${scene.title}${/[.!?]$/.test(scene.title) ? "" : "."} ${scene.note}`);
    renderTools(scene);
    drawCurrentScene();
    if (state.needsScrollAlign) {
      requestAnimationFrame(() => alignViewportForScene(scene));
      state.needsScrollAlign = false;
    }
  }

  function setActiveStep(step) {
    const next = Math.max(0, Math.min(scenes.length - 1, Number(step) || 0));
    if (next === state.activeStep && state.ready) return;
    const currentScene = scenes[state.activeStep] || scenes[0];
    const nextScene = scenes[next] || scenes[0];
    state.activeStep = next;
    state.focus = null;
    state.lockedFocus = null;
    state.colorBy = null;
    manualMapCamera = null;
    if (currentScene.kind !== "map" || nextScene.kind !== "map") {
      lastMapCamera = null;
      currentMapCamera = null;
      currentMapNode = null;
      currentMapMarkers = [];
    }
    mapDrag = null;
    viewport.classList.remove("is-panning");
    state.needsScrollAlign = true;
    document.querySelectorAll(".step").forEach((node) => {
      node.classList.toggle("is-active", Number(node.dataset.step) === state.activeStep);
    });
    renderFull();
  }

  function setupScroll() {
    const steps = [...document.querySelectorAll(".step")];
    let frame = 0;

    function updateActiveFromGeometry() {
      const visual = document.querySelector(".visual");
      const visualRect = visual ? visual.getBoundingClientRect() : null;
      const smallLayout = window.matchMedia("(max-width: 840px)").matches;
      const targetY = smallLayout && visualRect
        ? Math.min(window.innerHeight * 0.70, Math.max(window.innerHeight * 0.45, visualRect.bottom + 24))
        : window.innerHeight * 0.52;
      let bestStep = state.activeStep;
      let bestDistance = Number.POSITIVE_INFINITY;
      steps.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top <= targetY && rect.bottom >= targetY) {
          bestStep = Number(node.dataset.step);
          bestDistance = -1;
          return;
        }
        if (bestDistance < 0) return;
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - targetY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestStep = Number(node.dataset.step);
        }
      });
      setActiveStep(bestStep);
    }

    function scheduleGeometryCheck() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveFromGeometry);
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) scheduleGeometryCheck();
    }, {
      root: null,
      threshold: [0.2, 0.45, 0.7],
      rootMargin: "-22% 0px -36% 0px"
    });

    steps.forEach((node) => observer.observe(node));
    window.addEventListener("scroll", scheduleGeometryCheck, { passive: true });
    window.addEventListener("resize", scheduleGeometryCheck);
    scheduleGeometryCheck();
  }

  function updateSummary() {
    const summary = state.data.manifest;
    const total = document.querySelector('[data-summary="total"]');
    const road = document.querySelector('[data-summary="road"]');
    const clear = document.querySelector('[data-summary="clear"]');
    if (total) total.textContent = formatCount(summary.total_event_clusters);
    if (road) road.textContent = formatCount(summary.top_family.event_count);
    if (clear) clear.textContent = formatCount(summary.clear_mangaluru_place_records);
  }

  function prepareEvents(events) {
    const prepared = events.map((row) => ({ ...row }));
    assignRanks(prepared, (row) => row.event_year, "_rankYear");
    assignRanks(prepared, (row) => row.family_group_label, "_rankFamily");
    assignRanks(prepared, (row) => `${row.family_group_label}|${row.event_year}`, "_rankFamilyYear");
    assignRanks(prepared, (row) => `${displaySourceKey(row)}|${row.family_group_label}`, "_rankSourceFamily");
    assignRanks(prepared, (row) => `${displaySourceKey(row)}|${row.event_year}`, "_rankSourceYear");
    assignRanks(prepared, (row) => scopeKey(row), "_rankScope");
    return prepared;
  }

  function prepareMapPoints(points) {
    const prepared = points
      .filter((row) => row.map_lat && row.map_lon && row.event_year)
      .map((row) => ({ ...row }));
    assignRanks(prepared, (row) => row.event_year, "_rankMapYear");
    assignRanks(prepared, (row) => row.selected_location_name || `${row.map_lat}|${row.map_lon}`, "_rankMapPlace");
    return prepared;
  }

  function boot() {
    if (window.MangaloreDataUI) {
      window.MangaloreDataUI.bindThemeToggle(document.querySelector(".theme-toggle"));
    }

    canvas.addEventListener("mousemove", handleCanvasHover);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("mouseleave", () => {
      activeCanvasArticleRow = null;
      canvas.classList.remove("has-article");
      hideTooltip();
    });
    viewport.addEventListener("wheel", handleMapWheel, { passive: false });
    viewport.addEventListener("pointerdown", handleMapPointerDown);
    viewport.addEventListener("pointermove", handleMapPointerMove);
    viewport.addEventListener("pointerup", handleMapPointerEnd);
    viewport.addEventListener("pointercancel", handleMapPointerEnd);

    showLoading("Loading records");
    Promise.all([
      loadJson("manifest.json"),
      loadCsv("family_summary.csv"),
      loadCsv("annual_family.csv"),
      loadCsv("monthly_family_source.csv"),
      loadCsv("monthly_topic.csv"),
      loadCsv("topic_summary.csv"),
      loadCsv("source_family.csv"),
      loadCsv("map_readiness_summary.csv"),
      loadCsv("mangalore_place_family.csv"),
      loadCsv("flood_weather_calendar.csv"),
      loadCsv("metric_family_fingerprint.csv"),
      loadCsv("map_points.csv"),
      loadJson("osm_map_context.geojson"),
      loadCsv("event_sample.csv"),
      loadCsv("road_incidents.csv"),
      loadCsv("road_vehicle_mentions.csv")
    ])
      .then(([manifest, familySummary, annualFamily, monthlyFamily, monthlyTopic, topicSummary, sourceFamily, mapReadiness, places, floodCalendar, metrics, mapPoints, mapContext, events, roadIncidents, roadVehicleMentions]) => {
        const preparedEvents = prepareEvents(events);
        const roadYears = [...new Set(roadIncidents.map((row) => number(row.year)).filter(Boolean))].sort((a, b) => a - b);
        state.data = {
          manifest,
          familySummary,
          annualFamily,
          monthlyFamily,
          monthlyTopic,
          topicSummary,
          sourceFamily,
          mapReadiness,
          places,
          floodCalendar,
          metrics,
          mapPoints: prepareMapPoints(mapPoints),
          mapContext,
          events: preparedEvents,
          roadIncidents,
          roadVehicleMentions,
          roadYears,
          maxYearTotal: Math.max(...preparedEvents.map((row) => number(row._rankYearTotal)), 1),
          maxFamilyTotal: Math.max(...preparedEvents.map((row) => number(row._rankFamilyTotal)), 1)
        };
        state.ready = true;
        updateSummary();
        setupScroll();
        renderFull();
      })
      .catch(() => {
        state.ready = false;
        showLoading("Could not load records");
      });

    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(renderFull);
    });
    resizeObserver.observe(viewport);

    window.addEventListener("mangalore-ui-state-change", renderFull);
  }

  boot();
}());
