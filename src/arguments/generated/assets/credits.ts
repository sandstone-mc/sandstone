export type Credits = Array<{
  /**
     * Company segment.
     */
  section: string
  disciplines: Array<{
    /**
         * Value:
         * *either*
         *
         * String length range: 1..
         *
         * *or*
         *
         * String length range: 0
         */
    discipline: (`${any}${string}` | `${any}${string}`)
    titles: Array<{
      title: string
      /**
             * Employees with the title.
             */
      names: Array<string>
    }>
  }>
}>
