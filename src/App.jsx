// src/App.jsx
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

// Leaflet 마커 아이콘 설정 (이미지 깨짐 방지)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center = [37.5665, 126.978]; // 서울 시청 기준

function App() {
  // 🔹 CSV 데이터 상태
  const [edaRows, setEdaRows] = useState([]);

  // 🔹 CSV 불러오기 (public 폴더의 파일)
  useEffect(() => {
    d3.csv("/seoul_noise_EDA_by_neighborhood.csv").then((data) => {
      setEdaRows(data.slice(0, 20)); // 앞 20개 레코드만 표시
    });
  }, []);

  return (
    <div className="app">
      {/* 헤더 */}
      <header className="hero">
        <h1 className="title">The Shape of Quiet</h1>
        <p className="subtitle">서울의 소리로 나만의 동네를 찾는 감성 데이터 지도</p>
      </header>

      {/* 지도 */}
      <section className="map-section">
        <h2 className="section-title">서울 노이즈 맵</h2>
        <p className="section-subtitle">
          지도를 움직이며 “내가 선호하는 소리의 분위기”를 상상해 보세요.
        </p>

        <div className="map-wrapper">
          <MapContainer center={center} zoom={11} className="map">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
              <Popup>서울 중심 (City Hall)</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>

      {/* EDA 리스트 */}
      <section className="eda-section">
        <h2>동네별 소리 프로필 (EDA)</h2>
        <p>CSV에서 불러온 동네별 주·야간 소음과 편차를 보여줍니다.</p>

        <ul className="eda-list">
          {edaRows.map((row, i) => (
            <li key={i}>
              <strong>
                {row["행정구"]} {row["측정지역"]}
              </strong>
              <br />
              주간 {Number(row["주간평균_mean"]).toFixed(1)} dB / 야간{" "}
              {Number(row["야간평균_mean"]).toFixed(1)} dB · 편차{" "}
              {Number(row["편차_mean"]).toFixed(1)} dB
              <br />
              {/* 간단한 분류 */}
              {Number(row["편차_mean"]) >= 5
                ? "낮–지배형 (상권/오피스)"
                : "낮·밤 균형형"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
