import '@testing-library/jest-dom'

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(str) {
      return Buffer.from(str)
    }
  }
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(buf) {
      return Buffer.from(buf).toString()
    }
  }
}
