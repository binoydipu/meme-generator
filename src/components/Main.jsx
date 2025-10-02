import { useState, useEffect, useRef } from "react"
import html2canvas from "html2canvas";

const Main = () => {
  // Utility: fetch image as blob → convert to base64
  const convertToBase64 = async (url) => {
    const response = await fetch(url, { mode: "cors" })
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  const [meme, setMeme] = useState({
    topText: "One does not simply",
    bottomText: "Walk into Mordor",
    imageUrl: "https://i.imgflip.com/1bij.jpg"
  })

  const memeRef = useRef(null)

  const [allMemes, setAllMemes] = useState([])

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => setAllMemes(data.data.memes))
    
    const defaultImg = "http://i.imgflip.com/1bij.jpg";
    convertToBase64(defaultImg).then(base64Img => {
      setMeme(prev => ({
        ...prev,
        imageUrl: base64Img
      }));
    });
  }, [])

  const handleChange = (event) => {
    const { value, name } = event.currentTarget
    setMeme(prevMeme => {
      return {
        ...prevMeme,
        [name]: value
      }
    })
  }

  const getRandomMeme = async () => {
    const randomNumber = Math.floor(Math.random() * allMemes.length)
    const newMemeUrl = allMemes[randomNumber].url

    const base64Img = await convertToBase64(newMemeUrl);

    setMeme(prevMeme => {
      return {
        ...prevMeme,
        imageUrl: base64Img
      }
    })
  }

  const saveMeme = () => {
    html2canvas(memeRef.current).then(canvas => {
      const link = document.createElement("a")
      link.download = "meme.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    })
  }

  return (
    <main>
      <div className="form">
        <label>Top Text
          <input
            type="text"
            placeholder="One does not simply"
            name="topText"
            onChange={handleChange}
            value={meme.topText}
          />
        </label>

        <label>Bottom Text
          <input
            type="text"
            placeholder="Walk into Mordor"
            name="bottomText"
            onChange={handleChange}
            value={meme.bottomText}
          />
        </label>
        <button
          onClick={getRandomMeme}
        >Get a new meme image 🖼️</button>
      </div>
      <div ref={memeRef} className="meme">
        <img src={meme.imageUrl} alt="meme" />
        <span className="top">{meme.topText}</span>
        <span className="bottom">{meme.bottomText}</span>
      </div>
      <button className="save-meme-btn" onClick={saveMeme}>
        💾 Save Meme
      </button>
    </main>
  )
}

export default Main