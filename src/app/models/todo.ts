export class Todo {
    id: number;
    name: string;
    complete: boolean;

    toggleComplete(): void {
        this.complete = !this.complete;
    }
}
