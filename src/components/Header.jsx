import trollFace from "../assets/troll-face.png"

const Header = () => {
  return (
    <header className="header">
      <img 
        src={trollFace} 
      />
      <h1>Meme Generator</h1>
      <a href="https://github.com/binoydipu" target="_blank">&copy; Binoy Barman</a>
    </header>
  )
}

export default Header