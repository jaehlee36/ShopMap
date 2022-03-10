import './App.css';
import { useEffect, useState } from 'react';

const containerStyle= {
  flex: 1,
  height: '100%',
}
// var shopData = [
//   {
//       title: '카카오', 
//       latlng: new window.kakao.maps.LatLng(33.450705, 126.570677),
//       id: 'a1',
//   },
//   {
//       title: '생태연못', 
//       latlng: new window.kakao.maps.LatLng(33.450936, 126.569477),
//       id: 'a2',
//   },
//   {
//       title: '텃밭', 
//       latlng: new window.kakao.maps.LatLng(33.450879, 126.569940),
//       id: 'a3',
//   },
//   {
//       title: '근린공원',
//       latlng: new window.kakao.maps.LatLng(33.451393, 126.570738),
//       id: 'a4',
//   }
// ];
function App() {
  console.log('App created!');
  const [shopData, setShopData] = useState([
    {
    title: '카카오3',
    latlng: new window.kakao.maps.LatLng(33.450705, 126.570677),
    // id: 'a1',
    },
  ]);
  useEffect(() => {     
    // 카카오
    const mapContainer = document.getElementById('map'); // 지도를 표시할 div  
    const mapOption = { 
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
    const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도 생성
    console.log('map created!!');
    // var zoomControl = new window.kakao.maps.ZoomControl(); // 줌 컨트롤러 생성
    // map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // 마커 이미지의 이미지 주소
    var imageSize = new window.kakao.maps.Size(24, 35); // 마커 이미지의 이미지 크기 입니다
    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성합니다

    for (var i = 0; i < shopData.length; i ++) {
      console.log('marker updated!!');
      // 마커 생성
      var marker = new window.kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: shopData[i].latlng, // 마커를 표시할 위치
          title : shopData[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image : markerImage, // 마커 이미지 
          clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정,
          // id: shopData[i].id,
      });
      var iwContent = `<div class ="label"><span class="left"></span><span class="center">${shopData[i].title}</span><span class="right"></span></div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      // var iwContent2 = `<div class ="overlayDiv"><span class="overlaySpan">${shopData[i].title}</span></div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      // 커스텀 오버레이를 생성합니다
      var customOverlay = new window.kakao.maps.CustomOverlay({
        position: shopData[i].latlng,
        content: iwContent,
        map: map
      });
      customOverlay.setMap(map);
      
      // 이벤트 리스너로는 클로저를 만들어 등록합니다 
      // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
      window.kakao.maps.event.addListener(marker, 'click', markerClickListener(map, marker));
      marker.setMap(map); // 마커를 지도에 표시
      // window.ReactNativeWebView?.postMessage("Hello!")
    }
    
    // 드래그 끝난 후 dragend 이벤트핸들러
    window.kakao.maps.event.addListener(map, 'dragend', function() {

      // 지도의  레벨을 얻어옵니다
      var level = map.getLevel();
      // 지도의 중심좌표를 얻어옵니다 
      var latlng = map.getCenter() || 'no Center';
      var data = {
        type: 'dragend',
        payload: latlng
      }
      var message = '<p>지도 레벨은 ' + level + ' 이고</p>';
      message += '<p>중심 좌표는 위도 ' + latlng.getLat() + ', 경도 ' + latlng.getLng() + '입니다</p>';
      console.log('dragend data : ', JSON.stringify(data))
      window.ReactNativeWebView?.postMessage(JSON.stringify(data));
      // var resultDiv = document.getElementById('result');
      // resultDiv.innerHTML = message;
    });

    // window.kakao.maps.event.addListener(map, 'click', clickListner)
    function markerClickListener(map, marker) {
      return function() {
        const title = marker.getTitle();
        const data = {
          type: 'markerClick',
          payload: title, 
        }
        console.log('markerClick data: ', JSON.stringify(data));
        window.ReactNativeWebView?.postMessage(JSON.stringify(data));
      };
    }
    // function clickListner(mouseEvent) {
    //   window.ReactNativeWebView?.postMessage('');
    // }
    document.addEventListener('message', e => {
      const shop = JSON.parse(e.data).map(test => {
        return ({
          title: test.title,
          // id: test.id,
          latlng: new window.kakao.maps.LatLng(test.latlng[0], test.latlng[1])
        })
      })
      setShopData(shop);
    });

  }, [shopData])

  return (
    <div className="App">
      <div className="map" id="map" style={containerStyle}></div>
    </div>
  );
} 

export default App;
