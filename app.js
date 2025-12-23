// 1) Get an OpenWeatherMap API key and paste it here:
const API_KEY = "a9502a07d48e3e05b57308a90b7dc9c2";

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");

const messageEl = document.getElementById("message");
const resultEl = document.getElementById("result");

const placeEl = document.getElementById("place");
const descEl = document.getElementById("desc");
const tempEl = document.getElementById("temp");
const feelsEl = document.getElementById("feels");
const iconEl = document.getElementById("icon");

function setMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = "message" + (type ? ` ${type}` : "");
}

function showResult(show) {
  resultEl.classList.toggle("hidden", !show);
}

async function getWeather(city) {
  // Using Current Weather Data endpoint
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric"); // Celsius

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    // OpenWeatherMap often returns { message: "...", cod: "404" }
    const msg = data?.message ? data.message : "Request failed.";
    throw new Error(msg);
  }
  return data;
}

function renderWeather(data) {
  const name = data?.name ?? "";
  const country = data?.sys?.country ?? "";
  const description = data?.weather?.[0]?.description ?? "";
  const icon = data?.weather?.[0]?.icon ?? "";
  const temp = Math.round(data?.main?.temp ?? 0);
  const feels = Math.round(data?.main?.feels_like ?? 0);

  placeEl.textContent = country ? `${name}, ${country}` : name;
  descEl.textContent = description ? description[0].toUpperCase() + description.slice(1) : "";
  tempEl.textContent = temp;
  feelsEl.textContent = feels;

  if (icon) {
    iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    iconEl.alt = description || "Weather icon";
  } else {
    iconEl.removeAttribute("src");
    iconEl.alt = "";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  showResult(false);

  if (!city) {
    setMessage("Please enter a city name.", "error");
    return;
  }
  if (!API_KEY || API_KEY.includes("PASTE_YOUR")) {
    setMessage("Add your OpenWeatherMap API key in app.js first.", "error");
    return;
  }

  try {
    setMessage("Loading...", "ok");
    const data = await getWeather(city);
    renderWeather(data);
    setMessage("Done.", "ok");
    showResult(true);
  } catch (err) {
    setMessage(`Error: ${String(err.message || err)}`, "error");
  }
});
