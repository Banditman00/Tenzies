export default function Die(prop) {
   const styles = {
        backgroundColor: prop.isHeld ? "#59E391" : "white"
    }
    return ( 
        <div onClick={prop.toggle}  className="die-face" style={styles}>
           <h2 className="die-num">{prop.value}</h2>
        </div>
    )
}