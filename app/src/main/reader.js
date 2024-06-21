// Float random
function random(min, max) {
  return Math.random() * (max - min) + min
}

// Int random
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Read data API
function read() {
  return {
    velocity: random(0, 250),
    rpms: randomInt(0, 8000),
    gear: randomInt(0, 6),
    throttle: random(0, 100),
    brake: random(0, 100),
    lateral_g: random(0, 3),
    tire_pressure_fl: random(0, 50),
    tire_pressure_fr: random(0, 50),
    tire_pressure_rl: random(0, 50),
    tire_pressure_rr: random(0, 50),
    steering_angle: randomInt(-270, 270),
    fuel: random(0, 100),
    temperature: random(0, 100),
    oil_pressure: random(0, 100)
  }
}

export default read
