import { gql, useSubscription } from "@apollo/client";
import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import dotenv from "dotenv";

const COOCKED_ORDERS_MUTATION = gql`
  subscription coockedOrders {
    cookedOrders {
      id
      status
      total
      driver {
        email
      }
      customer {
        email
      }
      restaurant {
        name
      }
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg ">🚘</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log("error", error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  });

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  return (
    <div>
      <div
        className=" overflow-hidden"
        style={{ width: "100%", height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals // 내 좌표를 지도 좌표로 옮김
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          defaultCenter={{
            lat: 55.58,
            lng: 12.95,
          }}
          //@ts-ignore
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng}></Driver>
        </GoogleMapReact>
      </div>
    </div>
  );
};
