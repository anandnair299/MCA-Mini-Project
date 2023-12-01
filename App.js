import { useState } from 'react';
import './App.css';
import Axios from 'axios';
function App() {
  const [predict, setPredict] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPredict("")
    const imagePreview = document.getElementById("image-preview");
  while (imagePreview.firstChild) {
    imagePreview.removeChild(imagePreview.firstChild);
  }

  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      image.style.width = "200px";
      image.style.height = "200px";
      imagePreview.appendChild(image);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  

  const getPrediction = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Make a POST request to your API endpoint with FormData
    Axios.post("http://127.0.0.1:5000/predict", formData)
      .then((response) => {
        console.log("pstart")
        setPredict(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error predicting:", error);
      });
  };


 
  return (
    <div className="App" style={{ backgroundColor: '#b3cccc',height: '100vh' }}>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#"><h1><b>PNEUMONIA DETECTOR</b></h1></a>
  </div>
</nav>
      <div style={{ paddingTop: '450px',width:"500px"}} className='App-main-div'>
      <div> 
      <label className="form-label" ><h4>Upload your Chest X-Ray(JPEG)</h4></label><br/>
      <input type="file" accept=".jpeg, .jpg" className="form-control" id="img" onChange={handleFileChange} style={{ width: '500px',height:'50px' }}/>
      </div>
      <div align="center" style={{ paddingTop: '50px',paddingBottom:'50px' }}>
      <input className="btn btn-primary" type="submit" value="Submit" onClick={getPrediction} style={{ width: '300px',height:'50px' }}></input>
      </div>
      <div id="image-preview" style={{ border: '2px solid #333'}}>
      </div>
      <div align="center" style={{ paddingTop: '50px' }}>
        <h3>{predict}</h3>
      </div>
      </div>
    </div>
  );
}

export default App;
