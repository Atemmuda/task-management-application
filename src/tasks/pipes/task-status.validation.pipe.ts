import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatusValues = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ];

    private isStatusValid(status: any): boolean {
        const idx = this.allowedStatusValues.indexOf(status)
        return idx !== -1;
    }

    transform(value: any) {
        value = value.toUpperCase();
        
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is an invalid status`)
        }

        return value;
    }
}