// Float random
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Int random
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Read data API
function read() {
    return {
        "speed": random(0, 250),
        "rpms": randomInt(0, 8000),
        "gear": randomInt(0, 6),
        "acceleration": random(0, 100),
        "brake": random(0, 100),
        "gs": random(0, 3),
        "psi": random(0, 50),
        "steer": randomInt(-270, 270),
        "fuel": random(0, 100),
        "temp": random(0, 100),
        "oil": random(0, 100),
    }
}

export default read