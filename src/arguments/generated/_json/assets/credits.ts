import type { NonEmptyString } from 'sandstone'

export type JsonCredits = Array<{
  /**
   * Company segment.
   */
  section: string,
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
    discipline: (NonEmptyString | NonEmptyString),
    titles: Array<{
      title: string,
      /**
       * Employees with the title.
       */
      names: Array<string>,
    }>,
  }>,
}>

export type JsonCreditsCompanySegment = {
  /**
   * Company segment.
   */
  section: string,
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
    discipline: (NonEmptyString | NonEmptyString),
    titles: Array<{
      title: string,
      /**
       * Employees with the title.
       */
      names: Array<string>,
    }>,
  }>,
}

export type JsonCreditsDiscipline = {
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
  discipline: (NonEmptyString | NonEmptyString),
  titles: Array<{
    title: string,
    /**
     * Employees with the title.
     */
    names: Array<string>,
  }>,
}

export type JsonCreditsJobTitle = {
  title: string,
  /**
   * Employees with the title.
   */
  names: Array<string>,
}
