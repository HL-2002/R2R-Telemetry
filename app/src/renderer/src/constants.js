export default {
  TypesEvents: [
    {
      name: 'Acceleration',
      graph: ['velocity', 'rpms', 'gear', 'throttle']
    },
    {
      name: 'Skidpad',
      graph: ['velocity', 'rpms', 'gear', 'lateral_g', 'throttle', 'brake', 'steering_angle']
    },
    {
      name: 'Autocross',
      graph: ['velocity', 'rpms', 'gear', 'throttle', 'brake', 'steering_angle']
    },
    {
      name: 'Endurance',
      graph: ['velocity', 'rpms', 'gear', 'throttle', 'brake', 'steering_angle']
    },
    {
      name: 'Personalizado',
      graph: []
    }
  ],

  Allgraph: ['velocity', 'rpms', 'gear', 'lateral_g', 'throttle', 'brake', 'steering_angle'],
  AllgraphSafe: [
    'tire_pressure_fl',
    'tire_pressure_fr',
    'tire_pressure_rl',
    'tire_pressure_rr',
    'fuel',
    'temperature',
    'oil_pressure'
  ],
  Stats: [
    '0-100',
    '0-200',
    '75m',
    'Max Gs',
    'KM/L'
  ],
  Capacity: 30,
  BorderColors: [
    'RGBA(236, 109, 45, 1)', 
    'RGBA(55, 162, 235, 1)', 
    'RGBA(255, 205, 86, 1)', 
    'RGBA(255, 75, 110, 1)'
  ],
  BackgroundColors: [
    'RGBA(236, 109, 45, 0.41)', 
    'RGBA(55, 162, 235, 0.41)',
    'RGBA(255, 205, 86, 0.41)', 
    'RGBA(255, 75, 110, 0.41)'
  ]
}
