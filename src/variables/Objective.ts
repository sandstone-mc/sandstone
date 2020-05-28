export class Objective {
    name: string
    criterion: string
    display: object | undefined

    constructor(name: string, criterion: string, display?: object) {
        this.name = name
        this.criterion = criterion
        this.display = display
    }

    toString() {
        return this.name
    }
}