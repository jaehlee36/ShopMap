import React, { useEffect } from "react";

const containerStyle = {
  flex: 1,
  height: 400,
};
const {kakao} = window;
const imageSize = new kakao.maps.Size(24, 35); // 마커 이미지의 이미지 크기 입니다
const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지의 이미지 주소
const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성합니다
const markers = [];

function setMarkers(shopData, map) {
  function markerClickListener(marker) {
    return function () {
      const title = marker.getTitle();
      const data = {
        type: "markerClick",
        payload: title,
      };
      console.log("markerClick data: ", JSON.stringify(data));
      window.ReactNativeWebView?.postMessage(JSON.stringify(data));
    };
  }

  for (let i = 0; i < shopData.length; i += 1) {
    // 마커 생성
    const marker = new kakao.maps.Marker({
      map, // 마커를 표시할 지도
      position: shopData[i].latlng, // 마커를 표시할 위치
      title: shopData[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      image: markerImage, // 마커 이미지
      clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정,
      // id: shopData[i].id,
    });

    // 커스텀 오버레이를 생성합니다
    // const iwContent = `<div class ="label"><span class="left"></span><span class="center">${shopData[i].title}</span><span class="right"></span></div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    // const iwContent2 = `<div class ="overlayDiv"><span class="overlaySpan">${shopData[i].title}</span></div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    // const customOverlay = new kakao.maps.CustomOverlay({
    //     position: shopData[i].latlng,
    //     content: iwContent,
    //     map,
    // });
    // customOverlay.setMap(map);

    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    kakao.maps.event.addListener(
      marker,
      "click",
      markerClickListener(marker)
    );
    marker.setMap(map); // 마커를 지도에 표시
    markers.push(marker);
  }
}

function removeMarkers() {
  for (let i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
}

const MapContainer = () => {
  console.log("MapContainer created!");
  useEffect(() => {
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 4, // 지도의 확대 레벨
    };
    const map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
    // map.setMaxLevel(7); // 지도 최대 확대 레벨

    // RN으로부터 데이터 받는 meesage 이벤트핸들러
    document.addEventListener("message", (e) => {
      removeMarkers(); // 마커 제거
      const shopData = JSON.parse(e.data)?.map((test) => {
        return {
          title: test.title,
          // id: test.id,
          latlng: new kakao.maps.LatLng(test.latlng[0], test.latlng[1]),
        };
      });
      setMarkers(shopData, map);
    });
    // 중심 좌표나 확대 수준이 변경되면 발생한다. 단, 애니메이션 도중에는 발생하지 않는다.
    // 드래그 끝난 후 dragend 이벤트핸들러의 경우 확대/축소로 인한 중심좌표 변경시 동작하지않는다
    kakao.maps.event.addListener(map, "idle", () => {
      // 지도의  레벨을 얻어옵니다
      // const level = map.getLevel();
      // let message = `<p>지도 레벨은 ${level} 이고</p> <p>중심 좌표는 위도 ${latlng.getLat()}, 경도 ${latlng.getLng()}입니다</p>`;

      // 지도의 중심좌표를 얻어옵니다
      const latlng = map.getCenter() || "no Center";
      const data = {
        type: "dragend",
        payload: [latlng.getLat(), latlng.getLng()],
      };
      window.ReactNativeWebView?.postMessage(JSON.stringify(data));
    });
  });

  return (
      <div className="map" id="map" style={containerStyle}></div>
  );
};

export default MapContainer;
