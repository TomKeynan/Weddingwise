import { useEffect, useState } from "react";

function useFetch() {
  useEffect(() => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    )
      setApi("https://localhost:44343/api/");
    else setApi("https://proj.ruppin.ac.il/cgroup70/test2/tar1/api/");
  }, []);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //   useEffect(() => {
  //     if (method === undefined) return;
  //     if (method !== "GET") {
  //       sendData();
  //     } else {
  //       fetchData();
  //     }
  //   }, []);

  async function getData(URL, successCB) {
    try {
      setLoading(true);
      const response = await fetch(URL);
      if (!response.ok) {
        setError(true);
        return;
      }
      const responseData = await response.json();
      //....successCB
      setData(responseData);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function sendData(URL, method = "GET", bodyData = undefined) {
    // console.log("URL:", URL)
    // console.log("method:", method)
    // console.log("bodyData:", bodyData)
    // if (bodyData === undefined)
    //   console.log("you forgot to pass the data to useFetch hook!!");
    try {
      setLoading(true);
      const response = await fetch(URL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  // async function sendData(URL, method, bodyData = undefined) {
  //   // console.log("URL:", URL)
  //   // console.log("method:", method)
  //   // console.log("bodyData:", bodyData)
  //   if (bodyData === undefined)
  //     console.log("you forgot to pass the data to useFetch hook!!");
  //   try {
  //     setLoading(true);
  //     const response = await fetch(URL, {
  //       method: method,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(bodyData),
  //     });
  //     const responseData = await response.json();
  //     setData(responseData);
  //   } catch (error) {
  //     console.log(error);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return { data, loading, error, getData, sendData };
}

export default useFetch;
