import { assert } from 'chai'

import { toBufferKey, fromBufferKey, readKey, writeKey } from '../index.js'

function assertBufferComparison(lesser, greater) {
  for (let i = 0; i < lesser.length; i++) {
    if (lesser[i] < greater[i]) {
      return
    }
    if (lesser[i] > (greater[i] || 0)) {
      assert.fail('Byte ' + i + 'should not be ' + lesser[i]  + '>' + greater[i])
    }
  }
}
//var inspector = require('inspector'); inspector.open(9330, null, true); debugger
let seed = 0;
export function random() {
	seed++;
	let a = seed * 15485863;
	return ((a * a * a) % 2038074743) / 2038074743;
}

suite('key buffers', () => {

  test('numbers equivalence', () => {
    assert.strictEqual(fromBufferKey(toBufferKey(4)), 4)
    assert.strictEqual(fromBufferKey(toBufferKey(-4)), -4)
    assert.strictEqual(fromBufferKey(toBufferKey(3.4)), 3.4)
    assert.strictEqual(fromBufferKey(toBufferKey(Math.PI)), Math.PI)
    assert.strictEqual(fromBufferKey(toBufferKey(9377288)), 9377288)
    assert.strictEqual(fromBufferKey(toBufferKey(1503579323825)), 1503579323825)
    assert.strictEqual(fromBufferKey(toBufferKey(1503579323825.3523532)), 1503579323825.3523532)
    assert.strictEqual(fromBufferKey(toBufferKey(-1503579323825)), -1503579323825)
    assert.strictEqual(fromBufferKey(toBufferKey(0.00005032)), 0.00005032)
    assert.strictEqual(fromBufferKey(toBufferKey(-0.00005032)), -0.00005032)
    assert.strictEqual(fromBufferKey(toBufferKey(0.00000000000000000000000005431)), 0.00000000000000000000000005431)
  })
  test('number comparison', () => {
    assertBufferComparison(toBufferKey(4), toBufferKey(5))
    assertBufferComparison(toBufferKey(1503579323824), toBufferKey(1503579323825))
    assertBufferComparison(toBufferKey(1.4), toBufferKey(2))
    assertBufferComparison(toBufferKey(0.000000001), toBufferKey(0.00000001))
    assertBufferComparison(toBufferKey(-4), toBufferKey(3))
    assertBufferComparison(toBufferKey(0), toBufferKey(1))
    assertBufferComparison(toBufferKey(-0.001), toBufferKey(0))
    assertBufferComparison(toBufferKey(-0.001), toBufferKey(-0.000001))
    assertBufferComparison(toBufferKey(-5236532532532), toBufferKey(-5236532532531))
  })
  test('bigint equivalence', () => {
    assert.strictEqual(fromBufferKey(toBufferKey(-35913040084491349n)), -35913040084491349n)
    assert.strictEqual(fromBufferKey(toBufferKey(6135421331404949076605986n)), 6135421331404949076605986n)
    assert.strictEqual(fromBufferKey(toBufferKey(0xfffffffffffffffffffffn)), 0xfffffffffffffffffffffn)
    assert.strictEqual(fromBufferKey(toBufferKey(12345678901234567890n)), 12345678901234567890n)
    assert.deepEqual(fromBufferKey(toBufferKey([12345678901234567890n, 44])), [12345678901234567890n, 44])
    assert.deepEqual(fromBufferKey(toBufferKey(['hi', 12345678901234567890n])), ['hi', 12345678901234567890n])
    assert.deepEqual(fromBufferKey(toBufferKey([6135421331404949076605986n, 'after'])), [6135421331404949076605986n, 'after'])
    assert.strictEqual(fromBufferKey(toBufferKey(132923456789012345678903533235253252353211125n)), 132923456789012345678903533235253252353211125n)
    assert.strictEqual(fromBufferKey(toBufferKey(352n)), 352)
    let num = 5325n
    for (let i = 0; i < 1100; i++) {
      num *= BigInt(Math.floor(random() * 3 + 1));
      num -= BigInt(Math.floor(random() * 1000));
      assert.strictEqual(BigInt(fromBufferKey(toBufferKey(num))), num)
      assert.strictEqual(BigInt(fromBufferKey(toBufferKey(-num))), -num)
    }
    assert.strictEqual(fromBufferKey(toBufferKey(-352n)), -352)
  })
  test('bigint comparison', () => {
    assertBufferComparison(toBufferKey(0xfffffffffffffffffffffn), toBufferKey(0x100fffffffffffffffffffn))
    assertBufferComparison(toBufferKey(12345678901234567890), toBufferKey(12345678901234567890n))
  })

  test('string equivalence', () => {
    assert.strictEqual(fromBufferKey(toBufferKey('4')), '4')
    assert.strictEqual(fromBufferKey(toBufferKey('hello')), 'hello')
    assert.strictEqual(fromBufferKey(toBufferKey('')), '')
    assert.strictEqual(fromBufferKey(toBufferKey('\x00')), '\x00')
    assert.strictEqual(fromBufferKey(toBufferKey('\x03test\x01\x00')), '\x03test\x01\x00')
    assert.strictEqual(fromBufferKey(toBufferKey('prance 🧚🏻‍♀️🩷')), 'prance 🧚🏻‍♀️🩷')
  })
  test('string comparison', () => {
    assertBufferComparison(toBufferKey('4'), toBufferKey('5'))
    assertBufferComparison(toBufferKey('and'), toBufferKey('bad'))
    assertBufferComparison(toBufferKey('hello'), toBufferKey('hello2'))
    let buffer = Buffer.alloc(1024)
    let end = writeKey(['this is a test', 5.25], buffer, 0)
  })
  test('boolean equivalence', () => {
    assert.strictEqual(fromBufferKey(toBufferKey(true)), true)
    assert.strictEqual(fromBufferKey(toBufferKey(false)), false)
  })

  test('multipart equivalence', () => {
    assert.deepEqual(fromBufferKey(toBufferKey([4, 5])),
      [4, 5])
    assert.deepEqual(fromBufferKey(toBufferKey(['hello', 5.25])),
      ['hello', 5.25])
    assert.deepEqual(fromBufferKey(toBufferKey([true, 1503579323825])),
      [true, 1503579323825])
    assert.deepEqual(fromBufferKey(toBufferKey([-0.2525, 'sec\x00nd'])),
      [-0.2525, 'sec\x00nd'])
    assert.deepEqual(fromBufferKey(toBufferKey([-0.2525, '2nd', '3rd'])),
      [-0.2525, '2nd', '3rd'])
  })

  test('multipart comparison', () => {
    assertBufferComparison(
      Buffer.concat([toBufferKey(4), Buffer.from([30]), toBufferKey(5)]),
      Buffer.concat([toBufferKey(5), Buffer.from([30]), toBufferKey(5)]))
    assertBufferComparison(
      Buffer.concat([toBufferKey(4), Buffer.from([30]), toBufferKey(5)]),
      Buffer.concat([toBufferKey(4), Buffer.from([30]), toBufferKey(6)]))
    assertBufferComparison(
      Buffer.concat([toBufferKey('and'), Buffer.from([30]), toBufferKey(5)]),
      Buffer.concat([toBufferKey('and2'), Buffer.from([30]), toBufferKey(5)]))
    assertBufferComparison(
      Buffer.concat([toBufferKey(4), Buffer.from([30]), toBufferKey('and')]),
      Buffer.concat([toBufferKey(4), Buffer.from([30]), toBufferKey('cat')]))
  })
  test('performance', () => {
    let buffer = Buffer.alloc(1024)
    let start = process.hrtime.bigint()
    let end, value
    for (let i = 0; i < 1000000; i++) {
      end = writeKey('this is a test of a longer string to read and write', buffer, 0)
    }
    console.log('writeKey string time', nextTime(), end)
    for (let i = 0; i < 1000000; i++) {
      value = readKey(buffer, 0, end)
    }
    console.log('readKey string time', nextTime(), value)

    for (let i = 0; i < 1000000; i++) {
      end = writeKey(33456, buffer, 0)
    }
    console.log('writeKey number time', nextTime(), end)

    for (let i = 0; i < 1000000; i++) {
      value = readKey(buffer, 2, end)
    }
    console.log('readKey number time', nextTime(), value)

    for (let i = 0; i < 1000000; i++) {
      end = writeKey(['hello', 33456], buffer, 0)
    }
    console.log('writeKey array time', nextTime(), end, buffer.slice(0, end))

    for (let i = 0; i < 1000000; i++) {
      value = readKey(buffer, 0, end)
    }
    console.log('readKey array time', nextTime(), value)

    function nextTime() {
      let ns = process.hrtime.bigint()
      let elapsed = ns - start
      start = ns
      return Number(elapsed) / 1000000 + 'ns'
    }
  })

})
