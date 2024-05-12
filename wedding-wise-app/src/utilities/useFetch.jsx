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

  async function getData(URL) {
    try {
      setLoading(true);
      const response = await fetch(URL);
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
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      console.log(response);
      if (!response.ok) {
        return setError(response.status);
      }
      var responseData = await response.json();
      setResData(responseData);
    } catch (error) {
      setError(responseData);
    } finally {
      setLoading(false);
    }
  }

  return { resData, loading, error, getData, sendData };
}

export default useFetch;