"use client"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=52.22&lon=21.01&appid=6e7d5c4fd45f2696a2550b12a8d6d289&units=metric");
        const jsonData = await res.json();
        console.log(jsonData); 
        setData(jsonData);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
  };

  const roundTemperature = (temp) => {
    return Math.round(temp);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {data && (
        <>
          <Card className="mb-12 bg-gray-800 p-8">
            <CardContent>
              <div className="flex items-center justify-center">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {roundTemperature(data.list[0].main.temp)} °C
                </h1>
              </div>

              <div className="flex items-center justify-center mb-4">
                <img
                  src={`https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`}
                  alt={data.list[0].weather[0].description}
                  className="w-20 h-20"
                />
              </div>

              <div className="flex flex-row gap-[2px] items-center justify-center">
                <p className="leading-7 mt-6">{data.city.name} | </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">{data.list[0].weather[0].description} | </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">{data.list[0].main.pressure} hPa | </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">{data.list[0].wind.speed} m/s</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-auto">
            {[8, 16, 24, 32].map((index) => (
              <Card key={index} className="p-8 rounded shadow-lg text-center bg-gray-800">
                <CardContent>
                  <p className="text-sm text-muted-foreground">{formatDate(data.list[index].dt_txt)}</p>

                  <div className="flex items-center justify-center">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                      {roundTemperature(data.list[index].main.temp)} °C
                    </h1>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <img
                      src={`https://openweathermap.org/img/wn/${data.list[index].weather[0].icon}@2x.png`}
                      alt={data.list[index].weather[0].description}
                      className="w-20 h-20"
                    />
                  </div>

                  <div className="flex flex-row gap-[2px] items-center justify-center">
                    <p className="leading-7 mt-6">{data.city.name} | </p>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">{data.list[index].weather[0].description} | </p>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">{data.list[index].main.pressure} hPa | </p>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">{data.list[index].wind.speed} m/s</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
