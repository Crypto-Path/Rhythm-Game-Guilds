import * as React from "react";

export const Background = ({}) => {
    const [src, setSrc] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    const generateNewBackground = () => {
        var randomNumber = Math.floor(Math.random() * 40000); // Generate a random number between 0 and 39999
        var imageUrl = `https://cdn.quavergame.com/mapsets/${randomNumber}.jpg`;

        var img = new Image();
        img.src = imageUrl;
        img.onload = function() {
            console.log("img:", img)
            console.log("Image Loaded:", imageUrl);
            setLoading(false);
            setSrc(imageUrl)
        };
        img.onerror = function() {
            console.log("Image load error, retrying...")
            generateNewBackground(); // Retry if image not found
        };
    }

    React.useEffect(() => {
        generateNewBackground(); // Call generateNewBackground when component mounts
    }, []);

    return (
        <>
            {!loading && (
                <div id="BackgroundContainer">
                    <div id="Background" style={{ backgroundImage: `url(${src})` }}></div>
                    <div className="overlay"></div>
                </div>
            )}
        </>
    )
}