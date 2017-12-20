export class MenuItem {
    constructor(
        public icon: string,
        public value: string,
        public url: string,
        public name: string,
        public roles: Array<any>
    ) {
    }
}
