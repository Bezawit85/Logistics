

const FetchData = async( url,name)=>{
    setLoading(true);
    try {
      const res = await fetch(url, options);
      if (res.status == 401) {
        //showErrorMessage();
        showErrorMessage({
          message: "Unable to Load!! server respond with 401",
        });
      }
      const data = await res.json();
      if (data && res.ok) {
        setRole(data.name);
      }
      if (res.status == 400) {
        setError("Invalid API server 400");
      }
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setLoading(false);
    }
}