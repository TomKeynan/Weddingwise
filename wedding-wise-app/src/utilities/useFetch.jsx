import { useEffect, useState } from "react";

function useFetch() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    )
      setBaseUrl("https://localhost:44359/api");
    else setBaseUrl("https://proj.ruppin.ac.il/cgroup70/test2/tar1/api");
  }, []);

  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  // const [error, setError] = useState({ isError: false, status: "" });

  async function getData(endpoint) {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (!response.ok) {
        setError(true);
        return;
      }
      const responseData = await response.json();
      setResData(responseData);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function sendData(endpoint, method, bodyData) {
    // debugger;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accept: "application/json; charset=UTF-8",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        return setError(response.status);
      }
      // possible responses form server:
      // 1. empty response(only status code is getting returned)
      // 2. json object with some data
      var responseData;
      // first read the response content
      const textRes = await response.text();
      // then check if the response has a content
      if (!textRes) {
        return setResData(response.status);
      } else {
        // if there is a content parse it to json
        responseData = JSON.parse(textRes);
        setResData(responseData);
      }
    } catch (error) {
      if (!error?.response) setError(500);
      else setError(responseData);
    } finally {
      setLoading(false);
    }
  }

  return { resData, loading, error, setResData, setError, getData, sendData };
}

export default useFetch;
