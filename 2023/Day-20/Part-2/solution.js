const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");

let modules = {}
let cycles = {}
let finished = false

lines.forEach(module => {
  const [identification, destinations] = module.split('->').map(el => el.trim())
  const type = identification.slice(0, 1)
  const label = identification.slice(1)

  if (type === '&') {
    modules[label] = {
      label: label,
      type: type,
      inputs: {},
      destinations: destinations.split(",").map(el => el.trim())
    }
  } 
})

lines.forEach(module => {
  const [identification, destinations] = module.split('->').map(el => el.trim())

  if (identification === 'broadcaster') {
    modules['broadcaster'] = {
      label: 'broadcaster',
      type: 'broadcaster',
      destinations: destinations.split(",").map(el => el.trim())
    }
  } else {
    const type = identification.slice(0, 1)
    const label = identification.slice(1)
    if (type !== '&') {
      modules[label] = {
        label: label,
        type: type,
        destinations: destinations.split(",").map(el => el.trim())
      }
    }

    modules[label].destinations.forEach(dest => {
      if (modules[dest] && modules[dest].hasOwnProperty('inputs')) {
        modules[dest].inputs[label] = 0

        if (dest === 'rm') {
          cycles[label] = 0
        }
      }
    })
  }
})

let pushed = 0
while (!finished) {
  let processQueue = broadcast(0, 'broadcaster', modules['broadcaster'].destinations)

  while (processQueue.length !== 0) {
    let process = processQueue.shift()
    if (process.receiver === undefined) continue
    //console.log(`${process.sender} -${process.signal ? 'high': 'low'}-> ${process.receiver.label}`)
  
    switch(process.receiver.type) {
      case 'broadcaster': 
        processQueue = [...processQueue, ...broadcast(process.signal, process.sender, process.receiver.destinations)]
        break
      case '%':
        processQueue = [...processQueue, ...flipFlop(process.signal, process.receiver)]
        break
      case '&':
        processQueue = [...processQueue, ...conjunction(process.signal, process.sender, process.receiver)]
    }

    if (finished) break
  }

  pushed += 1
}

function broadcast(signal, origin, destinations) {
  return destinations.map(destination => {
    return {
      sender: origin,
      receiver: modules[destination], 
      signal: signal,
    }
  })
}

function flipFlop(signal, module) {
  if (signal) return []

  module.signal = !module.signal
  return module.destinations.map(el => {
    return {
      sender: module.label, 
      receiver: modules[el], 
      signal: module.signal
    }
  })
}

function conjunction(signal, origin, module) {
  module.inputs[origin] = signal
  const sentSignal = !Object.values(module.inputs).every(el => el)

  if (modules['rm'].inputs.hasOwnProperty(module.label) && Object.values(module.inputs).every(el => !el)) {
    if (cycles[module.label] === 0) {
      cycles[module.label] = pushed + 1
      if (Object.values(cycles).every(el => el)) {
        finished = true
        console.log(leastCommomMultiple(Object.values(cycles)))
      }
    }
  }

  return module.destinations.map(el => {
    return {
      sender: module.label,
      receiver: modules[el],
      signal: sentSignal
    }
  })
}

function leastCommomMultiple(arr) {
  const gcd = (a, b) => (b === 0) ? a : gcd(b, a % b);
  const lcm = (a, b) => a * b / gcd(a, b);
  return arr.reduce((multiple, curr) => lcm(multiple, curr));
}