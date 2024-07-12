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
  ]
}
