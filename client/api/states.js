module.exports = {
  1: {
    1: { State: 'Falta operación', Color: '#E57373' },
    2: { State: 'Marcha', Color: '#388E3C' },
    4: { State: 'Sin pedido de producto', Color: '#424242' },
    8: { State: 'Falla en envío de producto', Color: '#F57C00' },
    16: { State: 'CIP', Color: '#8E24AA' }
  },
  2: {
    1: { State: 'Vacio', Color: '#E57373'},
    2: { State: 'Enviando', Color: '#388E3C'},
    4: { State: 'Falla equipo anterior', Color: '#E53935'},
    8: { State: 'Falla proceso', Color: '#B71C1C'},
    16: { State: 'CIP', Color: '#8E24AA'},
    32: { State: 'Preparacion', Color: '#4DB6AC'},
    64: { State: 'Batch OK', Color: '#64B5F6'},
    128: { State: 'Falla equipo siguiente', Color: '#EF9A9A'}
  },
  3: {
    1: { State: 'Falta operación', Color: '#E57373' },
    2: { State: 'Marcha', Color: '#388E3C' },
    4: { State: 'Falla equipo externo', Color: '#E53935' },
    8: { State: 'Falla equipo propio', Color: '#B71C1C' },
    16: { State: 'Pausado', Color: '#FFB74D' },
    32: { State: 'Abortado', Color: '#FFB74D' },
    64: { State: 'Detenido', Color: '#E91E63' }
  }
}
