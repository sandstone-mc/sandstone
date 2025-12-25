import { Score } from 'sandstone/variables'

import type { Flow } from '../Flow'

export function binaryFor(
  flow: Flow,
  from: Score | number,
  to: Score | number,
  callback: (amount: number) => void,
  maximum = 128,
) {
  if (typeof from === 'number' && typeof to === 'number') {
    callback(to - from)
  }

  const { Variable } = flow.sandstoneCore.pack

  const realStart = from instanceof Score ? from : Variable(from)
  const realEnd = to instanceof Score ? to : Variable(to)

  const iterations = realEnd.minus(realStart)

  const _ = flow

  /*
   * For all iterations above the maximum,
   * just do a while loop that calls `maximum` times the callback,
   * until there is less than `maximum` iterations
   */
  _.while(iterations.lessThan(maximum), () => {
    callback(maximum)
    iterations.remove(maximum)
  })

  /*
   * There is now less iterations than the allowed MAXIMUM
   * Start the binary part
   */
  for (let i = 1; i < maximum; i *= 2) {
    _.if(iterations.moduloBy(2).equalTo(1), () => {
      callback(i)
    })

    iterations.dividedBy(2)
  }
}
