const fs = require('fs');

const filePath = '../input.txt';
const lines = fs.readFileSync(filePath, "utf-8").trim().split("\n");
const PUSH_BUTTOM_COUNT = 1000

let modules = {}
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
    if (type === '&') return

    modules[label] = {
      label: label,
      type: type,
      destinations: destinations.split(",").map(el => el.trim())
    }

    modules[label].destinations.forEach(dest => {
      if (modules[dest] && modules[dest].hasOwnProperty('inputs')) {
        modules[dest].inputs[label] = 0
      }
    })
  }
})

let highSentPartial = 0
let lowSentPartial = 0
let pushed = 0

while (pushed < PUSH_BUTTOM_COUNT) {
  let processQueue = broadcast(0, 'broadcaster', modules['broadcaster'].destinations)
  lowSentPartial += 1

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
  }

  pushed += 1
}

console.log(lowSentPartial, highSentPartial, lowSentPartial * highSentPartial)

function broadcast(signal, origin, destinations) {
  return destinations.map(destination => {
    if (signal) {
      highSentPartial += 1
    } else {
      lowSentPartial += 1
    }

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
    if (module.signal) {
      highSentPartial += 1
    } else {
      lowSentPartial += 1
    }

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

  return module.destinations.map(el => {
    if (sentSignal) {
      highSentPartial += 1
    } else {
      lowSentPartial += 1
    }

    return {
      sender: module.label,
      receiver: modules[el],
      signal: sentSignal
    }
  })
}
