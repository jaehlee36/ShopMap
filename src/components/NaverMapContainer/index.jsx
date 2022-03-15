import React, { useEffect, useState } from "react";

const containerStyle = {
  flex: 1,
  height: 400,
};
const { naver } = window;

// 이미지 관련 파일
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
    const markerOptions = {
      position: shopData[i].latlng, // 마커를 표시할 위치
      map, // 마커를 표시할 지도
      title: shopData[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
      // icon: {
      //   url: "../../../logo512.png",
      //   size: new naver.maps.Size(22, 35),
      //   origin: new naver.maps.Point(0, 0),
      //   anchor: new naver.maps.Point(11, 35),
      // },
    };
    const marker = new naver.maps.Marker(markerOptions);
    markers.push(marker);

    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    naver.maps.Event.addListener(marker, "click", markerClickListener(marker));
    marker.setMap(map); // 마커를 지도에 표시
  }
}

function removeMarkers() {
  for (let i = 0; i < markers.length; i += 1) {
    markers[i].setMap(null);
  }
}

const NaverMapContainer = () => {
  const [testText, setTestText] = useState("리렌더링됨");
  useEffect(() => {
    // 지도를 생성합니다
    const mapOption = {
      center: new naver.maps.LatLng(37.3595704, 127.105399), // 지도의 중심좌표
      zoom: 14, // 지도의 확대 레벨
      disableKineticPan: false,
      logoControl: false,
      minZoom: 11, // 최소 줌 레벨
      // tileSpare // 지도의 크기보다 보다 여유있게 로딩할 타일의 개수를 지정합니다
      // tileTransition: false, // 지도 타일을 전환할 때 페이드 인 효과(타일이 서서히 나타나는 것)의 사용 여부입니다
    };
    const map = new naver.maps.Map("map", mapOption); // 지도 생성

    // RN으로부터 데이터 받는 message 이벤트핸들러
    document.addEventListener("message", (e) => {
      removeMarkers(); // 마커 제거
      const shopData = JSON.parse(e.data)?.map((test) => {
        return {
          title: test.title,
          // id: test.id,
          latlng: new naver.maps.LatLng(test.latlng[0], test.latlng[1]),
        };
      });
      // setTestText("shopData " + JSON.stringify(shopData));
      setMarkers(shopData, map);
    });
    // 중심 좌표나 확대 수준이 변경되면 발생한다. 단, 애니메이션 도중에는 발생하지 않는다.
    // 드래그 끝난 후 dragend 이벤트핸들러의 경우 확대/축소로 인한 중심좌표 변경시 동작하지않는다
    naver.maps.Event.addListener(map, "idle", () => {
      // 지도의 중심좌표를 얻어옵니다
      const latlng = map.getCenter() || "no Center";
      const data = {
        type: "dragend",
        payload: [latlng._lat, latlng._lng],
      };
      window.ReactNativeWebView?.postMessage(JSON.stringify(data));
    });
    console.log(map, markers);
  }, []);
  return (
    <div>
      <div className="map" id="map" style={containerStyle}></div>
      <p id="result">{testText}</p>
    </div>
  );
};

export default NaverMapContainer;
